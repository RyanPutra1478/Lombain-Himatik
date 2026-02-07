import React, { useState, useEffect } from 'react'
import useCompetitionStore from '../store/useCompetitionStore'
import { Search, Plus, Calendar, ArrowRight, Image as ImageIcon, Trash2, Edit, ExternalLink, Filter, MapPin, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getCompetitionStatus } from '../utils/dateUtils'

const AdminCompetitionsPage = () => {
    const { competitions, types, fetchCompetitions, fetchTypes, addCompetition, updateCompetition, deleteCompetition, loading, error } = useCompetitionStore()
    const [searchTerm, setSearchTerm] = useState('')
    const [bidangSearch, setBidangSearch] = useState('')
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [competitionToDelete, setCompetitionToDelete] = useState(null)

    useEffect(() => {
        fetchCompetitions()
        fetchTypes()
    }, [fetchCompetitions, fetchTypes])
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [formMode, setFormMode] = useState('add')
    const [editingId, setEditingId] = useState(null)
    const [deletedPaths, setDeletedPaths] = useState([]) // Track files to delete on save

    const initialFormState = {
        title: '',
        category: 'Internal',
        type_ids: [],
        deadline: '',
        link: '',
        location: '',
        description: '',
        is_priority: false,
        primaryImage: { type: 'url', value: '', file: null, preview: null, path: null },
        additionalImages: [
            { id: 1, type: 'url', value: '', file: null, preview: null, path: null },
            { id: 2, type: 'url', value: '', file: null, preview: null, path: null },
            { id: 3, type: 'url', value: '', file: null, preview: null, path: null },
            { id: 4, type: 'url', value: '', file: null, preview: null, path: null },
        ]
    }

    const [formData, setFormData] = useState(initialFormState)

    const filtered = competitions.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleOpenAdd = () => {
        setFormMode('add')
        setFormData(initialFormState)
        setDeletedPaths([])
        setIsFormModalOpen(true)
    }

    const handleOpenEdit = (lomba) => {
        setFormMode('edit')
        setEditingId(lomba.id)
        setDeletedPaths([])

        // Map primary image
        const primaryImg = {
            type: lomba.image_source || 'url',
            value: lomba.image_url || '',
            file: null,
            preview: lomba.image_url || null,
            path: lomba.image_path || null
        }

        // Map additional images (exactly 4 slots)
        const additionalImgs = [1, 2, 3, 4].map((id, index) => {
            const img = lomba.additional_images?.[index]
            return {
                id,
                type: img?.source || 'url',
                value: img?.url || '',
                file: null,
                preview: img?.url || null,
                path: img?.path || null
            }
        })

        setFormData({
            title: lomba.title,
            category: lomba.category,
            type_ids: lomba.bidang?.map(b => b.id) || [],
            deadline: lomba.deadline,
            link: lomba.link,
            location: lomba.location || '',
            description: lomba.description,
            is_priority: lomba.is_priority,
            primaryImage: primaryImg,
            additionalImages: additionalImgs
        })
        setIsFormModalOpen(true)
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()

        const submission = {
            competition: {
                title: formData.title,
                category: formData.category,
                deadline: formData.deadline,
                link: formData.link,
                location: formData.location,
                description: formData.description,
                is_priority: formData.is_priority
            },
            primaryImage: formData.primaryImage,
            additionalImages: formData.additionalImages.filter(img => img.preview || img.value),
            deletedPaths // Files to delete from storage
        }

        let result
        if (formMode === 'add') {
            result = await addCompetition({ ...submission, type_ids: formData.type_ids })
        } else {
            result = await updateCompetition(editingId, { ...submission, type_ids: formData.type_ids })
        }

        if (result.success) {
            setIsFormModalOpen(false)
            setFormData(initialFormState)
        } else {
            alert('Gagal menyimpan: ' + result.error)
        }
    }

    const handleDeleteClick = (competition) => {
        setCompetitionToDelete(competition)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = () => {
        if (competitionToDelete) {
            deleteCompetition(competitionToDelete.id)
            setIsDeleteModalOpen(false)
            setCompetitionToDelete(null)
        }
    }

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-himatik-navy tracking-tight">Kelola Kompetisi</h1>
                    <p className="text-slate-400 font-medium text-[11px] md:text-sm">Update informasi lomba untuk mahasiswa Himatik.</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="inline-flex items-center justify-center gap-2 bg-himatik-navy text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs tracking-widest hover:bg-himatik-gold hover:text-himatik-navy transition-all shadow-xl shadow-himatik-navy/10 active:scale-[0.98] uppercase w-full md:w-auto"
                >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" /> TAMBAH LOMBA
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-himatik-navy transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari judul atau kategori..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-himatik-navy rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm"
                    />
                </div>
                <button className="px-6 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-xs tracking-widest border border-transparent hover:border-slate-100 transition-all flex items-center gap-3 uppercase">
                    <Filter className="w-4 h-4" /> Filter
                </button>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kompetisi</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategori</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lokasi</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deadline</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((lomba) => (
                                <tr key={lomba.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 aspect-[4/5] rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 relative">
                                                <img src={lomba.image_url} alt="" className="w-full h-full object-cover" />
                                                {lomba.is_priority && (
                                                    <div className="absolute top-0 right-0 p-1 bg-himatik-gold text-white rounded-bl-lg">
                                                        <Star className="w-2.5 h-2.5 fill-current" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-himatik-navy leading-normal line-clamp-1">{lomba.title}</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {lomba.bidang && lomba.bidang.length > 0 ? (
                                                        lomba.bidang.map(b => (
                                                            <span key={b.id} className="text-[8px] font-black bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                                                {b.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Pilih Bidang...</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${lomba.category === 'Internal' ? 'bg-himatik-navy/5 text-himatik-navy' : 'bg-himatik-gold/10 text-himatik-gold'
                                            }`}>
                                            {lomba.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-himatik-blue">{lomba.location || '-'}</span>
                                            {!lomba.location && <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Kosong</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-600">
                                                {new Date(lomba.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase">{new Date(lomba.deadline).getFullYear()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {(() => {
                                            const status = getCompetitionStatus(lomba.deadline);
                                            return (
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${status.code === 'ACTIVE' ? 'bg-green-500' : status.code === 'EXPIRED' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${status.color}`}>{status.label}</span>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEdit(lomba)}
                                                className="p-3 bg-slate-50 text-slate-400 hover:text-himatik-navy hover:bg-white hover:shadow-lg rounded-xl transition-all"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(lomba)}
                                                className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all"
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
                {filtered.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <div className="text-6xl text-slate-100">🚫</div>
                        <h3 className="text-xl font-bold text-slate-300">Data tidak ditemukan</h3>
                    </div>
                )}
            </div>

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
                            className="relative bg-white w-full max-w-md rounded-3xl md:rounded-[2.5rem] shadow-2xl p-6 md:p-10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                            <div className="space-y-6 text-center">
                                <div className="mx-auto w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-4">
                                    <Trash2 className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl md:text-2xl font-black text-himatik-navy tracking-tight">Hapus Kompetisi?</h3>
                                    <p className="text-slate-400 font-medium leading-relaxed">
                                        Apakah Anda yakin ingin menghapus <span className="text-himatik-navy font-bold">"{competitionToDelete?.title}"</span>? Tindakan ini tidak dapat dibatalkan.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="py-4 rounded-2xl font-black text-xs tracking-widest uppercase bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all active:scale-95"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="py-4 rounded-2xl font-black text-xs tracking-widest uppercase bg-red-500 text-white shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
                                    >
                                        Ya, Hapus
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Form Modal (Add/Edit) */}
            <AnimatePresence>
                {isFormModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFormModalOpen(false)}
                            className="absolute inset-0 bg-himatik-navy/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white w-full max-w-2xl rounded-3xl md:rounded-[2.5rem] shadow-2xl p-6 md:p-10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-himatik-gold/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                            <h2 className="text-xl md:text-2xl font-black text-himatik-navy tracking-tight mb-6 md:mb-8">
                                {formMode === 'add' ? 'Tambah Kompetisi Baru' : 'Edit Kompetisi'}
                            </h2>

                            <form onSubmit={handleFormSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
                                {/* Full-width: Judul Lomba */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Judul Lomba</label>
                                    <input
                                        type="text" required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-himatik-navy outline-none transition-all font-bold text-sm"
                                        placeholder="Ketik judul perlombaan..."
                                    />
                                </div>

                                {/* Full-width: Bidang Lomba */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bidang Lomba</label>
                                        <div className="relative group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300 group-focus-within:text-himatik-navy transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Cari bidang..."
                                                value={bidangSearch}
                                                onChange={(e) => setBidangSearch(e.target.value)}
                                                className="pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-bold outline-none focus:border-himatik-navy/30 focus:bg-white transition-all w-32 md:w-40"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50/50 rounded-2xl border border-slate-100 max-h-[160px] overflow-y-auto scrollbar-hide">
                                        {types
                                            .filter(t => t.name.toLowerCase().includes(bidangSearch.toLowerCase()))
                                            .map((t) => {
                                                const isSelected = formData.type_ids.includes(t.id);
                                                return (
                                                    <button
                                                        key={t.id}
                                                        type="button"
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                setFormData({
                                                                    ...formData,
                                                                    type_ids: formData.type_ids.filter(id => id !== t.id)
                                                                });
                                                            } else {
                                                                setFormData({
                                                                    ...formData,
                                                                    type_ids: [...formData.type_ids, t.id]
                                                                });
                                                            }
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border-2 ${isSelected
                                                            ? 'bg-himatik-navy text-white border-himatik-navy shadow-md shadow-himatik-navy/10'
                                                            : 'bg-white text-slate-400 border-transparent hover:border-slate-200 hover:text-slate-500'
                                                            }`}
                                                    >
                                                        {t.name}
                                                    </button>
                                                );
                                            })}
                                        {types.length === 0 && (
                                            <span className="text-[10px] italic text-slate-300 py-4 w-full text-center">Belum ada bidang master...</span>
                                        )}
                                        {types.length > 0 && types.filter(t => t.name.toLowerCase().includes(bidangSearch.toLowerCase())).length === 0 && (
                                            <span className="text-[10px] italic text-slate-300 py-4 w-full text-center">Bidang tidak ditemukan...</span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-himatik-navy outline-none transition-all font-bold text-sm appearance-none"
                                        >
                                            <option value="Internal">Internal</option>
                                            <option value="Eksternal">Eksternal</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</label>
                                        <input
                                            type="date" required
                                            value={formData.deadline}
                                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-himatik-navy outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Full-width: Tempat/Lokasi */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tempat/Lokasi</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-himatik-navy transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full pl-12 pr-5 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-himatik-navy outline-none transition-all font-bold text-sm"
                                            placeholder="Contoh: Online, Gedung PKM PNUP, atau Zoom Meeting"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <ImageIcon className="w-3 h-3" /> Manajemen Media & Live Preview
                                    </h3>

                                    {/* Primary Image & Previews Section */}
                                    <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                            {/* Input Slot (Left) */}
                                            <div className="md:col-span-3 space-y-3">
                                                <label className="text-[10px] font-black text-himatik-gold uppercase tracking-tighter">1. Input Cover Utama</label>
                                                <div
                                                    onClick={() => formData.primaryImage.type === 'file' && document.getElementById('primary-file').click()}
                                                    className={`relative aspect-[4/5] bg-white rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden group transition-all ${formData.primaryImage.type === 'file' ? 'cursor-pointer hover:border-himatik-navy' : 'cursor-default opacity-80'}`}
                                                >
                                                    {formData.primaryImage.preview ? (
                                                        <img src={formData.primaryImage.preview} alt="Primary" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-1 text-center p-2">
                                                            <ImageIcon className="w-6 h-6" />
                                                            <span className="text-[8px] font-black uppercase">Cover Utama</span>
                                                        </div>
                                                    )}
                                                    {formData.primaryImage.type === 'file' && (
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Edit className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex bg-slate-200 p-0.5 rounded-lg text-[8px] font-black uppercase">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, primaryImage: { ...prev.primaryImage, type: 'file' } }))}
                                                        className={`flex-1 py-1.5 rounded-md transition-all ${formData.primaryImage.type === 'file' ? 'bg-white text-himatik-navy shadow-sm' : 'text-slate-400'}`}
                                                    >FILE</button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, primaryImage: { ...prev.primaryImage, type: 'url', file: null } }))}
                                                        className={`flex-1 py-1.5 rounded-md transition-all ${formData.primaryImage.type === 'url' ? 'bg-white text-himatik-navy shadow-sm' : 'text-slate-400'}`}
                                                    >LINK</button>
                                                </div>

                                                {formData.primaryImage.type === 'url' ? (
                                                    <input
                                                        type="url" placeholder="Paste image link..."
                                                        value={formData.primaryImage.value}
                                                        onChange={(e) => {
                                                            const url = e.target.value;
                                                            setFormData(prev => ({ ...prev, primaryImage: { ...prev.primaryImage, value: url, preview: url } }))
                                                        }}
                                                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 outline-none font-bold text-[9px] focus:border-himatik-navy"
                                                    />
                                                ) : (
                                                    <input
                                                        id="primary-file" type="file" accept="image/*" className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setFormData(prev => ({ ...prev, primaryImage: { ...prev.primaryImage, file, preview: reader.result } }))
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </div>

                                            {/* Previews (Right) */}
                                            <div className="md:col-span-9 space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">2. Preview Banner Hero (Proporsi Beranda)</label>
                                                <div className="relative w-full h-[250px] bg-himatik-navy rounded-2xl overflow-hidden shadow-xl border border-white/10 group">
                                                    {formData.primaryImage.preview ? (
                                                        <img src={formData.primaryImage.preview} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-white/10 gap-2">
                                                            <ImageIcon className="w-8 h-8" />
                                                            <span className="italic text-[10px]">No Banner Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Images Section */}
                                    <div className="space-y-3 pt-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4. Gambar Tambahan (Slider Detail)</label>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            {formData.additionalImages.map((img, idx) => (
                                                <div key={img.id} className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                    <div
                                                        onClick={() => img.type === 'file' && document.getElementById(`file-${img.id}`).click()}
                                                        className={`relative aspect-[4/5] bg-white rounded-xl border border-slate-200 overflow-hidden group transition-all ${img.type === 'file' ? 'cursor-pointer' : 'cursor-default opacity-60'}`}
                                                    >
                                                        {img.preview ? (
                                                            <img src={img.preview} alt={`Extra ${idx}`} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                                                                <Plus className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                        {img.type === 'file' && (
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                <Edit className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                        {img.preview && (
                                                            <div className="absolute top-2 right-2 flex gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (img.path) setDeletedPaths(p => [...p, img.path]);
                                                                        const updated = formData.additionalImages.map(item =>
                                                                            item.id === img.id ? { ...item, value: '', file: null, preview: null, path: null } : item
                                                                        );
                                                                        setFormData(prev => ({ ...prev, additionalImages: updated }));
                                                                    }}
                                                                    className="p-1.5 bg-white/90 backdrop-blur shadow-sm rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex bg-slate-200 p-0.5 rounded-lg text-[7px] font-black uppercase">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = formData.additionalImages.map(item => item.id === img.id ? { ...item, type: 'file' } : item);
                                                                setFormData(prev => ({ ...prev, additionalImages: updated }));
                                                            }}
                                                            className={`flex-1 py-1 rounded-md transition-all ${img.type === 'file' ? 'bg-white text-himatik-navy shadow-sm' : 'text-slate-400'}`}
                                                        >FILE</button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = formData.additionalImages.map(item => item.id === img.id ? { ...item, type: 'url', file: null } : item);
                                                                setFormData(prev => ({ ...prev, additionalImages: updated }));
                                                            }}
                                                            className={`flex-1 py-1 rounded-md transition-all ${img.type === 'url' ? 'bg-white text-himatik-navy shadow-sm' : 'text-slate-400'}`}
                                                        >LINK</button>
                                                    </div>

                                                    {img.type === 'url' ? (
                                                        <input
                                                            type="url" placeholder="Link..."
                                                            value={img.value}
                                                            onChange={(e) => {
                                                                const url = e.target.value;
                                                                const updated = formData.additionalImages.map(item =>
                                                                    item.id === img.id ? { ...item, value: url, preview: url } : item
                                                                );
                                                                setFormData(prev => ({ ...prev, additionalImages: updated }));
                                                            }}
                                                            className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-200 outline-none font-bold text-[8px] focus:border-himatik-navy"
                                                        />
                                                    ) : (
                                                        <input
                                                            id={`file-${img.id}`} type="file" accept="image/*" className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        const updated = formData.additionalImages.map(item =>
                                                                            item.id === img.id ? { ...item, file, preview: reader.result } : item
                                                                        );
                                                                        setFormData(prev => ({ ...prev, additionalImages: updated }));
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                                    <div className="md:col-span-8 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Link Pendaftaran</label>
                                        <input
                                            type="text"
                                            value={formData.link}
                                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-himatik-navy outline-none transition-all font-bold text-sm"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="md:col-span-4 space-y-2">
                                        <div className="h-[14px]"></div> {/* Spacer for alignment with label */}
                                        <div className="flex items-center gap-3 bg-slate-50 p-[1.14rem] rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                                            <input
                                                type="checkbox"
                                                id="is_priority"
                                                checked={formData.is_priority}
                                                onChange={(e) => setFormData({ ...formData, is_priority: e.target.checked })}
                                                className="w-5 h-5 accent-himatik-navy rounded"
                                            />
                                            <label htmlFor="is_priority" className="text-[10px] font-black text-slate-600 uppercase tracking-wider cursor-pointer">Lomba Unggulan</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi Singkat</label>
                                    <textarea
                                        required rows="4"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-himatik-navy outline-none transition-all font-bold text-sm resize-none"
                                        placeholder="Tuliskan deskripsi singkat mengenai lomba ini..."
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormModalOpen(false)}
                                        className="py-5 rounded-2xl font-black text-xs tracking-widest uppercase bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="py-5 rounded-2xl font-black text-xs tracking-widest uppercase bg-himatik-navy text-white shadow-xl shadow-himatik-navy/20 hover:bg-himatik-gold hover:text-himatik-navy transition-all active:scale-[0.98]"
                                    >
                                        SIMPAN DATA
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminCompetitionsPage
