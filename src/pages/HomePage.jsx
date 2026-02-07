import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useCompetitionStore from '../store/useCompetitionStore'
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { isCompetitionVisible } from '../utils/dateUtils'
import LoadingSkeleton from '../components/LoadingSkeleton'

const Hero = ({ priorityLombas }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        const displaySlides = priorityLombas.length > 0 ? priorityLombas : [{ id: 'coming-soon' }]
        if (displaySlides.length <= 1) return
        const timer = setInterval(() => {
            handleNext()
        }, 5000)
        return () => clearInterval(timer)
    }, [priorityLombas, currentIndex])

    const handleNext = () => {
        const displaySlides = priorityLombas.length > 0 ? priorityLombas : [{ id: 'coming-soon' }]
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % displaySlides.length)
    }

    const handlePrev = () => {
        const displaySlides = priorityLombas.length > 0 ? priorityLombas : [{ id: 'coming-soon' }]
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length)
    }

    // If no priority competitions, show "Coming Soon" placeholder
    const displaySlides = priorityLombas.length > 0 ? priorityLombas : [{
        id: 'coming-soon',
        title: 'Coming Soon',
        description: 'Lomba unggulan akan segera hadir! Stay tuned untuk kompetisi menarik dari Himatik PNUP.',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop',
        isPlaceholder: true
    }]

    const current = displaySlides[currentIndex]

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 1.05
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        })
    }

    return (
        <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden rounded-[2.5rem] mt-6 shadow-2xl border border-white/10 group">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.5 },
                        scale: { duration: 0.8 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = offset.x
                        if (swipe < -100) handleNext()
                        else if (swipe > 100) handlePrev()
                    }}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                    <img
                        src={current.image_url}
                        alt={current.title}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-himatik-navy via-himatik-navy/60 to-transparent pointer-events-none">
                        <div className="h-full max-w-2xl px-8 md:px-16 flex flex-col justify-center space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-himatik-gold text-himatik-navy text-[10px] font-black tracking-widest uppercase shadow-lg shadow-himatik-gold/20"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-himatik-navy opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-himatik-navy"></span>
                                </span>
                                Lomba Unggulan
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-4xl md:text-7xl font-black text-white leading-[1.1] drop-shadow-2xl"
                            >
                                {current.title}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-white/80 text-base md:text-lg line-clamp-3 max-w-xl font-medium leading-relaxed"
                            >
                                {current.description}
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex gap-4 pt-4"
                            >
                                {!current.isPlaceholder && (
                                    <Link to={`/lomba/${current.id}`} className="flex items-center gap-3 bg-white text-himatik-navy px-10 py-4 rounded-full font-black text-xs tracking-widest hover:bg-himatik-gold transition-all shadow-xl hover:-translate-y-1 pointer-events-auto">
                                        LIHAT DETAIL <ArrowRight className="w-5 h-5 transition-transform" />
                                    </Link>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-4 flex items-center z-20 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handlePrev}
                    className="p-3 rounded-full bg-white/10 hover:bg-himatik-gold text-white hover:text-himatik-navy backdrop-blur-sm transition-all border border-white/20"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center z-20 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleNext}
                    className="p-3 rounded-full bg-white/10 hover:bg-himatik-gold text-white hover:text-himatik-navy backdrop-blur-sm transition-all border border-white/20"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {priorityLombas.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1)
                            setCurrentIndex(idx)
                        }}
                        className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-12 bg-himatik-gold shadow-lg shadow-himatik-gold/50' : 'w-3 bg-white/30 hover:bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}

