'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { flowEVMTestnet } from '@/lib/web3-config';
import { MockPrivyProvider } from '@/lib/mock-privy';
import { AuthGuard } from '@/components/AuthGuard';

const queryClient = new QueryClient();

// Minimal Wagmi config
const wagmiConfig = createConfig({
    chains: [flowEVMTestnet],
    transports: {
        [flowEVMTestnet.id]: http(),
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <MockPrivyProvider>
            <AuthGuard>
                <WagmiProvider config={wagmiConfig}>
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </WagmiProvider>
            </AuthGuard>
        </MockPrivyProvider>
    );
}
