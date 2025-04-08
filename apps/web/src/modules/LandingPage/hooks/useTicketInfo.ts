import { useCallReadContract } from '@/hooks/useCallReadContract';

interface TicketInfo {
  isAssigned: boolean;
  participant: string;
}

export const useTicketInfo = (ticketNumber: number) => {
  const result = useCallReadContract({
    functionName: 'getTicketInfo',
    args: [ticketNumber],
  });

  // Manually type cast the response
  const typedData = result.data as unknown as [boolean, string] | undefined;

  return {
    ...result,
    data: typedData
      ? {
          isAssigned: typedData[0],
          participant: typedData[1],
        }
      : undefined,
  };
};
