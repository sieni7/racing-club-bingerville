import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);
    const signIn = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error)
            throw error;
    };
    const signUp = async (email, password, metadata) => {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
        if (error)
            throw error;
    };
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error)
            throw error;
    };
    return (_jsx(AuthContext.Provider, { value: { session, user, isLoading, signIn, signUp, signOut }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
