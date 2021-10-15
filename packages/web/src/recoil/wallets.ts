import { atom, atomFamily, DefaultValue, selector, selectorFamily } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { AES, enc } from 'crypto-js';

import { ScholarMap, scholarsMap } from './scholars';

const { persistAtom } = recoilPersist();

export interface Wallet {
  address?: string;
  walletKey?: string | null;
  encrypted?: string | null;
}

interface HasPassword {
  value: boolean;
  hash: string;
}

export const walletMapAtom = atom<string[]>({
  key: 'walletMapAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const walletAtom = atomFamily<Wallet, string>({
  key: 'walletAtom',
  default: {} as Wallet,
  effects_UNSTABLE: [persistAtom],
});

export const passwordAtom = atom({
  key: 'passwordAtom',
  default: '',
});

export const hasPasswordAtom = atom<HasPassword>({
  key: 'hasPasswordAtom',
  default: {
    value: false,
    hash: '',
  },
  effects_UNSTABLE: [persistAtom],
});

export const walletSelector = selectorFamily<Wallet, string>({
  key: 'walletSelector',
  get:
    address =>
    ({ get }) => {
      const wallet = get(walletAtom(address));
      const password = get(passwordAtom);

      if (!wallet.encrypted || !password) {
        return {} as Wallet;
      }

      let decrypted: Wallet;

      try {
        const raw = AES.decrypt(wallet.encrypted, password)?.toString(enc.Utf8);
        decrypted = raw && JSON.parse(raw);
      } catch (error: any) {
        return {} as Wallet;
      }

      return decrypted;
    },
  set:
    address =>
    ({ set, get }, newValue) => {
      const password = get(passwordAtom);
      const wallet = get(walletAtom(address));

      if (!password) {
        return {} as Wallet;
      }

      if (newValue instanceof DefaultValue) {
        return set(walletAtom(address), newValue);
      }

      if (!newValue.walletKey) {
        return set(walletAtom(address), old => ({
          ...old,
          encrypted: null,
        }));
      }

      const data = JSON.stringify({
        ...wallet,
        address,
        walletKey: newValue.walletKey || null,
      });

      const encrypted = AES.encrypt(data, password).toString();

      return set(walletAtom(address), {
        encrypted,
      });
    },
});

export const bulkUpdateWalletSelector = selector<any[]>({
  key: 'bulkUpdateWalletSelector',
  get: () => [],
  set: ({ get, set }, newValues) => {
    const scholars: ScholarMap[] = get(scholarsMap);

    if (newValues instanceof DefaultValue) {
      return;
    }

    newValues.forEach(value => {
      const found = scholars.find(scholar => scholar.address.toLowerCase() === value.address.toLowerCase());

      if (!found) {
        return null;
      }

      return set(walletSelector(found.address), {
        address: found.address,
        walletKey: value.privateKey,
      });
    });
  },
});

export const allWalletsSelector = selector<Wallet[]>({
  key: 'allWalletsSelector',
  get: ({ get }) => {
    const walletMap = get(walletMapAtom);

    const walletsState = walletMap.map(address => {
      const state = get(walletSelector(address));
      return state;
    });

    return walletsState;
  },
});

export const resetPasswordAndPrivateKeysSelector = selector<void>({
  key: 'resetPasswordAndPrivateKeys',
  get: () => undefined,
  set: ({ get, set }) => {
    const walletMap = get(walletMapAtom);

    walletMap.forEach(wallet => {
      set(walletAtom(wallet), {});
    });

    set(walletMapAtom, []);
    set(passwordAtom, '');
    return set(hasPasswordAtom, { value: false, hash: '' });
  },
});
