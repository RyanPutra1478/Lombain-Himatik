import React, { useState, useEffect } from 'react'
import useCompetitionStore from '../store/useCompetitionStore'
import { Search, Filter, Calendar, ArrowRight, Grid, List as ListIcon, X, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { isCompetitionVisible } from '../utils/dateUtils'

const CompetitionListPage = () => {
    const { competitions, types, fetchCompetitions, fetchTypes } = useCompetitionStore()
    const [searchTerm, setSearchTerm] = useState('')
    const [activeCategory, setActiveCategory] = useState('Semua')
    const [activeType, setActiveType] = useState('Semua')
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

    useEffect(() => {
        fetchCompetitions()
        fetchTypes()
    }, [fetchCompetitions, fetchTypes])

    const compCategories = ['Semua', 'Internal', 'Eksternal']
    const typeFilters = ['Semua', ...types.map(t => t.name)]

    const visibleCompetitions = competitions.filter(c => isCompetitionVisible(c.deadline))

    const filteredCompetitions = visibleCompetitions.filter(comp => {
        const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comp.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = activeCategory === 'Semua' || comp.category === activeCategory
        const matchesType = activeType === 'Semua' || comp.bidang?.some(b => b.name === activeType)
        return matchesSearch && matchesCategory && matchesType
    })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            {/* Header & Search */}
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-himatik-navy tracking-tight"
                    >
                        Cari Kompetisi
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium text-lg"
                    >
                        Jelajahi berbagai peluang untuk berprestasi dan mengasah kemampuanmu.
                    </motion.p>
                </div>

                <div className="max-w-3xl mx-auto relative">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-himatik-gold transition-colors w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Cari judul lomba, kategori, atau bidang..."
                            className="w-full pl-16 pr-6 py-5 bg-white rounded-[2rem] border border-slate-100 shadow-xl focus:ring-4 focus:ring-himatik-navy/5 focus:border-himatik-navy outline-none transition-all font-medium text-slate-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className="lg:w-64 space-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-himatik-navy font-black text-xs tracking-widest uppercase">
                            <Filter className="w-4 h-4" />
                            Filter Lomba
                        </div>

                        <div className="space-y-8">
                            {/* Category Filter */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Kategori</h3>
                                <div className="flex flex-wrap lg:flex-col gap-2">
                                    {compCategories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-bold text-left transition-all ${activeCategory === cat
                                                ? 'bg-himatik-navy text-white shadow-lg shadow-himatik-navy/20'
                                                : 'text-slate-500 hover:bg-white border border-transparent hover:border-slate-100'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Type Filter */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Bidang</h3>
                                <div className="flex flex-wrap lg:flex-col gap-2">
                                    {typeFilters.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setActiveType(t)}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-bold text-left transition-all ${activeType === t
                                                ? 'bg-himatik-gold text-himatik-navy shadow-lg shadow-himatik-gold/20'
                                                : 'text-slate-500 hover:bg-white border border-transparent hover:border-slate-100'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {/* Toolbar */}
                    <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                            {filteredCompetitions.length} Lomba Ditemukan
                        </span>
                        <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-xl">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-himatik-navy' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-himatik-navy' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <ListIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content Grid/List */}
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            layout
                            className={viewMode === 'grid'
                                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                                : "flex flex-col gap-6"
                            }
                        >
                            {filteredCompetitions.length > 0 ? (
                                filteredCompetitions.map((lomba, idx) => (
                                    <CompetitionCardMobile
                                        key={lomba.id}
                                        lomba={lomba}
                                        viewMode={viewMode}
                                        index={idx}
                                    />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full py-20 text-center space-y-4"
                                >
                                    <div className="text-6xl text-slate-200">🔍</div>
                                    <h3 className="text-xl font-bold text-slate-400">Tidak ada lomba yang cocok</h3>
                                    <p className="text-slate-300">Coba ubah kata kunci atau filter pencarian Anda.</p>
                                    <button
                                        onClick={() => { setSearchTerm(''); setActiveCategory('Semua'); setActiveType('Semua'); }}
                                        className="text-himatik-navy font-bold hover:underline"
                                    >
                                        Reset Pencarian
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

const CompetitionCardMobile = ({ lomba, viewMode, index }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`group bg-white border border-slate-100 hover:shadow-2xl transition-all duration-500 overflow-hidden ${viewMode === 'grid' ? 'rounded-3xl' : 'rounded-2xl flex flex-col md:flex-row h-full md:h-40'
                }`}
        >
            <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'aspect-[4/5]' : 'aspect-[4/5] md:w-52'}`}>
                <img
                    src={lomba.image_url}
                    alt={lomba.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
            </div>

            <div className={`p-5 flex flex-col justify-between flex-1 ${viewMode === 'grid' ? 'space-y-3' : 'space-y-2 md:p-6'}`}>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-himatik-gold tracking-[0.2em] uppercase">
                            {lomba.category}
                        </span>
                        <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
                            {lomba.bidang && lomba.bidang.length > 0 ? (
                                lomba.bidang.slice(0, 2).map(b => (
                                    <span key={b.id} className="text-[7px] font-bold text-slate-300 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded-md">
                                        {b.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Bidang...</span>
                            )}
                            {lomba.bidang && lomba.bidang.length > 2 && (
                                <span className="text-[7px] font-black text-slate-300 px-1.5 py-0.5 tracking-tighter self-center">+ {lomba.bidang.length - 2}</span>
                            )}
                        </div>
                    </div>
                    <h3 className={`font-black text-himatik-navy leading-tight ${viewMode === 'grid' ? 'text-lg line-clamp-2 min-h-[3rem]' : 'text-base line-clamp-1'}`}>
                        {lomba.title}
                    </h3>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
                    <div className="flex flex-wrap gap-3 items-center text-[9px] font-black text-slate-400">
                        <div className="flex items-center gap-1.5 transition-colors group-hover:text-himatik-gold">
                            <Calendar className="w-3 h-3" />
                            {new Date(lomba.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </div>
                        {lomba.location && (
                            <div className="flex items-center gap-1.5 text-himatik-blue border-l border-slate-100 pl-3">
                                <MapPin className="w-3 h-3" />
                                {lomba.location}
                            </div>
                        )}
                    </div>
                    <Link to={`/lomba/${lomba.id}`} className="flex items-center gap-1 text-[10px] font-black text-himatik-navy hover:text-himatik-gold transition-colors tracking-widest uppercase">
                        DETAIL <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

export default CompetitionListPage
