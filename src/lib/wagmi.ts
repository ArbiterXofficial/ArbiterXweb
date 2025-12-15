import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, bsc, polygon } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const projectId = 'arbiterx-wallet-app';

export const config = createConfig({
  chains: [mainnet, sepolia, bsc, polygon],
  connectors: [
    injected(),
    walletConnect({ 
      projectId,
      showQrModal: true,
      metadata: {
        name: 'ArbiterX',
        description: 'Cross-Chain Wallet & Instant Swap',
        url: window.location.origin,
        icons: ['https://avatars.githubusercontent.com/u/37784886'],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
