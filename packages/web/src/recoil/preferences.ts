import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export interface Preferences {
  shares: {
    scholar: number;
    manager: number;
    investor: number;
  };
  managerAddress: string;
  currency:
    | 'usd'
    | 'php'
    | 'brl'
    | 'eur'
    | 'eth'
    | 'thb'
    | 'sgd'
    | 'aud'
    | 'cad'
    | 'idr'
    | 'chf'
    | 'gbp'
    | 'mxn'
    | 'inr'
    | 'ars'
    | 'aed'
    | 'vnd'
    | 'uah'
    | 'rub'
    | 'myr'
    | 'jpy'
    | 'ils';
  theme: string;
  includeRoninBalance: boolean;
  doNotShowInitialWarning: boolean;
  doNotShowPaymentsRiskWarning: boolean;
  hasExperimentalFeatures: boolean;
  hideAxieTraits: boolean;
}

export const preferencesAtom = atom<Preferences>({
  key: 'preferences',
  default: {
    shares: {
      scholar: 50,
      manager: 50,
      investor: 0,
    },
    managerAddress: '',
    currency: 'usd',
    theme: 'dark',
    includeRoninBalance: false,
    doNotShowInitialWarning: false,
    doNotShowPaymentsRiskWarning: false,
    hasExperimentalFeatures: false,
    hideAxieTraits: false,
  },
  effects_UNSTABLE: [persistAtom],
});

interface AverageRange {
  top: number;
  bottom: number;
}

export const averageRangeAtom = atom<AverageRange>({
  key: 'averageRangeAtom',
  default: {
    top: 120,
    bottom: 90,
  },
  effects_UNSTABLE: [persistAtom],
});
