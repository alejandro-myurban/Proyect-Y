import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, AuthResponse, AuthTokenResponsePassword } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUp: (data: any) => Promise<AuthResponse>;
    signIn: (data: any) => Promise<AuthTokenResponsePassword>;
    signInWithGoogle: () => Promise<any>;
    signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = (data: any) => supabase.auth.signUp(data);
    const signIn = (data: any) => supabase.auth.signInWithPassword(data);
    const signInWithGoogle = () => supabase.auth.signInWithOAuth({ provider: 'google' });
    const signOut = () => supabase.auth.signOut();

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
