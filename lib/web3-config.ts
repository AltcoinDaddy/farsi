import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'viem';

/**
 * Flow EVM Testnet Configuration
 */
export const flowEVMTestnet = {
    id: 545,
    name: 'Flow EVM Testnet',
    network: 'flow-evm-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'FLOW',
        symbol: 'FLOW',
    },
    rpcUrls: {
        default: { http: ['https://testnet.evm.nodes.onflow.org'] },
        public: { http: ['https://testnet.evm.nodes.onflow.org'] },
    },
    blockExplorers: {
        default: { name: 'Flowscan', url: 'https://evm-testnet.flowscan.io' },
    },
    testnet: true,
} as const;

export const config = getDefaultConfig({
    appName: 'Farsi DeFi',
    projectId: 'YOUR_PROJECT_ID', // Replace with real WalletConnect ID
    chains: [flowEVMTestnet],
    ssr: true,
});

export const CONTRACT_ADDRESSES = {
    MUSDC: '0x63F28bF688e38429E4123503cdba1A9237aAe8B9',
    YIELD_VAULT: '0x8DF0868e0f0c00C73e2315C74D6CFaD42Db4bBD2',
    POT_FACTORY: '0x77326e1532e97f9022D15a5D1d186e196c853abC',
};
