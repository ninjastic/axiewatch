import { atom } from 'recoil';

interface DrawerStateAtom {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isDrawer: boolean | undefined;
}

export const drawerStateAtom = atom({
  key: 'drawerStateAtom',
  default: {} as DrawerStateAtom,
});
