import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load session
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user || null;
      setUser(user);
      setLoading(false);
    });

    // Subscribe to changes
    supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user || null);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
