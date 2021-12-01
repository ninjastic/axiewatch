import { atom, atomFamily } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export interface TeamState {
  id: string;
  name: string;
  scholarsMap: string[];
}

export const teamsMapAtom = atom<string[]>({
  key: 'teamsMapAtom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const teamStateAtomFamily = atomFamily<TeamState, string>({
  key: 'teamStateAtomFamily',
  default: {
    id: '',
    name: '',
    scholarsMap: [],
  },
  effects_UNSTABLE: [persistAtom],
});

export const selectedTeamAtom = atom<string>({
  key: 'selectedTeam',
  default: '',
});
