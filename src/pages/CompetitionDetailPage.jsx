import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useCompetitionStore from '../store/useCompetitionStore'
import { Calendar, ArrowLeft, ExternalLink, Tag, MapPin, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CompetitionDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { competitions, fetchCompetitions } = useCompetitionStore()
    const [comp, setComp] = useState(null)
    const [activeImage, setActiveImage] = useState(0)
    const [allImages, setAllImages] = useState([])
    const [direction, setDirection] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    useEffect(() => {
        if (competitions.length === 0) {
            fetchCompetitions()
        }
    }, [fetchCompetitions, competitions.length])

    useEffect(() => {
        if (competitions.length > 0) {
            const found = competitions.find(c => c.id === id)
            setComp(found)
        }
    }, [id, competitions])

    useEffect(() => {
        if (comp) {
            const combined = [
                { url: comp.image_url, id: 'primary' },
                ...(comp.additional_images || []).filter(img => img.url)
            ]
            setAllImages(combined)
        }
    }, [comp])

    const handleNext = () => {
        setDirection(1)
        setActiveImage((prev) => (prev + 1) % allImages.length)
    }

    const handlePrev = () => {
        setDirection(-1)
        setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length)
    }

    // Modal Navigation Logic
    const handleNextModal = (e) => {
        e.stopPropagation()
        setDirection(1)
        setActiveImage((prev) => (prev + 1) % allImages.length)
    }

    const handlePrevModal = (e) => {
        e.stopPropagation()
        setDirection(-1)
        setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length)
    }

    if (!comp) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-himatik-navy"></div>
        </div>
    )

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 500 : -500,
            opacity: 0,
            scale: 0.95
        })
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-himatik-navy transition-colors font-bold text-sm tracking-widest uppercase group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Kembali
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Visuals - Gallery Slider */}
                <div className="space-y-6">
                    <div
                        onClick={() => setIsLightboxOpen(true)}
                        className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 bg-slate-50 group/slider cursor-zoom-in"
                    >
                        <AnimatePresence initial={false} custom={direction} mode="popLayout">
                            <motion.div
                                key={activeImage}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.4 }
                                }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={allImages[activeImage]?.url}
                                    alt={comp.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white text-white hover:text-himatik-navy backdrop-blur-md transition-all opacity-0 group-hover/slider:opacity-100 z-10"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white text-white hover:text-himatik-navy backdrop-blur-md transition-all opacity-0 group-hover/slider:opacity-100 z-10"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>

                    {allImages.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {allImages.map((img, idx) => (
                                <button
                                    key={img.id || idx}
                                    onClick={() => {
                                        setDirection(idx > activeImage ? 1 : -1)
                                        setActiveImage(idx)
                                    }}
                                    className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-himatik-gold scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Information */}
                <div className="space-y-10">
                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-3">
                            <span className="px-5 py-1.5 rounded-full bg-himatik-navy/5 text-himatik-navy text-[10px] font-black tracking-widest uppercase">
                                {comp.category}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {comp.bidang && comp.bidang.length > 0 ? (
                                    comp.bidang.map(b => (
                                        <span key={b.id} className="px-5 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black tracking-widest uppercase border border-slate-200">
                                            {b.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="px-5 py-1.5 rounded-full bg-himatik-navy/5 text-himatik-navy text-[10px] font-black tracking-widest uppercase">
                                        Bidang...
                                    </span>
                                )}
                            </div>
                            {comp.is_priority && (
                                <span className="px-5 py-1.5 rounded-full bg-himatik-gold text-himatik-navy text-[10px] font-black tracking-widest uppercase shadow-lg shadow-himatik-gold/20">
                                    Unggulan
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-himatik-navy leading-tight tracking-tighter">
                            {comp.title}
                        </h1>

                        <div className="flex flex-wrap gap-8 items-center pt-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Deadline</span>
                                    <span className="text-sm font-black text-himatik-navy">
                                        {new Date(comp.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Tempat</span>
                                    <span className="text-sm font-black text-himatik-navy">
                                        {comp.location || 'Belum Ada Informasi (TBD)'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-himatik-navy tracking-tight border-b border-slate-100 pb-4">
                            Deskripsi Lomba
                        </h2>
                        <p className="text-slate-500 font-medium leading-relaxed md:text-lg">
                            {comp.description}
                        </p>
                        <p className="text-slate-400 text-sm italic">
                            *Informasi lebih lanjut dapat dilihat melalui link pendaftaran resmi di bawah ini.
                        </p>
                    </div>

                    <div className="pt-10 flex flex-col sm:flex-row gap-4">
                        <a
                            href={comp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-3 bg-himatik-navy text-white px-10 py-5 rounded-full font-black text-sm tracking-widest hover:bg-himatik-gold hover:text-himatik-navy transition-all shadow-2xl hover:-translate-y-1 uppercase"
                        >
                            Daftar Sekarang <ExternalLink className="w-4 h-4" />
                        </a>
                        <button className="p-5 rounded-full bg-slate-100 text-slate-600 hover:bg-himatik-navy hover:text-white transition-all shadow-lg group">
                            <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsLightboxOpen(false)}
                        className="fixed inset-0 z-[100] bg-himatik-navy/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                    >
                        <button
                            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl h-full flex items-center justify-center cursor-default"
                        >
                            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                <motion.div
                                    key={activeImage}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.4 }
                                    }}
                                    className="w-full h-full flex items-center justify-center p-4 md:p-0"
                                >
                                    <img
                                        src={allImages[activeImage]?.url}
                                        alt=""
                                        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl pointer-events-none"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevModal}
                                        className="absolute left-0 h-full flex items-center px-4 md:px-8 text-white/50 hover:text-white transition-all z-[120] group/nav"
                                    >
                                        <ChevronLeft className="w-10 h-10 drop-shadow-lg group-hover/nav:scale-110 transition-transform" />
                                    </button>
                                    <button
                                        onClick={handleNextModal}
                                        className="absolute right-0 h-full flex items-center px-4 md:px-8 text-white/50 hover:text-white transition-all z-[120] group/nav"
                                    >
                                        <ChevronRight className="w-10 h-10 drop-shadow-lg group-hover/nav:scale-110 transition-transform" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Counter */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 font-black text-xs tracking-widest uppercase">
                            {activeImage + 1} / {allImages.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CompetitionDetailPage
