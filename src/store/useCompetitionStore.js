import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import useToastStore from '../hooks/useToast'

const useCompetitionStore = create((set, get) => ({
    competitions: [],
    types: [],
    loading: false,
    error: null,

    // Helper: Upload file to Supabase Storage
    uploadImage: async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        const filePath = `posters/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('competition-posters')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('competition-posters')
            .getPublicUrl(filePath)

        return { url: publicUrl, path: filePath }
    },

    // Helper: Delete file from Supabase Storage
    deleteImageFile: async (path) => {
        if (!path) return
        const { error } = await supabase.storage
            .from('competition-posters')
            .remove([path])
        if (error) console.error('Error deleting image from storage:', error)
    },

    fetchTypes: async () => {
        try {
            const { data, error } = await supabase
                .from('competition_types')
                .select('*')
                .order('name', { ascending: true })

            if (error) throw error
            set({ types: data })
        } catch (error) {
            console.error('Error fetching types:', error.message)
        }
    },

    fetchCompetitions: async () => {
        set({ loading: true, error: null })
        try {
            const { data, error } = await supabase
                .from('competitions')
                .select(`
                    *,
                    bidang:competition_type_pivot(category:competition_types(id, name)),
                    additional_images:competition_images(*)
                `)
                .order('created_at', { ascending: false })

            if (error) throw error

            // Flatten the nested junction table data
            const processedData = data.map(comp => ({
                ...comp,
                bidang: comp.bidang?.map(b => b.category) || []
            }))

            set({ competitions: processedData, loading: false })
        } catch (error) {
            set({ error: error.message, loading: false })
        }
    },

    addCompetition: async (formData) => {
        set({ loading: true, error: null })
        try {
            const { competition, primaryImage, additionalImages } = formData

            // 1. Process Primary Image
            let finalPrimary = {
                url: primaryImage.value,
                path: null,
                source: primaryImage.type
            }

            if (primaryImage.type === 'file' && primaryImage.file) {
                const uploaded = await get().uploadImage(primaryImage.file)
                finalPrimary.url = uploaded.url
                finalPrimary.path = uploaded.path
            }

            // 2. Insert Competition
            const { data: newComp, error: compError } = await supabase
                .from('competitions')
                .insert([{
                    ...competition,
                    image_url: finalPrimary.url,
                    image_path: finalPrimary.path,
                    image_source: finalPrimary.source
                }])
                .select()
                .single()

            if (compError) throw compError

            // 3. Process Types (Many-to-Many)
            if (formData.type_ids && formData.type_ids.length > 0) {
                const pivotEntries = formData.type_ids.map(typeId => ({
                    competition_id: newComp.id,
                    type_id: typeId
                }))
                const { error: pivotError } = await supabase
                    .from('competition_type_pivot')
                    .insert(pivotEntries)
                if (pivotError) throw pivotError
            }

            // 4. Process & Insert Additional Images (Max 4)
            if (additionalImages && additionalImages.length > 0) {
                const imgUploadPromises = additionalImages.map(async (img, index) => {
                    let finalImg = {
                        url: img.value,
                        path: null,
                        source: img.type,
                        competition_id: newComp.id,
                        order: index
                    }

                    if (img.type === 'file' && img.file) {
                        const uploaded = await get().uploadImage(img.file)
                        finalImg.url = uploaded.url
                        finalImg.path = uploaded.path
                    }
                    return finalImg
                })

                const preparedImages = await Promise.all(imgUploadPromises)
                const { error: imgError } = await supabase
                    .from('competition_images')
                    .insert(preparedImages.filter(img => img.url)) // Only insert if URL exists

                if (imgError) throw imgError
            }

            await get().fetchCompetitions()
            set({ loading: false })
            useToastStore.getState().addToast({ type: 'success', message: 'Lomba berhasil ditambahkan!' })
            return { success: true }
        } catch (error) {
            set({ error: error.message, loading: false })
            useToastStore.getState().addToast({ type: 'error', message: 'Gagal menambahkan lomba. Coba lagi.' })
            return { success: false, error: error.message }
        }
    },

    deleteCompetition: async (id) => {
        set({ loading: true, error: null })
        try {
            // 1. Find the competition and its images to get storage paths
            const { data: comp, error: fetchError } = await supabase
                .from('competitions')
                .select('*, competition_images(*)')
                .eq('id', id)
                .single()

            if (fetchError) throw fetchError

            // 2. Collect all storage paths to delete
            const pathsToDeletion = []
            if (comp.image_path) pathsToDeletion.push(comp.image_path)
            comp.competition_images?.forEach(img => {
                if (img.path) pathsToDeletion.push(img.path)
            })

            // 3. Delete from Storage
            if (pathsToDeletion.length > 0) {
                await Promise.all(pathsToDeletion.map(path => get().deleteImageFile(path)))
            }

            // 4. Delete from Database (Cascade will handle competition_images)
            const { error: deleteError } = await supabase
                .from('competitions')
                .delete()
                .eq('id', id)

            if (deleteError) throw deleteError

            set((state) => ({
                competitions: state.competitions.filter((c) => c.id !== id),
                loading: false
            }))
            useToastStore.getState().addToast({ type: 'success', message: 'Lomba berhasil dihapus!' })
        } catch (error) {
            set({ error: error.message, loading: false })
            useToastStore.getState().addToast({ type: 'error', message: 'Gagal menghapus lomba. Coba lagi.' })
        }
    },

    updateCompetition: async (id, formData) => {
        set({ loading: true, error: null })
        try {
            const { competition, primaryImage, additionalImages, deletedPaths = [] } = formData

            // 1. Handle Old File Deletions (if any provided by UI)
            if (deletedPaths.length > 0) {
                await Promise.all(deletedPaths.map(path => get().deleteImageFile(path)))
            }

            // 2. Process Primary Image
            let primaryUpdate = { ...competition }
            if (primaryImage) {
                let finalPrimary = {
                    image_url: primaryImage.value,
                    image_path: null,
                    image_source: primaryImage.type
                }

                if (primaryImage.type === 'file' && primaryImage.file) {
                    const uploaded = await get().uploadImage(primaryImage.file)
                    finalPrimary.image_url = uploaded.url
                    finalPrimary.image_path = uploaded.path
                }
                primaryUpdate = { ...primaryUpdate, ...finalPrimary }
            }

            // 3. Update Competition
            const { error: compError } = await supabase
                .from('competitions')
                .update(primaryUpdate)
                .eq('id', id)

            if (compError) throw compError

            // 4. Update Types (Many-to-Many)
            if (formData.type_ids) {
                // Delete old associations
                await supabase
                    .from('competition_type_pivot')
                    .delete()
                    .eq('competition_id', id)

                // Insert new ones
                if (formData.type_ids.length > 0) {
                    const pivotEntries = formData.type_ids.map(typeId => ({
                        competition_id: id,
                        type_id: typeId
                    }))
                    const { error: pivotError } = await supabase
                        .from('competition_type_pivot')
                        .insert(pivotEntries)
                    if (pivotError) throw pivotError
                }
            }

            // 5. Update Additional Images (Full Reset Pattern for simplicity)
            if (additionalImages) {
                // Fetch current additional images to delete their files if necessary
                const { data: oldImages } = await supabase
                    .from('competition_images')
                    .select('path')
                    .eq('competition_id', id)

                // Note: deletedPaths should ideally cover these, but let's be safe
                // (In a more complex app, we'd only delete changed images)

                await supabase.from('competition_images').delete().eq('competition_id', id)

                const imgUploadPromises = additionalImages.map(async (img, index) => {
                    let finalImg = {
                        url: img.value,
                        path: img.path || null,
                        source: img.type,
                        competition_id: id,
                        order: index
                    }

                    if (img.type === 'file' && img.file) {
                        const uploaded = await get().uploadImage(img.file)
                        finalImg.url = uploaded.url
                        finalImg.path = uploaded.path
                    }
                    return finalImg
                })

                const preparedImages = await Promise.all(imgUploadPromises)
                const { error: imgError } = await supabase
                    .from('competition_images')
                    .insert(preparedImages.filter(img => img.url))

                if (imgError) throw imgError
            }

            await get().fetchCompetitions()
            set({ loading: false })
            return { success: true }
        } catch (error) {
            set({ error: error.message, loading: false })
            return { success: false, error: error.message }
        }
    },

    // Type Management Actions
    addType: async (name) => {
        set({ loading: true, error: null })
        try {
            const { error } = await supabase
                .from('competition_types')
                .insert([{ name }])

            if (error) throw error
            await get().fetchTypes()
            set({ loading: false }) // Reset loading
            useToastStore.getState().addToast({ type: 'success', message: 'Bidang berhasil ditambahkan!' })
            return { success: true }
        } catch (error) {
            set({ error: error.message, loading: false })
            useToastStore.getState().addToast({ type: 'error', message: 'Gagal menambahkan bidang. Coba lagi.' })
            return { success: false, error: error.message }
        }
    },

    updateType: async (id, name) => {
        set({ loading: true, error: null })
        try {
            const { error } = await supabase
                .from('competition_types')
                .update({ name })
                .eq('id', id)

            if (error) throw error
            await get().fetchTypes()
            set({ loading: false }) // Reset loading
            useToastStore.getState().addToast({ type: 'success', message: 'Bidang berhasil diperbarui!' })
            return { success: true }
        } catch (error) {
            set({ error: error.message, loading: false })
            useToastStore.getState().addToast({ type: 'error', message: 'Gagal memperbarui bidang. Coba lagi.' })
            return { success: false, error: error.message }
        }
    },

    deleteType: async (id) => {
        set({ loading: true, error: null })
        try {
            const { error } = await supabase
                .from('competition_types')
                .delete()
                .eq('id', id)

            if (error) throw error
            await get().fetchTypes()
            set({ loading: false }) // Reset loading
            useToastStore.getState().addToast({ type: 'success', message: 'Bidang berhasil dihapus!' })
            return { success: true }
        } catch (error) {
            set({ error: error.message, loading: false })
            useToastStore.getState().addToast({ type: 'error', message: 'Gagal menghapus bidang. Coba lagi.' })
            return { success: false, error: error.message }
        }
    }
}))

export default useCompetitionStore
