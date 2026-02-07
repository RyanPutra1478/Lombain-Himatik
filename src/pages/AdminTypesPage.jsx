import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit2, Search, Tag, AlertCircle } from 'lucide-react'
import useCompetitionStore from '../store/useCompetitionStore'

const AdminTypesPage = () => {
    const { types, fetchTypes, addType, updateType, deleteType, loading, error } = useCompetitionStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [formMode, setFormMode] = useState('add') // 'add' or 'edit'
    const [selectedType, setSelectedType] = useState(null)
    const [typeName, setTypeName] = useState('')

    useEffect(() => {
        fetchTypes()
    }, [fetchTypes])

    const filteredTypes = types.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleOpenModal = (mode, type = null) => {
        setFormMode(mode)
        setSelectedType(type)
        setTypeName(type ? type.name : '')
        setIsModalOpen(true)
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        if (!typeName.trim()) return

        let res
        if (formMode === 'add') {
            res = await addType(typeName)
        } else {
            res = await updateType(selectedType.id, typeName)
        }

        if (res.success) {
            setIsModalOpen(false)
            setTypeName('')
        }
    }

    const confirmDelete = async () => {
        if (!selectedType) return
        const res = await deleteType(selectedType.id)
        if (res.success) {
            setIsDeleteModalOpen(false)
            setSelectedType(null)
        }
    }

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-himatik-navy tracking-tight">Kelola Bidang</h1>
                    <p className="text-slate-400 font-medium text-[11px] md:text-sm">Manajemen master data Bidang Lomba</p>
                </div>
                <button
                    onClick={() => handleOpenModal('add')}
                    className="flex items-center justify-center gap-2 md:gap-3 bg-himatik-navy text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs tracking-widest uppercase hover:bg-himatik-gold hover:text-himatik-navy transition-all shadow-xl shadow-himatik-navy/10 active:scale-95 group w-full md:w-auto"
                >
                    <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform" />
                    Tambah Bidang
                </button>
            </div>

            {/* Error Alert */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm"
                >
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </motion.div>
            )}

            {/* Stats & Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 md:gap-5">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-himatik-navy/5 rounded-xl md:rounded-2xl flex items-center justify-center text-himatik-navy">
                        <Tag className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                        <div className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Total Bidang</div>
                        <div className="text-xl md:text-2xl font-black text-himatik-navy">{types.length}</div>
                    </div>
                </div>

                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 md:w-5 md:h-5" />
                    <input
                        type="text"
                        placeholder="Cari bidang lomba..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-full pl-12 md:pl-16 pr-6 md:pr-8 py-4 md:py-0 bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm outline-none focus:border-himatik-navy transition-all font-bold text-sm"
                    />
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Bidang</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredTypes.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className="font-black text-himatik-navy">{t.name}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <code className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-400">{t.id.substring(0, 8)}...</code>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal('edit', t)}
                                                className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-himatik-navy hover:text-white transition-all group/btn"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedType(t)
                                                    setIsDeleteModalOpen(true)
                                                }}
                                                className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredTypes.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <div className="text-6xl text-slate-100 opacity-20">🏷️</div>
                        <h3 className="text-xl font-bold text-slate-300">Belum ada bidang lomba</h3>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-himatik-navy/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white w-full max-w-md rounded-3xl md:rounded-[2.5rem] shadow-2xl p-6 md:p-10 overflow-hidden"
                        >
                            <h2 className="text-xl md:text-2xl font-black text-himatik-navy tracking-tight mb-6 md:mb-8">
                                {formMode === 'add' ? 'Tambah Bidang Lomba' : 'Edit Bidang Lomba'}
                            </h2>
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Bidang</label>
                                    <input
                                        type="text" required autoFocus
                                        value={typeName}
                                        onChange={(e) => setTypeName(e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-himatik-navy outline-none transition-all font-bold text-sm"
                                        placeholder="Misal: UI/UX Design, Web Dev..."
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 rounded-2xl font-black text-xs tracking-widest uppercase bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-4 rounded-2xl font-black text-xs tracking-widest uppercase bg-himatik-navy text-white shadow-xl shadow-himatik-navy/20 hover:bg-himatik-gold hover:text-himatik-navy transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute inset-0 bg-himatik-navy/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white w-full max-w-md rounded-3xl md:rounded-[2.5rem] shadow-2xl p-6 md:p-10 text-center"
                        >
                            <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-red-50 rounded-2xl md:rounded-3xl flex items-center justify-center text-red-500 mb-4 md:mb-6">
                                <Trash2 className="w-8 h-8 md:w-10 md:h-10" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-himatik-navy tracking-tight mb-2">Hapus Bidang?</h3>
                            <p className="text-slate-400 font-medium leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
                                Menghapus bidang <span className="text-himatik-navy font-bold">"{selectedType?.name}"</span>
                                mungkin akan menyebabkan kompetisi terkait kehilangan kategori bidangnya.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="py-4 rounded-2xl font-black text-xs tracking-widest uppercase bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all font-bold"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="py-4 rounded-2xl font-black text-xs tracking-widest uppercase bg-red-500 text-white shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all font-bold"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminTypesPage
