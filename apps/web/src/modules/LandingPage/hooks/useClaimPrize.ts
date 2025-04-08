import { useCallWriteContract } from '@/hooks/useCallWriteContract';
import { handleSmcError } from '@/lib/common';
import { useCommonStore } from '@/stores/commonStore';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';

export const useClaimPrize = () => {
  const queryClient = useQueryClient();
  const setTxHash = useCommonStore.use.setTx();

  const {
    data,
    writeContract,
    isPending,
    failureReason: claimPrizeError,
    reset: resetClaimPrize,
  } = useCallWriteContract();

  const { isSuccess: txSuccess, isFetching: txFetching } = useWaitForTransactionReceipt({
    hash: data,
    confirmations: 2,
  });

  useEffect(() => {
    if (!claimPrizeError) return;
    handleSmcError(claimPrizeError);
  }, [claimPrizeError]);

  useEffect(() => {
    if (!txSuccess || !data) return;

    setTxHash(data);
    queryClient.invalidateQueries({ queryKey: ['current-draw'] });
    resetClaimPrize();
  }, [data, txSuccess, queryClient, resetClaimPrize, setTxHash]);

  return {
    claimPrize: () => writeContract('claimPrize', []),
    isClaimingPrize: isPending || txFetching,
  };
};
