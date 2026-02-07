import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useSettingsStore = create((set, get) => ({
    settings: {},
    loading: false,
    error: null,

    // Fetch all settings
    fetchSettings: async () => {
        set({ loading: true, error: null })
        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('*')

            if (error) throw error

            // Convert array to object for easier access
            const settingsObj = {}
            data.forEach(setting => {
                settingsObj[setting.key] = setting.value
            })

            set({ settings: settingsObj, loading: false })
        } catch (error) {
            set({ error: error.message, loading: false })
            console.error('Error fetching settings:', error)
        }
    },

    // Update a setting
    updateSetting: async (key, value) => {
        set({ loading: true, error: null })
        try {
            const { error } = await supabase
                .from('app_settings')
                .upsert(
                    { key, value, updated_at: new Date().toISOString() },
                    { onConflict: 'key' }
                )

            if (error) throw error

            // Update local state
            set(state => ({
                settings: { ...state.settings, [key]: value },
                loading: false
            }))

            return { success: true }
        } catch (error) {
            set({ error: error.message, loading: false })
            return { success: false, error: error.message }
        }
    },

    // Get a specific setting
    getSetting: (key, defaultValue = '') => {
        const { settings } = get()
        return settings[key] || defaultValue
    }
}))

export default useSettingsStore
