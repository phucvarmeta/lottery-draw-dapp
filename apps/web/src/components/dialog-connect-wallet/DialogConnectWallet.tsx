'use client';

import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { handleSmcError } from '@/lib/common';
import { Connector, useChainId, useConnect, useDisconnect } from 'wagmi';
import { ConnectorItem } from './ConnectorItem';
import { toast } from '@/hooks/use-toast';

type Props = {};

export const DialogConnectWallet = ({ children }: PropsWithChildren<Props>) => {
  const chainId = useChainId();
  const { connectors, connectAsync, isPending, variables, isError, failureReason } = useConnect();
  const { disconnect } = useDisconnect();
  const refBtnClose = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => {
    refBtnClose.current?.click();
  }, []);

  const handleConnect = async ({ connector, chainId }: { connector: Connector; chainId?: number }) => {
    try {
      const { accounts = [] } = await connectAsync({
        connector,
        chainId,
      });
      const accountsAddress = accounts[0];
      if (!accountsAddress) return;

      handleClose();
    } catch (error: any) {
      toast({
        title: error?.message || 'Connect wallet error',
        variant: 'destructive',
      });
      disconnect();
    }
  };

  useEffect(() => {
    if (!isError || !failureReason) return;
    handleSmcError(failureReason);
  }, [isError, failureReason]);

  const connectLoading = isPending;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-5xl text-center mt-8 uppercase">Connect Wallet</DialogTitle>
          <DialogDescription className="text-center my-4">Sign In with</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 ">
          {connectors.map((connector) => (
            <ConnectorItem
              isConnecting={connectLoading}
              isLoading={connectLoading && (variables?.connector as Connector)?.uid === connector.uid}
              key={connector.uid}
              connector={connector}
              onClick={() => handleConnect({ connector, chainId })}
            />
          ))}
        </div>
        {/* <DialogFooter>
          <DialogClose asChild>
            <Button className="mx-auto" type="button" variant="secondary" ref={refBtnClose}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};
