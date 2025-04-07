/* eslint-disable no-unused-vars */
import type { ILoginByWalletResponse, ILoginByWalletUser } from '@/apis/auth';
import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface IDrawStore {
  uploadedPrize: boolean;
  prizeAmount: string;
  nextDrawDate: Date | null;
  setPrizeAmount: (amount: string) => void;
  setNextDrawDate: (date: Date | undefined) => void;
}

const useBaseDrawStore = create<IDrawStore>()(
  persist(
    (set) => ({
      uploadedPrize: false,
      prizeAmount: '0.01',
      nextDrawDate: null,
      setPrizeAmount: (amount) => set({ prizeAmount: amount }),
      setNextDrawDate: (date) => set({ nextDrawDate: date }),
    }),
    {
      name: 'draw-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useDrawStore = createSelectorFunctions(useBaseDrawStore);
