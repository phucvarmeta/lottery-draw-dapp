import { useCallWriteContract } from '@/hooks/useCallWriteContract';
import { handleSmcError } from '@/lib/common';
import { useCommonStore } from '@/stores/commonStore';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';

export const usePerformDraw = () => {
  const queryClient = useQueryClient();
  const setTxHash = useCommonStore.use.setTx();

  const {
    data,
    writeContract,
    isPending,
    failureReason: performDrawError,
    reset: resetPerformDraw,
  } = useCallWriteContract();

  const { isSuccess: txSuccess, isFetching: txFetching } = useWaitForTransactionReceipt({
    hash: data,
    confirmations: 2,
  });

  useEffect(() => {
    if (!performDrawError) return;
    handleSmcError(performDrawError);
  }, [performDrawError]);

  useEffect(() => {
    if (!txSuccess || !data) return;

    setTxHash(data);
    queryClient.invalidateQueries({ queryKey: ['current-draw'] });
    resetPerformDraw();
  }, [data, txSuccess, queryClient, resetPerformDraw, setTxHash]);

  return {
    performDraw: () => writeContract('performDraw', []),
    isPerformingDraw: isPending || txFetching,
  };
};
