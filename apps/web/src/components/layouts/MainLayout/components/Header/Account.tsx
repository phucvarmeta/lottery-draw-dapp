import { DialogConnectWallet } from '@/components/dialog-connect-wallet';
import { ButtonSkew } from '@/components/ui/button-skew';
import { useAccount } from 'wagmi';
import { AccountInfo } from './AccountInfo';
import { useIsMounted } from '@/hooks/useIsMounted';

const Account = () => {
  const isMounted = useIsMounted();
  const { isConnected } = useAccount();

  if (!isMounted) return null;
  return <>{isConnected ? <AccountInfo /> : <ConnectWalletDialog />}</>;
};

export default Account;

const ConnectWalletDialog = () => {
  return (
    <DialogConnectWallet>
      <ButtonSkew className="px-2 py-1 lg:px-6 lg:py-4 max-lg:h-8 text-xs uppercase">Connect Wallet</ButtonSkew>
    </DialogConnectWallet>
  );
};

// const Balance = () => {
//   const { address } = useAccount();
//   const { data: balance } = useBalance({
//     address,
//   });

//   return (
//     <HStack pos={'apart'} align={'baseline'} spacing={8}>
//       <label>Balance:</label>
//       <span className="text-sm">
//         {balance?.value ? formatUnits(balance.value, 18) : 0} {balance?.symbol ?? ''}
//       </span>
//     </HStack>
//   );
// };
