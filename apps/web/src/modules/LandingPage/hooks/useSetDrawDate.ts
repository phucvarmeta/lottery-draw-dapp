import { useCallWriteContract } from '@/hooks/useCallWriteContract';
import { handleSmcError } from '@/lib/common';
import { useCommonStore } from '@/stores/commonStore';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';

export const useSetDrawTime = () => {
  const queryClient = useQueryClient();

  // const setTargetInView = useIntersectionStore.use.setTargetInView();
  const setTxHash = useCommonStore.use.setTx();

  const { data, writeContract, isPending, failureReason, reset: resetMint } = useCallWriteContract();

  const { isSuccess: mintSuccess, isFetching: mintReceiptFetching } = useWaitForTransactionReceipt({
    hash: data,
    confirmations: 2,
  });

  useEffect(() => {
    if (!failureReason) return;

    handleSmcError(failureReason);
  }, [failureReason]);

  useEffect(() => {
    if (!mintSuccess || !data) return;

    queryClient.refetchQueries({ queryKey: 'current-draw' });
    setTxHash(data);
    resetMint();
  }, [data, mintSuccess, queryClient, resetMint, setTxHash]);

  return {
    setDrawTime: (date: Date) => {
      const dateInSecond = Math.floor(date.getTime() / 1000);
      writeContract('setDrawTime', [dateInSecond]);
    },
    isPendingSetDrawTime: isPending || mintReceiptFetching,
  };
};
