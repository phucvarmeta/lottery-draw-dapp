import { useCallWriteContract } from '@/hooks/useCallWriteContract';
import { handleSmcError } from '@/lib/common';
import { useCommonStore } from '@/stores/commonStore';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';

export const usePerformDraw = (value?: bigint) => {
  const queryClient = useQueryClient();

  // const setTargetInView = useIntersectionStore.use.setTargetInView();
  const setTxHash = useCommonStore.use.setTx();

  const {
    data,
    writeContract,
    isPending,
    failureReason: startNewDrawReason,
    reset: resetMint,
  } = useCallWriteContract(value);

  const { isSuccess: mintSuccess, isFetching } = useWaitForTransactionReceipt({
    hash: data,
    confirmations: 2,
  });

  useEffect(() => {
    if (!startNewDrawReason) return;

    handleSmcError(startNewDrawReason);
  }, [startNewDrawReason]);

  useEffect(() => {
    if (!mintSuccess || !data) return;

    queryClient.refetchQueries({ queryKey: 'current-draw' });
    setTxHash(data);
    resetMint();
  }, [data, mintSuccess, queryClient, resetMint, setTxHash]);

  return {
    performDraw: () => writeContract('performDraw', []),
    isPendingPerformDraw: isPending || isFetching,
  };
};
