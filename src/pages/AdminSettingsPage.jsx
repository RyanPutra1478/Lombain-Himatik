import React, { useState, useEffect } from 'react'
import { User, Lock, Mail, Moon, Globe, Shield, Save, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import useAuthStore from '../store/useAuthStore'
import useSettingsStore from '../store/useSettingsStore'
import { useToast } from '../hooks/useToast'

const AdminSettingsPage = () => {
    const { user } = useAuthStore()
    const { settings, fetchSettings, updateSetting, loading } = useSettingsStore()
    const toast = useToast()
    const [activeTab, setActiveTab] = useState('profile')
    const [whatsappNumber, setWhatsappNumber] = useState('')
    const [adminEmail, setAdminEmail] = useState('')

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    useEffect(() => {
        if (settings.admin_whatsapp) setWhatsappNumber(settings.admin_whatsapp)
        if (settings.admin_email) setAdminEmail(settings.admin_email)
    }, [settings])

    const handleSaveSettings = async () => {
        const results = await Promise.all([
            updateSetting('admin_whatsapp', whatsappNumber),
            updateSetting('admin_email', adminEmail)
        ])

        if (results.every(r => r.success)) {
            toast.success('Pengaturan berhasil disimpan!')
        } else {
            toast.error('Gagal menyimpan pengaturan. Coba lagi.')
        }
    }

    const tabs = [
        { id: 'profile', label: 'Profil Admin', icon: User },
        { id: 'security', label: 'Keamanan', icon: Shield },
        { id: 'system', label: 'Sistem', icon: Globe },
    ]

    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-himatik-navy tracking-tight">Pengaturan Dashboard</h1>
                <p className="text-slate-400 font-medium text-sm">Kelola profil Anda dan konfigurasi aplikasi LOMBA-IN.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Tabs Sidebar */}
                <div className="lg:w-64 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.id
                                ? 'bg-himatik-gold text-himatik-navy shadow-lg shadow-himatik-gold/20'
                                : 'text-slate-400 hover:bg-white hover:text-himatik-navy border border-transparent hover:border-slate-100'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-3xl bg-himatik-navy/5 flex items-center justify-center text-himatik-navy text-3xl font-black border-2 border-dashed border-himatik-navy/20 uppercase">
                                        {user?.email?.charAt(0)}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-himatik-navy">{user?.email?.split('@')[0]}</h3>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{user?.role || 'ADMIN'}</p>
                                        <button className="text-xs font-black text-himatik-gold hover:underline uppercase tracking-tighter">Ubah Foto Profil</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username / Nama</label>
                                        <input type="text" defaultValue={user?.email?.split('@')[0]} className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-himatik-navy outline-none font-bold text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Terdaftar</label>
                                        <input type="email" defaultValue={user?.email} disabled className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-transparent outline-none font-bold text-sm opacity-60 cursor-not-allowed" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password Saat Ini</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-himatik-navy outline-none font-bold text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password Baru</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-himatik-navy outline-none font-bold text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Konfirmasi Password Baru</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-himatik-navy outline-none font-bold text-sm" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'system' && (
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black text-himatik-navy">Maintenance Mode</h4>
                                            <p className="text-xs text-slate-400 font-medium">Nonaktifkan akses publik sementara untuk pemeliharaan sistem.</p>
                                        </div>
                                        <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        {/* WhatsApp Number Input */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Phone className="w-3 h-3" />
                                                Nomor WhatsApp Admin
                                            </label>
                                            <input
                                                type="text"
                                                value={whatsappNumber}
                                                onChange={(e) => setWhatsappNumber(e.target.value)}
                                                placeholder="628123456789"
                                                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-himatik-navy outline-none font-bold text-sm"
                                            />
                                            <p className="text-[10px] text-slate-400 font-medium">Format: 628xxxxxxxxxx (tanpa +, spasi, atau tanda hubung)</p>
                                        </div>

                                        {/* Email Input */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Mail className="w-3 h-3" />
                                                Email Admin
                                            </label>
                                            <input
                                                type="email"
                                                value={adminEmail}
                                                onChange={(e) => setAdminEmail(e.target.value)}
                                                placeholder="himatik@pnup.ac.id"
                                                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-himatik-navy outline-none font-bold text-sm"
                                            />
                                            <p className="text-[10px] text-slate-400 font-medium">Email untuk kontak dan bantuan lomba</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-slate-50 flex justify-end">
                            <button
                                onClick={handleSaveSettings}
                                disabled={loading}
                                className="flex items-center gap-2 bg-himatik-navy text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-himatik-gold hover:text-himatik-navy transition-all shadow-xl shadow-himatik-navy/10 active:scale-[0.98] uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5" /> {loading ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default AdminSettingsPage
