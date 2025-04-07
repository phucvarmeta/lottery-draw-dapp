import { createSelectorFunctions } from 'auto-zustand-selectors-hook';
import { create } from 'zustand';

type TTargetInView = 'connectWallet' | 'loginConnect' | 'thanksWhitelist' | 'mintSuccess' | '';

export type IModalStore = {
  targetInView: TTargetInView;
  // eslint-disable-next-line no-unused-vars
  setTargetInView: (target: TTargetInView) => void;
};

const useBaseIntersectionStore = create<IModalStore>((set) => ({
  targetInView: '',
  setTargetInView: (target) =>
    set(() => ({
      targetInView: target,
    })),
}));

export const useIntersectionStore = createSelectorFunctions(useBaseIntersectionStore);
