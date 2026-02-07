import React from 'react'
import { motion } from 'framer-motion'

const LoadingSkeleton = ({ variant = 'card', count = 1 }) => {
    const renderSkeleton = () => {
        switch (variant) {
            case 'hero':
                return (
                    <div className="h-[500px] md:h-[600px] w-full rounded-[2.5rem] bg-slate-100 animate-pulse mt-6" />
                )

            case 'card':
                return (
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="aspect-[4/5] bg-slate-100 animate-pulse" />
                        <div className="p-6 space-y-4">
                            <div className="flex gap-2">
                                <div className="h-4 w-24 bg-slate-100 rounded-full animate-pulse" />
                                <div className="h-4 w-20 bg-slate-100 rounded-full animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-6 bg-slate-100 rounded animate-pulse" />
                                <div className="h-6 w-3/4 bg-slate-100 rounded animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-slate-100 rounded animate-pulse" />
                                <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                )

            case 'stats':
                return (
                    <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-xl md:rounded-2xl animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                                <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                )

            case 'list':
                return (
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse" />
                                <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                )

            default:
                return (
                    <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
                )
        }
    }

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    {renderSkeleton()}
                </motion.div>
            ))}
        </>
    )
}

export default LoadingSkeleton
