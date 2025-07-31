import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { metaMask, coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'EmotoInch',
      appLogoUrl: 'https://emotoinch.app/icon.png'
    })
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
