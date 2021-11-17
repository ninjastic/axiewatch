import { ThemeTypings } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { atom, selector, atomFamily, selectorFamily, DefaultValue } from 'recoil';

export interface ModalState {
  id: string;
  title: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  size?: ThemeTypings['sizes'];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setExtra?: React.Dispatch<any>;
  extra?: any;
}

export const modalsMapAtom = atom({
  key: 'modalsMap',
  default: [] as string[],
});

export const modalAtom = atomFamily<ModalState, string>({
  key: 'modalAtom',
  default: {
    id: '',
    title: null,
    content: null,
    isOpen: false,
    onOpen: () => undefined,
    onClose: () => undefined,
  },
});

export const modalSelector = selectorFamily<ModalState, string>({
  key: 'modalSelector',
  get:
    id =>
    ({ get }) => {
      const modal = get(modalAtom(id));
      return modal;
    },
  set:
    id =>
    ({ get, set }, newValue) => {
      if (newValue instanceof DefaultValue) {
        set(modalAtom(id), newValue);
        return;
      }

      const modalAlreadyRegistered = !!get(modalsMapAtom).find(mapId => mapId === id);

      if (!modalAlreadyRegistered) {
        set(modalsMapAtom, oldMap => [...oldMap, id]);
      }

      set(modalAtom(id), newValue);
    },
});

export const openModalsSelector = selector({
  key: 'openModalsSelector',
  get: ({ get }) => {
    const modalsMap = get(modalsMapAtom);
    const modals = modalsMap.map(modalId => get(modalAtom(modalId))).filter(modal => modal.isOpen);

    return modals;
  },
});
