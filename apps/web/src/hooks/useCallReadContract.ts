'use client';

import { ERC721Abi } from '@/contracts/abi';
import { env } from '@/lib/const';
import { useReadContract } from 'wagmi';

export const useCallReadContract = ({ functionName, args }: { functionName: string; args?: any[] }) => {
  return useReadContract({
    abi: ERC721Abi,
    address: env.CONTRACT_ADDRESS,
    functionName,
    args,
  });
};
