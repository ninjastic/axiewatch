import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { UserCredentials } from '@supabase/supabase-js';
import { toast } from 'react-toastify';

import { supabase } from '../supabase';
import { authAtom } from '../../recoil/auth';

export function useAuth() {
  const [auth, setAuth] = useRecoilState(authAtom);

  async function signUp(payload: UserCredentials) {
    setAuth(prev => ({ ...prev, isLoading: true }));
    const { error } = await supabase.auth.signUp(payload);
    if (error) {
      toast(error.message, {
        type: 'error',
      });
    }
    setAuth(prev => ({ ...prev, isLoading: false }));
  }

  async function signIn(payload: UserCredentials) {
    setAuth(prev => ({ ...prev, isLoading: true }));
    const { error } = await supabase.auth.signIn(payload);
    if (error) {
      toast(error.message, {
        type: 'error',
      });
    }
    setAuth(prev => ({ ...prev, isLoading: false }));
  }

  async function resetPassword(email: string) {
    setAuth(prev => ({ ...prev, isLoading: true }));
    const { error } = await supabase.auth.api.resetPasswordForEmail(email);
    if (error) {
      toast(error.message, {
        type: 'error',
      });
    } else {
      toast('Please check your inbox for a reset password email.', {
        type: 'success',
      });
    }
    setAuth(prev => ({ ...prev, isLoading: false }));
  }

  async function updatePasword(accessToken: string, newPassword: string) {
    setAuth(prev => ({ ...prev, isLoading: true }));
    const { error } = await supabase.auth.api.updateUser(accessToken, {
      password: newPassword,
    });
    if (error) {
      toast(error.message, {
        type: 'error',
      });
    } else {
      toast('Password was updated.', {
        type: 'success',
      });
    }
    setAuth(prev => ({ ...prev, isLoading: false }));
  }

  useEffect(() => {
    const session = supabase.auth.session();

    setAuth(prev => ({
      ...prev,
      user: session?.user ?? null,
      session,
      signIn,
      signUp,
      signOut: () => supabase.auth.signOut(),
      resetPassword,
      updatePasword,
      isUserLoading: false,
    }));

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_, sessionChange) => {
      setAuth(prev => ({
        ...prev,
        user: sessionChange?.user ?? null,
        isUserLoading: false,
        session: sessionChange,
      }));
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return auth;
}
