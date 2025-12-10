import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import type { User } from '@supabase/supabase-js';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // on auth change
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
        setLoading(false);
      if (!session) navigate('/login');
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};
