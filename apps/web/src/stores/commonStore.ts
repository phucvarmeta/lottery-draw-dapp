import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { Address } from 'viem';
import { create } from 'zustand';

export type IModalStore = {
  navTarget: boolean;
  setNavTarget: () => void;
  mintTxHash: string;
  setTx: (tx: Address) => void;
  activeCollectionId: number;
};

const useBaseCommonStore = create<IModalStore>((set) => ({
  navTarget: false,
  setNavTarget: () =>
    set((state) => ({
      ...state,
      navTarget: !state.navTarget,
    })),
  mintTxHash: '',
  setTx(tx) {
    set((state) => ({
      ...state,
      mintTxHash: tx,
    }));
  },
  activeCollectionId: 0,
}));

export const useCommonStore = createSelectorFunctions(useBaseCommonStore);
