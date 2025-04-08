import { useCallReadContract } from '@/hooks/useCallReadContract';
import { useReadContract } from 'wagmi';

interface DrawInfo {
  drawId: bigint;
  participantsCount: bigint;
  isCompleted: boolean;
  currentPrize: bigint;
}

export const useCurrentDrawInfo = () => {
  const result = useCallReadContract({
    functionName: 'getCurrentDrawInfo',
  });

  // Manually type cast the response since we can't use generics
  const typedData = result.data as unknown as [string, number, boolean, number] | undefined;

  return {
    ...result,
    data: typedData
      ? {
          drawId: typedData[0],
          participantsCount: typedData[1],
          isCompleted: typedData[2],
          currentPrize: typedData[3],
        }
      : undefined,
  };
};
