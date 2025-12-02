import { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import { supabase } from "@/lib/supabaseClient";

export function useAuth() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [profile, setProfile] = useState<{ role?: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      // User logged out - reset in callback
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    // Fetch profile - all state updates happen in callbacks
    let cancelled = false;
    
    // Start loading in next tick to avoid synchronous setState
    const loadingTimeout = setTimeout(() => {
      if (!cancelled) {
        setProfileLoading(true);
      }
    }, 0);

    const fetchProfile = async () => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        if (!cancelled) {
          setProfile(data);
        }
      } catch {
        // Handle error silently
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
      clearTimeout(loadingTimeout);
    };
  }, [user, authLoading]);

  const loading = useMemo(() => authLoading || profileLoading, [authLoading, profileLoading]);

  return {
    user,
    role: profile?.role,
    loading,
  };
}
