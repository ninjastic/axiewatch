import { atom } from 'recoil';

export interface Price {
  values: {
    axs: number;
    slp: number;
    eth: number;
  };
  locale: string;
  lastUpdate: number | null;
}

export const priceAtom = atom<Price>({
  key: 'pricesAtom',
  default: {
    values: {
      axs: 0,
      slp: 0,
      eth: 0,
    },
    locale: '',
    lastUpdate: null,
  },
});
