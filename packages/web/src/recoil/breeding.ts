import { atom } from 'recoil';

import { Axie } from './scholars';

export const isBreedingModeAtom = atom<boolean>({
  key: 'isBreedingModeAtom',
  default: false,
});

export const breedingStateAtom = atom<Axie[]>({
  key: 'breedingStateAtom',
  default: [],
});
