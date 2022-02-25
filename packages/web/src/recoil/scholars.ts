import { atom, atomFamily, selector, selectorFamily } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import dayjs from '../services/dayjs';
import { AxieClass, ScholarHistoricalSlpData } from 'src/types/api';
import { getTraits } from '../services/utils/axieUtils';
import { preferencesAtom } from './preferences';

const { persistAtom } = recoilPersist();

export interface ScholarMap {
  name: string;
  address: string;
  paymentAddress: string;
  shares: {
    manager: number;
    scholar: number;
    investor: number;
  };
  discordId?: string;
  inactive: boolean;
}

export interface ScholarState {
  address: string;
  slp: number;
  roninSlp: number;
  totalSlp: number;
  claimableSlp: number;
  yesterdaySlp: number | null;
  todaySlp: number | null;
  lastClaim: number;
  nextClaim: number;
  slpDay: number;
  pvpElo: number;
  pvpRank: number;
  pvpErrored: boolean;
  pveSlp: number;
  loaded: boolean;
  errored: boolean;
  historical: ScholarHistoricalSlpData;
}

export interface ScholarSelector extends ScholarMap, ScholarState {}

export interface AxiePart {
  class: string;
  id: string;
  name: string;
  specialGenes: null | string;
  type: string;
}

export type { AxieClass };

export interface Axie {
  name: string;
  id: string;
  image: string;
  class: AxieClass;
  parts: AxiePart[];
  breedCount: number;
  genes: string;
  owner: string;
  battleInfo: {
    banned: false;
  };
  traits: ReturnType<typeof getTraits>;
  quality: number;
  stats: {
    hp: number;
    morale: number;
    skill: number;
    speed: number;
  };
  birthDate: number;
}

export interface ScholarAxies {
  name: string;
  address: string;
  axies: Axie[];
  loaded: boolean;
  errored: boolean;
}

export interface ScholarFilter {
  search: string;
  SLP: {
    above: null | number;
    under: null | number;
  };
  onlyClaimable: boolean;
}

export interface ScholarAxiesFilter {
  breed: {
    above: null | number;
    under: null | number;
  };
  quality: {
    above: null | number;
    under: null | number;
  };
  owner: string;
  class: null | '' | AxieClass;
  parts: string[];
}

export type ScholarFields =
  | 'name'
  | 'slp'
  | 'roninSlp'
  | 'scholarShare'
  | 'managerShare'
  | 'investorShare'
  | 'arenaElo'
  | 'yesterdaySlp'
  | 'todaySlp'
  | 'slpDay'
  | 'adventureSlp'
  | 'lastClaim'
  | 'nextClaim';

export interface ScholarParseOptions {
  includeTodayOnAverageSlp: boolean;
}

