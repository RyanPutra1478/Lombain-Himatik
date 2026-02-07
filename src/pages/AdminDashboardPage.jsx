import React from 'react'
import useCompetitionStore from '../store/useCompetitionStore'
import { Trophy, Star, Clock, Plus, ArrowUpRight, List } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getCompetitionStatus } from '../utils/dateUtils'

const AdminDashboardPage = () => {
    const { competitions } = useCompetitionStore()

    const stats = [
        { label: 'Total Kompetisi', value: competitions.length, icon: List, color: 'bg-blue-50 text-blue-600', trend: '+12% bln ini' },
        { label: 'Lomba Unggulan', value: competitions.filter(c => c.is_priority).length, icon: Star, color: 'bg-himatik-gold/10 text-himatik-gold', trend: '+2 baru' },
        {
            label: 'Segera Berakhir', value: competitions.filter(c => {
                const status = getCompetitionStatus(c.deadline);
                return status.code === 'CLOSING_SOON' || status.code === 'GRACE_PERIOD';
            }).length, icon: Clock, color: 'bg-orange-50 text-orange-600', trend: 'Melihat deadline'
        },
    ]

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-himatik-navy tracking-tight">Overview Dashboard</h1>
                    <p className="text-slate-400 font-medium text-[11px] md:text-sm">Selamat datang kembali! Berikut ringkasan data kompetisi aktif.</p>
                </div>
                <Link
                    to="/admin/competitions"
                    className="inline-flex items-center justify-center gap-2 bg-himatik-navy text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs tracking-widest hover:bg-himatik-gold hover:text-himatik-navy transition-all shadow-xl shadow-himatik-navy/10 active:scale-[0.98] uppercase"
                >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" /> TAMBAH LOMBA BARU
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow cursor-default group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 md:p-3 rounded-xl ${stat.color}`}>
                                <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className="space-y-0">
                                <h3 className="text-xl md:text-2xl font-black text-himatik-navy leading-none">{stat.value}</h3>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-300 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Competitions */}
                <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-100 p-6 md:p-8 space-y-6 md:space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4 md:pb-6">
                        <h2 className="text-lg md:text-xl font-black text-himatik-navy tracking-tight">Kompetisi Terbaru</h2>
                        <Link to="/admin/competitions" className="text-[10px] md:text-xs font-black text-himatik-navy hover:text-himatik-gold transition-colors tracking-widest uppercase">Lihat Semua</Link>
                    </div>
                    <div className="space-y-6">
                        {competitions.slice(0, 3).map((lomba, idx) => (
                            <div key={lomba.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 aspect-[4/5] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                                        <img src={lomba.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-himatik-gold tracking-widest uppercase">{lomba.category}</span>
                                        <span className="text-sm font-black text-himatik-navy leading-normal line-clamp-1">{lomba.title}</span>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-himatik-navy transition-colors translate-x-0 group-hover:-translate-y-1 group-hover:translate-x-1" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-himatik-navy rounded-3xl md:rounded-[2.5rem] shadow-xl p-6 md:p-8 text-white flex flex-col justify-between relative overflow-hidden min-h-[300px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-himatik-gold/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="space-y-3 md:space-y-4 relative">
                        <Trophy className="w-10 h-10 md:w-12 md:h-12 text-himatik-gold" />
                        <h2 className="text-xl md:text-2xl font-black leading-tight">Kelola kompetisi Anda dengan satu klik.</h2>
                        <p className="text-white/50 font-medium text-xs md:text-sm">Tambah, edit, atau hapus kompetisi untuk memberitahu mahasiswa Himatik tentang peluang terbaru.</p>
                    </div>
                    <div className="pt-8 md:pt-10 relative">
                        <Link to="/admin/competitions" className="inline-flex items-center justify-center gap-2 bg-himatik-gold text-himatik-navy px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs tracking-widest hover:bg-white hover:text-himatik-navy transition-all shadow-xl active:scale-95 uppercase w-full md:w-auto">
                            Mulai Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardPage
