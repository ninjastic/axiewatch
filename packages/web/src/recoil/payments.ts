import { atom, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();
interface Transaction {
  amount: number;
  hash: string;
  created_at: number;
}

interface PaymentHistory {
  address: string;
  name: string;
  claim: Transaction | null;
  managerTransfer: Transaction | null;
  scholarTransfer: Transaction | null;
  created_at: number;
}

export const selectedPaymentsAtom = atom<string[]>({
  key: 'selectedPaymentsAtom',
  default: [],
});

export const paymentsHistoryAtom = atom<PaymentHistory[]>({
  key: 'paymentsHistoryArom',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const paymentsHistorySortSelector = selector({
  key: 'paymentsHistorySortSelector',
  get: ({ get }) => {
    const payments = get(paymentsHistoryAtom);

    return payments.slice().sort((a, b) => {
      if (a.created_at > b.created_at) {
        return -1;
      }

      return 1;
    });
  },
});
