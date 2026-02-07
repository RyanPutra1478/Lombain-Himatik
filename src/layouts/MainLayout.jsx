import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Menu, X, Home, Search, ChevronRight, Mail } from 'lucide-react'
import logo from '../assets/himatik.png'
import { motion, AnimatePresence } from 'framer-motion'
import useSettingsStore from '../store/useSettingsStore'

const MainLayout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const location = useLocation()
    const { settings, fetchSettings } = useSettingsStore()

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    const whatsappNumber = settings.admin_whatsapp || '6281234567890'
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=Halo%20Admin%20Himatik,%20saya%20ingin%20bertanya%20tentang%20lomba`

    const navLinks = [
        { name: 'Beranda', path: '/', icon: Home },
        { name: 'Cari Lomba', path: '/lomba', icon: Search },
    ]

    return (
        <div className="min-h-screen bg-slate-50 transition-colors duration-300">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white group-hover:scale-105 transition-transform duration-300 p-1 shadow-sm border border-slate-100">
                                <img src={logo} alt="Logo Himatik" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-himatik-navy tracking-tighter leading-none uppercase">
                                    Lomba-in
                                </span>
                                <span className="text-[10px] font-bold text-himatik-gold tracking-[0.2em] uppercase">
                                    Himatik PNUP
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-10 text-himatik-navy font-bold text-sm uppercase tracking-wider">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`transition-colors hover:text-himatik-gold ${location.pathname === link.path ? 'text-himatik-gold' : ''}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link to="/admin" className="flex items-center gap-2 bg-himatik-navy text-white px-6 py-2.5 rounded-full hover:bg-himatik-gold hover:text-himatik-navy transition-all shadow-lg hover:shadow-himatik-gold/20 font-black">
                                <LayoutDashboard className="w-4 h-4" />
                                Admin Panel
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="p-2.5 rounded-xl bg-slate-50 text-himatik-navy hover:bg-himatik-gold transition-all active:scale-95"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-himatik-navy/40 backdrop-blur-sm z-[60] md:hidden"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white z-[70] md:hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-8 flex items-center justify-between border-b border-slate-50">
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-himatik-gold uppercase tracking-widest">Menu Navigasi</span>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none mt-1">Lomba-in PNUP</span>
                                </div>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 p-8 space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center justify-between p-5 rounded-[1.5rem] transition-all group ${location.pathname === link.path
                                            ? 'bg-himatik-navy text-white shadow-xl shadow-himatik-navy/20'
                                            : 'bg-slate-50 text-himatik-navy hover:bg-white hover:shadow-lg'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2.5 rounded-xl ${location.pathname === link.path ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                                                <link.icon className="w-5 h-5" />
                                            </div>
                                            <span className="font-black text-sm uppercase tracking-widest">{link.name}</span>
                                        </div>
                                        <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${location.pathname === link.path ? 'text-white/40' : 'text-slate-300'}`} />
                                    </Link>
                                ))}
                            </div>

                            <div className="p-8 border-t border-slate-50">
                                <Link
                                    to="/admin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center gap-3 w-full bg-himatik-gold text-himatik-navy p-5 rounded-[1.5rem] font-black text-sm tracking-widest uppercase shadow-xl shadow-himatik-gold/20 hover:-translate-y-1 transition-all active:scale-[0.98]"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    Admin Panel
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-16 mt-32">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-10">
                    {/* Logo & Description */}
                    <div className="flex flex-col items-center space-y-6">
                        <div className="w-16 h-16 p-2 rounded-2xl bg-white shadow-sm border border-slate-100">
                            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-sm font-black text-himatik-navy uppercase tracking-[0.3em]">Himatik PNUP</p>
                            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                                Platform informasi kompetisi mahasiswa Teknik Informatika & Komputer PNUP.
                            </p>
                        </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
                        {/* WhatsApp Button */}
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-3 bg-green-600 text-white px-6 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95 uppercase group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            <span className="hidden sm:inline">Hubungi via WhatsApp</span>
                            <span className="sm:hidden">WhatsApp</span>
                        </a>

                        {/* Email Button */}
                        <a
                            href={`mailto:${settings.admin_email || 'himatik@pnup.ac.id'}`}
                            className="flex-1 flex items-center justify-center gap-3 bg-himatik-navy text-white px-6 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-himatik-gold hover:text-himatik-navy transition-all shadow-lg shadow-himatik-navy/20 active:scale-95 uppercase group"
                        >
                            <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span className="hidden sm:inline">Hubungi via Email</span>
                            <span className="sm:hidden">Email</span>
                        </a>
                    </div>

                    {/* Divider & Copyright */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="h-px w-16 bg-slate-100"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                            © 2026 Lomba-In by HIMATIK
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default MainLayout
