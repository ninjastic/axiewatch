import { atom } from 'recoil';
import { UserCredentials, Session, User } from '@supabase/supabase-js';

export interface AuthAtom {
  signIn: (payload: UserCredentials) => Promise<void>;
  signUp: (payload: UserCredentials) => Promise<void>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<void>;
  updatePasword: (accessToken: string, newPassword: string) => Promise<void>;
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isUserLoading: boolean;
}

export const authAtom = atom<AuthAtom>({
  key: 'authAtom',
  default: {
    isLoading: false,
    isUserLoading: true,
  } as AuthAtom,
});