const CompetitionCard = ({ lomba, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-[0_20px_50px_rgba(20,30,70,0.08)] transition-all duration-500"
        >
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    src={lomba.image_url}
                    alt={lomba.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-4 left-4">
                    <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black tracking-[0.15em] text-himatik-navy shadow-xl border border-white/20 uppercase">
                        {lomba.category}
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-[8px] font-black tracking-[0.2em] uppercase">
                    <div className="flex items-center gap-1.5 text-himatik-gold">
                        <Calendar className="w-3 h-3" />
                        {new Date(lomba.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    {lomba.location && (
                        <div className="flex items-center gap-1.5 text-himatik-blue border-l border-slate-100 pl-4">
                            <MapPin className="w-3 h-3" />
                            {lomba.location}
                        </div>
                    )}
                </div>
                <h3 className="text-lg font-black text-himatik-navy leading-tight group-hover:text-himatik-blue transition-colors line-clamp-2 min-h-[3.5rem]">
                    {lomba.title}
                </h3>
                <p className="text-slate-500 font-medium text-xs line-clamp-2 leading-relaxed">
                    {lomba.description}
                </p>
                <div className="pt-4 flex items-center justify-between border-t border-slate-50 overflow-hidden">
                    <div className="flex flex-wrap gap-1 max-w-[65%]">
                        {lomba.bidang && lomba.bidang.length > 0 ? (
                            lomba.bidang.slice(0, 2).map(b => (
                                <span key={b.id} className="text-[7px] font-black bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md uppercase tracking-tighter whitespace-nowrap">
                                    {b.name}
                                </span>
                            ))
                        ) : (
                            <span className="text-[8px] font-black text-slate-300 tracking-[0.2em] uppercase">Bidang...</span>
                        )}
                        {lomba.bidang && lomba.bidang.length > 2 && (
                            <span className="text-[7px] font-black text-slate-300 px-1.5 py-0.5">+ {lomba.bidang.length - 2}</span>
                        )}
                    </div>
                    <Link to={`/lomba/${lomba.id}`} className="flex items-center gap-1.5 text-[10px] font-black text-himatik-navy hover:text-himatik-gold transition-colors tracking-widest uppercase flex-shrink-0">
                        Detail <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

const HomePage = () => {
    const { competitions, loading, fetchCompetitions } = useCompetitionStore()

    useEffect(() => {
        fetchCompetitions()
    }, [fetchCompetitions])

    const visibleCompetitions = competitions.filter(c => isCompetitionVisible(c.deadline))
    const priorityLombas = visibleCompetitions.filter(c => c.is_priority)

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 pb-32">
                <LoadingSkeleton variant="hero" count={1} />
                <section className="space-y-16">
                    <div className="space-y-4">
                        <div className="h-6 w-32 bg-slate-100 rounded-full animate-pulse" />
                        <div className="h-12 w-64 bg-slate-100 rounded animate-pulse" />
                        <div className="h-6 w-96 bg-slate-100 rounded animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <LoadingSkeleton variant="card" count={8} />
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 pb-32">
            <Hero priorityLombas={priorityLombas} />

            <section className="space-y-16">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1 rounded-full bg-himatik-navy/5 text-himatik-navy text-[10px] font-black tracking-[0.2em] uppercase"
                        >
                            Info Terupdate
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black text-himatik-navy tracking-tighter">Eksplorasi Lomba</h2>
                        <p className="text-slate-400 font-medium max-w-md text-lg">Temukan kompetisi terbaik untuk mengasah skill-mu bersama Himatik PNUP.</p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/lomba" className="inline-flex items-center gap-4 bg-himatik-navy text-white px-10 py-4 rounded-full font-black text-xs tracking-widest hover:bg-himatik-gold hover:text-himatik-navy transition-all shadow-2xl hover:-translate-y-1">
                            LIHAT SEMUA <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {visibleCompetitions.length > 0 ? (
                        visibleCompetitions.map((lomba, index) => (
                            <CompetitionCard key={lomba.id} lomba={lomba} index={index} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center space-y-6">
                            <div className="text-8xl opacity-10">🏆</div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-300">Belum Ada Lomba</h3>
                                <p className="text-slate-400 font-medium max-w-md mx-auto">
                                    Saat ini belum ada kompetisi yang tersedia. Pantau terus untuk informasi lomba terbaru!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default HomePage