export const scholarsMap = atom<ScholarMap[]>({
  key: 'scholarsMap',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const scholarState = atomFamily({
  key: 'scholarState',
  default: {
    slp: 0,
    roninSlp: 0,
    totalSlp: 0,
    claimableSlp: 0,
    yesterdaySlp: null,
    todaySlp: null,
    lastClaim: 0,
    nextClaim: 0,
    slpDay: 0,
    pvpElo: 0,
    pvpRank: 0,
    pvpErrored: false,
    loaded: false,
    errored: false,
  } as ScholarState,
});

export const scholarSort = atom<string>({
  key: 'scholarSort',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

export const scholarsPerPageAtom = atom<number>({
  key: 'scholarsPerPageAtom',
  default: 20,
  effects_UNSTABLE: [persistAtom],
});

export const scholarFilter = atom<ScholarFilter>({
  key: 'scholarFilter',
  default: {
    search: '',
    SLP: {
      above: null,
      under: null,
    },
    onlyClaimable: false,
  },
});

export const scholarAxies = atomFamily<ScholarAxies, string>({
  key: 'scholarAxies',
  default: {
    name: '',
    address: '',
    axies: [],
    loaded: false,
    errored: false,
  } as ScholarAxies,
});

export const scholarAxiesFilter = atom<ScholarAxiesFilter>({
  key: 'scholarAxiesFilter',
  default: {
    breed: {
      above: null,
      under: null,
    },
    quality: {
      above: null,
      under: null,
    },
    owner: '',
    class: null,
    parts: [],
  },
});

export const scholarFieldsAtom = atom<ScholarFields[]>({
  key: 'scholarFieldsAtom',
  default: ['name', 'slp', 'scholarShare', 'managerShare', 'arenaElo', 'todaySlp', 'slpDay', 'lastClaim', 'nextClaim'],
  effects_UNSTABLE: [persistAtom],
});

export const scholarParseOptionsAtom = atom<ScholarParseOptions>({
  key: 'scholarParseOptionsAtom',
  default: {
    includeTodayOnAverageSlp: false,
  },
  effects_UNSTABLE: [persistAtom],
});

export const axiePartsAtom = atom<string[]>({
  key: 'axieParts',
  default: [],
});

export const scholarSelector = selectorFamily<ScholarSelector, string>({
  key: 'scholarSelector',
  get:
    address =>
    ({ get }) => {
      const map = get(scholarsMap);
      const scholar = get(scholarState(address));

      const mapped = map.find(s => s.address === address);

      return {
        ...mapped,
        ...scholar,
      } as ScholarSelector;
    },
  set:
    address =>
    ({ set, get }, newValue) => {
      const map = get(scholarsMap);
      const index = map.findIndex(s => s.address === address);

      set(scholarState(address), {
        ...(newValue as ScholarSelector),
      });

      set(scholarsMap, prevState => {
        const newState = [...prevState];
        const updated = newValue as ScholarSelector;
        newState[index] = {
          name: updated.name,
          address: updated.address,
          paymentAddress: updated.paymentAddress,
          shares: { ...updated.shares },
          inactive: updated.inactive,
          discordId: updated.discordId,
        };

        return newState;
      });
    },
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});

export const allScholarsSelector = selector({
  key: 'allScholarsSelector',
  get: ({ get }) => {
    const scholars = get(scholarsMap);
    const allScholars = scholars.map(scholar => {
      const state = get(scholarSelector(scholar.address));
      return state;
    });

    return allScholars;
  },
});

export const totalSlpSelector = selector({
  key: 'totalSlpSelector',
  get: ({ get }) => {
    const scholars = get(scholarsMap);
    const preferences = get(preferencesAtom);

    return scholars.reduce(
      (prev, scholar) => {
        const s = get(scholarSelector(scholar.address));
        const newValues = { ...prev };

        const value = preferences.includeRoninBalance ? s.slp + s.roninSlp : s.slp;

        newValues.total += value;
        newValues.manager += (value * s.shares.manager) / 100;
        newValues.scholars += (value * s.shares.scholar) / 100;
        newValues.investor += (value * (s.shares.investor ?? 0)) / 100;

        return newValues;
      },
      { total: 0, manager: 0, scholars: 0, investor: 0 }
    );
  },
});

export const totalSlpDaySelector = selector({
  key: 'totalSlpDaySelector',
  get: ({ get }) => {
    const scholars = get(scholarsMap);

    const values = scholars.reduce(
      (prev, scholar) => {
        const s = get(scholarSelector(scholar.address));
        const newValues = { ...prev };

        if (!s.slpDay) return newValues;

        newValues.total += s.slpDay;
        newValues.manager += (s.slpDay * s.shares.manager) / 100;
        newValues.scholars += (s.slpDay * s.shares.scholar) / 100;
        newValues.investor += (s.slpDay * (s.shares.investor ?? 0)) / 100;

        return newValues;
      },
      { total: 0, manager: 0, scholars: 0, investor: 0 }
    );

    const roundedValues = {
      total: Math.round(values.total),
      manager: Math.round(values.manager),
      scholars: Math.round(values.scholars),
      investor: Math.round(values.investor),
    };

    return roundedValues;
  },
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});

export const scholarsSortSelector = selector({
  key: 'scholarsSortSelector',
  get: ({ get }) => {
    const sort = get(scholarSort);
    const filters = get(scholarFilter);
    const preferences = get(preferencesAtom);

    const scholars = get(scholarsMap);
    const scholarsData = scholars.map(scholar => get<ScholarSelector>(scholarSelector(scholar.address)));

    function getSorted(dataToSort: ScholarSelector[]) {
      switch (sort) {
        case 'Total SLP':
          return dataToSort.sort((a, b) => {
            const values = {
              a: preferences.includeRoninBalance ? a.slp + a.roninSlp : a.slp,
              b: preferences.includeRoninBalance ? b.slp + b.roninSlp : b.slp,
            };
            if (values.a > values.b) return -1;
            if (values.a < values.b) return 1;
            return 1;
          });
        case 'Arena Elo':
          return dataToSort.sort((a, b) => {
            if (a.pvpElo > b.pvpElo) return -1;
            if (a.pvpElo < b.pvpElo) return 1;
            return 0;
          });
        case 'SLP per Day':
          return dataToSort.sort((a, b) => {
            if (a.slpDay > b.slpDay) return -1;
            if (a.slpDay < b.slpDay) return 1;
            return 0;
          });
        case 'SLP Today':
          return dataToSort.sort((a, b) => {
            if (a.todaySlp !== null && b.todaySlp !== null) {
              if (a.todaySlp > b.todaySlp) return -1;
              return 1;
            }
            if (a.todaySlp && !b.todaySlp) return -1;
            if (!a.todaySlp && b.todaySlp) return 1;
            return 0;
          });
        case 'SLP Yesterday':
          return dataToSort.sort((a, b) => {
            if (a.yesterdaySlp !== null && b.yesterdaySlp !== null) {
              if (a.yesterdaySlp > b.yesterdaySlp) return -1;
              return 1;
            }
            if (a.yesterdaySlp && !b.yesterdaySlp) return -1;
            if (!a.yesterdaySlp && b.yesterdaySlp) return 1;
            return 0;
          });
        case 'Next Claim':
          return dataToSort.sort((a, b) => {
            if (a.nextClaim === 0) return 1;
            if (b.nextClaim === 0) return -1;
            if (dayjs.unix(a.nextClaim).isBefore(dayjs.unix(b.nextClaim))) return -1;
            return 1;
          });
        case 'Name':
          return dataToSort.sort((a, b) => {
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            return 0;
          });
        default:
          return dataToSort;
      }
    }

    function getSortedByActive(dataToSort: ScholarSelector[]) {
      return dataToSort.sort((a, b) => {
        if (a.inactive && !b.inactive) return 1;
        if (b.inactive && !a.inactive) return -1;
        return 0;
      });
    }

    return getSortedByActive(getSorted(scholarsData)).filter(scholar => {
      if (filters.SLP.above && scholar.slp < filters.SLP.above) return false;
      if (filters.SLP.under && scholar.slp > filters.SLP.under) return false;

      if (filters.onlyClaimable && (scholar.nextClaim === 0 || dayjs.unix(scholar.nextClaim).isAfter(dayjs())))
        return false;

      return true;
    });
  },
});
