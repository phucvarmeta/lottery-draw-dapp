import { useCallReadContract } from '@/hooks/useCallReadContract';

export const useGetPrizeAmount = () => {
  return useCallReadContract({
    functionName: 'prizeAmount',
  });
};
