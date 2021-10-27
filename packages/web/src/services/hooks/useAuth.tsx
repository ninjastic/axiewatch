import { useRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';
import { UserCredentials } from '@supabase/supabase-js';
import { toast } from 'react-toastify';

import { supabase } from '../supabase';
import { authAtom, AuthAtom } from '../../recoil/auth';

export const useAuth = (): AuthAtom => {
  const [auth, setAuth] = useRecoilState(authAtom);

  const signUp = useCallback(
    async (payload: UserCredentials) => {
      setAuth(prev => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.signUp(payload);
      if (error) {
        toast(error.message, {
          type: 'error',
        });
      }
      setAuth(prev => ({ ...prev, isLoading: false }));
    },
    [setAuth]
  );

  const signIn = useCallback(
    async (payload: UserCredentials) => {
      setAuth(prev => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.signIn(payload);
      if (error) {
        toast(error.message, {
          type: 'error',
        });
      }
      setAuth(prev => ({ ...prev, isLoading: false }));
    },
    [setAuth]
  );

  const resetPassword = useCallback(
    async (email: string) => {
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
    },
    [setAuth]
  );

  const updatePasword = useCallback(
    async (accessToken: string, newPassword: string) => {
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
    },
    [setAuth]
  );

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
  }, [resetPassword, setAuth, signIn, signUp, updatePasword]);

  return auth;
};
