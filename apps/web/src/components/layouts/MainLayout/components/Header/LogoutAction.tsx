import { Icons } from '@/assets/icons';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useDisconnect } from 'wagmi';

export const LogoutAction = () => {
  const { disconnect, isPending } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <DropdownMenuItem asChild>
      <button className="flex justify-start items-center gap-2" onClick={handleDisconnect} disabled={isPending}>
        <Icons.logout width={20} height={20} />
        <span>Disconnect Wallet</span>
      </button>
    </DropdownMenuItem>
  );
};
