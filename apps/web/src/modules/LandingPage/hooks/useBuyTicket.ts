import { useCallWriteContract } from '@/hooks/useCallWriteContract';
import { handleSmcError } from '@/lib/common';
import { useCommonStore } from '@/stores/commonStore';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

export const useBuyTicket = () => {
  const queryClient = useQueryClient();
  const setTxHash = useCommonStore.use.setTx();

  const {
    data,
    writeContract,
    isPending,
    failureReason: buyTicketError,
    reset: resetBuyTicket,
  } = useCallWriteContract();

  const { isSuccess: txSuccess, isFetching: txFetching } = useWaitForTransactionReceipt({
    hash: data,
    confirmations: 2,
  });

  useEffect(() => {
    if (!buyTicketError) return;
    handleSmcError(buyTicketError);
  }, [buyTicketError]);

  useEffect(() => {
    if (!txSuccess || !data) return;

    setTxHash(data);
    queryClient.invalidateQueries({ queryKey: ['current-draw'] });
    resetBuyTicket();
  }, [data, txSuccess, queryClient, resetBuyTicket, setTxHash]);

  return {
    buyTicket: () => writeContract('buyTicket', [parseEther('0.001')]),
    isBuyingTicket: isPending || txFetching,
  };
};
