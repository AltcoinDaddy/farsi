import { type Chain } from 'viem';

/**
 * Celo Sepolia configuration for the MiniPay-compatible Farsi build.
 */
export const celoSepoliaChain: Chain = {
    id: 11142220,
    name: 'Celo Sepolia',
    nativeCurrency: {
        decimals: 18,
        name: 'CELO',
        symbol: 'CELO',
    },
    rpcUrls: {
        default: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
        public: { http: ['https://forno.celo-sepolia.celo-testnet.org'] },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://celo-sepolia.blockscout.com',
        },
    },
    testnet: true,
};
