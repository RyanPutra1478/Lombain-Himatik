import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import useCompetitionStore from '../store/useCompetitionStore'
import { getCompetitionStatus } from '../utils/dateUtils'
import logo from '../assets/himatik.png'
import {
    LayoutDashboard,
    Trophy,
    LogOut,
    Menu,
    X,
    User,
    Settings,
    Bell,
    Tag
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isNotifOpen, setIsNotifOpen] = useState(false)
    const { user, logout } = useAuthStore()
    const { competitions, fetchCompetitions } = useCompetitionStore()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/admin/login')
    }

    useEffect(() => {
        if (competitions.length === 0) {
            fetchCompetitions()
        }
    }, [fetchCompetitions, competitions.length])

    // Generate Dynamic Notifications
    const notifications = competitions.reduce((acc, c) => {
        const status = getCompetitionStatus(c.deadline)

        // 1. Deadline nearing (within 3 days)
        if (status.code === 'CLOSING_SOON') {
            acc.push({
                id: `deadline-${c.id}`,
                title: 'Deadline Mendekat!',
                message: `${c.title} akan berakhir dalam ${status.label.split(' ')[1]} hari.`,
                type: 'warning'
            })
        }

        // 2. New competitions (added in the last 7 days)
        const createdDate = new Date(c.created_at)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        if (createdDate > sevenDaysAgo) {
            acc.push({
                id: `new-${c.id}`,
                title: 'Lomba Baru',
                message: `${c.title} telah berhasil ditambahkan ke daftar.`,
                type: 'info'
            })
        }

        return acc
    }, [])

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { id: 'competitions', icon: Trophy, label: 'Kelola Lomba', path: '/admin/competitions' },
        { id: 'categories', icon: Tag, label: 'Data Bidang', path: '/admin/types' },
        { id: 'settings', icon: Settings, label: 'Pengaturan', path: '/admin/settings' },
    ]

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="fixed inset-y-0 left-0 w-72 bg-himatik-navy text-white z-50 shadow-2xl flex flex-col"
                    >
                        <div className="p-8 flex items-center gap-4 border-b border-white/5">
                            <div className="w-10 h-10 bg-white rounded-xl p-1.5 shadow-lg">
                                <img src={logo} alt="Logo Himatik" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black tracking-widest uppercase text-himatik-gold">ADMIN</span>
                                <span className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase leading-none">LOMBA-IN</span>
                            </div>
                        </div>

                        <nav className="flex-1 p-6 space-y-2">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm group ${isActive
                                            ? 'bg-himatik-gold text-himatik-navy shadow-lg shadow-himatik-gold/20'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-himatik-navy' : 'text-white/40 group-hover:text-himatik-gold'}`} />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </nav>

                        <div className="p-6 border-t border-white/5">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-red-400 font-bold text-sm hover:bg-red-500/10 transition-all group"
                            >
                                <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                Keluar Sesi
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className={`relative p-2 rounded-xl transition-all ${isNotifOpen ? 'bg-himatik-gold text-himatik-navy' : 'text-slate-400 hover:text-himatik-navy hover:bg-slate-50'}`}
                            >
                                <Bell className="w-6 h-6" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-himatik-gold rounded-full border-2 border-white"></span>
                                )}
                            </button>

                            {/* Notif Dropdown */}
                            <AnimatePresence>
                                {isNotifOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-4 w-[calc(100vw-2rem)] max-w-sm md:w-80 bg-white rounded-2xl md:rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-50"
                                        >
                                            <div className="p-4 md:p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                                <h3 className="text-xs md:text-sm font-black text-himatik-navy">Notifikasi</h3>
                                                <span className="text-[9px] md:text-[10px] font-black bg-himatik-gold text-himatik-navy px-2 py-0.5 rounded-full uppercase">Baru</span>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notif) => (
                                                        <div key={notif.id} className="p-4 md:p-6 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                                            <div className="flex gap-3 md:gap-4">
                                                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.type === 'warning' ? 'bg-amber-400' : 'bg-himatik-navy'}`}></div>
                                                                <div className="space-y-1">
                                                                    <h4 className="text-[11px] md:text-xs font-black text-himatik-navy group-hover:text-himatik-gold transition-colors">{notif.title}</h4>
                                                                    <p className="text-[10px] md:text-[11px] text-slate-400 font-medium leading-relaxed">{notif.message}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-8 md:p-12 text-center space-y-3">
                                                        <div className="text-3xl md:text-4xl">📭</div>
                                                        <p className="text-[9px] md:text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                                                            Belum ada notifikasi baru untuk saat ini.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                            <div className="flex flex-col text-right">
                                <span className="text-sm font-black text-himatik-navy">{user?.email?.split('@')[0]}</span>
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{user?.role || 'ADMIN'}</span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-himatik-navy/5 flex items-center justify-center text-himatik-navy text-lg font-black border border-himatik-navy/10 shadow-inner uppercase">
                                {user?.email?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-5 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default AdminLayout
