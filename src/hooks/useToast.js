import { create } from 'zustand'

const useToastStore = create((set) => ({
    toasts: [],

    addToast: (toast) => {
        const id = Date.now() + Math.random()
        const newToast = {
            id,
            type: toast.type || 'info', // success, error, warning, info
            message: toast.message,
            duration: toast.duration || 3000
        }

        set((state) => ({
            toasts: [...state.toasts, newToast]
        }))

        // Auto remove after duration
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter(t => t.id !== id)
            }))
        }, newToast.duration)

        return id
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter(t => t.id !== id)
        }))
    },

    clearAll: () => set({ toasts: [] })
}))

export const useToast = () => {
    const { addToast, removeToast } = useToastStore()

    return {
        success: (message, duration) => addToast({ type: 'success', message, duration }),
        error: (message, duration) => addToast({ type: 'error', message, duration }),
        warning: (message, duration) => addToast({ type: 'warning', message, duration }),
        info: (message, duration) => addToast({ type: 'info', message, duration }),
        remove: removeToast
    }
}

export default useToastStore
