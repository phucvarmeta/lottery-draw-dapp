import { LinkBlank } from '@/components/LinkBlank';
import { ButtonSkew } from '@/components/ui/button-skew';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HStack, VStack } from '@/components/ui/Utilities';
import { shortenString } from '@/lib/common';
import { env } from '@/lib/const';
import { useAccount } from 'wagmi';
import { LogoutAction } from './LogoutAction';

export const AccountInfo = () => {
  const { address } = useAccount();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonSkew className="px-2 py-1 lg:px-6 lg:py-4 max-lg:h-8 text-xs uppercase focus-visible:ring-0 focus-visible:ring-offset-0">
          {shortenString(address, 4)}
        </ButtonSkew>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={0}
        side="bottom"
        align="end"
        className="h-full max-h-[calc(100vh_-_56px)] w-56 overflow-auto px-2 py-4"
      >
        <DropdownMenuGroup>
          <VStack spacing={16}>
            <HStack className="text-sm pl-2" align={'center'}>
              <span>Hi</span>
              {shortenString(address, 4)}
            </HStack>

            {/* <Balance /> */}

            {/* <LinkAction title="My NFTs" href={`/u/${address}`} icon={<Icons.image width={20} height={20} />} /> */}

            <LogoutAction />
          </VStack>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
