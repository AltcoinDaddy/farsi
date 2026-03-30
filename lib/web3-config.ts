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

