'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { flowEVMTestnet } from '@/lib/web3-config';
import { PrivyProvider } from '@privy-io/react-auth';
import { AuthGuard } from '@/components/AuthGuard';

const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
    chains: [flowEVMTestnet],
    transports: {
        [flowEVMTestnet.id]: http(),
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId="cmn7qmuq704sl0cl8omche88f"
            config={{
                appearance: {
                    theme: 'light',
                    accentColor: '#4A90E2',
                    showWalletLoginFirst: true,
                },
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: 'users-without-wallets',
                    },
                },
                defaultChain: flowEVMTestnet,
                supportedChains: [flowEVMTestnet],
            }}
        >
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig}>
                    <AuthGuard>
                        {children}
                    </AuthGuard>
                </WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    );
}
