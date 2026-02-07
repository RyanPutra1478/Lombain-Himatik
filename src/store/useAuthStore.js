import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isInitializing: true, // Specifically for App startup
    loading: false,       // For button spinners (Login/Logout)

    // NEW v4.0 debug logger
    log: (msg) => console.log(`[AuthStore] ${msg}`),

    initAuth: () => {
        get().log('Initializing Auth Flow...')

        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                get().log('Session found on init')
                set({ user: session.user, isAuthenticated: true, isInitializing: false })
            } else {
                get().log('No session found on init')
                set({ user: null, isAuthenticated: false, isInitializing: false })
            }
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            get().log(`Auth state change: ${event}`)
            if (session) {
                set({ user: session.user, isAuthenticated: true, isInitializing: false })
            } else if (event === 'SIGNED_OUT') {
                set({ user: null, isAuthenticated: false, isInitializing: false })
            }
        })

        return () => subscription.unsubscribe()
    },

    login: async (email, password) => {
        set({ loading: true })
        get().log(`Attempting login for: ${email}`)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            get().log(`Login failed: ${error.message}`)
            set({ loading: false })
            return { success: false, error: error.message }
        }

        get().log('Login Successful - Setting immediate state')

        // Fix 5.0: Set state and return immediately. 
        // No artificial delays to prevent remounting issues during transition.
        set({ user: data.user, isAuthenticated: true, loading: false })

        return { success: true }
    },

    logout: async () => {
        get().log('Logging out...')
        set({ loading: true })
        await supabase.auth.signOut()
        set({ user: null, isAuthenticated: false, loading: false })
    }
}))

export default useAuthStore
