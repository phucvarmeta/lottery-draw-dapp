import { createConfig, http } from 'wagmi';
import { Chain, bsc, bscTestnet } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';
import { env, isUseTestnet } from './const';

const EVM_CHAIN: Chain = isUseTestnet ? bscTestnet : bsc;

export const config = createConfig({
  chains: [EVM_CHAIN],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'Lottery Dapp',
        url: 'http://localhost:3000',
        iconUrl: 'https://wagmi.io/favicon.ico',
      },
    }),
    // safe(),
  ],
  transports: {
    [EVM_CHAIN.id]: http(),
  },
});
