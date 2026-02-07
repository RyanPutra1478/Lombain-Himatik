import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import logo from '../assets/himatik.png'
import { User, Lock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const AdminLoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { login, loading } = useAuthStore()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const result = await login(email, password)
        if (result.success) {
            // Fix 5.0: Instant navigation to prevent stale state issues
            navigate('/admin/dashboard')
        } else {
            setError(result.error || 'Email atau password salah!')
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-himatik-gold/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-himatik-blue/5 rounded-full -ml-16 -mb-16 blur-3xl"></div>

                <div className="text-center space-y-6 relative">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-himatik-navy transition-colors text-xs font-black uppercase tracking-widest group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Beranda
                    </Link>

                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-white shadow-xl rounded-2xl p-3 border border-slate-50">
                            <img src={logo} alt="Logo Himatik" className="w-full h-full object-contain" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-himatik-navy tracking-tight">Login Portal</h2>
                        <p className="text-slate-400 font-medium">Khusus Pengurus & Admin Himatik</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-10 space-y-6 relative">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100"
                        >
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-himatik-navy transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Admin"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-himatik-navy rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-himatik-navy transition-colors" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-himatik-navy rounded-2xl outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full font-black uppercase tracking-widest text-sm py-5 rounded-2xl transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 bg-himatik-navy text-white shadow-himatik-navy/20 hover:bg-himatik-gold hover:text-himatik-navy`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    MEMVERIFIKASI...
                                </>
                            ) : (
                                'MASUK KE DASHBOARD'
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center pt-4">
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                        &copy; 2026 Himatik PNUP - Research & Development
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default AdminLoginPage
