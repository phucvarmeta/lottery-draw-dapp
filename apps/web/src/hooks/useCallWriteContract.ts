'use client';

import { ERC721Abi } from '@/contracts/abi';
import { env } from '@/lib/const';
import { useAccount, useWriteContract } from 'wagmi';

export const useCallWriteContract = (value?: bigint) => {
  const { address } = useAccount();
  const { writeContract, ...rest } = useWriteContract();

  const callWriteContract = (functionName: string, args: any[]) => {
    writeContract({
      abi: ERC721Abi,
      address: env.CONTRACT_ADDRESS,
      functionName,
      args,
      account: address,
      value,
    });
  };

  return { writeContract: callWriteContract, ...rest };
};
