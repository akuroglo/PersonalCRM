import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSupabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const supabase = await getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          // Очищаем кеш контактов при изменении пользователя
          queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
        });

        setLoading(false);
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (err) {
      console.error('SignIn error:', err);
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      console.log('SignUp response:', { data, error });
      return { error };
    } catch (err) {
      console.error('SignUp error:', err);
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    // Очищаем кеш перед разлогинированием
    queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    const supabase = await getSupabase();
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
