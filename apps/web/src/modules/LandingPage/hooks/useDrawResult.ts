import { useCallReadContract } from '@/hooks/useCallReadContract';
import { useReadContract } from 'wagmi';

interface DrawResult {
  isCompleted: boolean;
  winningTicket: number;
  winner: string;
  isPrizeClaimed: boolean;
}

export const useDrawResult = (drawId: number) => {
  const result = useCallReadContract({
    functionName: 'getDrawResult',
    args: [drawId],
  });

  // Manually type cast the response since we can't use generics
  const typedData = result.data as unknown as [boolean, number, string, boolean] | undefined;

  return {
    ...result,
    data: typedData
      ? {
          isCompleted: typedData[0],
          winningTicket: typedData[1],
          winner: typedData[2],
          isPrizeClaimed: typedData[3],
        }
      : undefined,
  };
};
