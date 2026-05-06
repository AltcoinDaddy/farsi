'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi';
import { celoSepoliaChain } from '@/lib/web3-config';
import { PrivyProvider } from '@privy-io/react-auth';
import { AuthGuard } from '@/components/AuthGuard';
import { ThemeProvider } from '@/lib/theme-context';
import { NotificationProvider } from '@/lib/notification-context';

export const wagmiConfig = createConfig({
    chains: [celoSepoliaChain],
    transports: {
        [celoSepoliaChain.id]: http(),
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmn7qmuq704sl0cl8omche88f'}
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
                defaultChain: celoSepoliaChain,
                supportedChains: [celoSepoliaChain],
            }}
        >
            <QueryClientProvider client={queryClient}>
                {isMounted ? (
                    <WagmiProvider config={wagmiConfig}>
                        <ThemeProvider>
                            <NotificationProvider>
                                <AuthGuard>
                                    {children}
                                </AuthGuard>
                            </NotificationProvider>
                        </ThemeProvider>
                    </WagmiProvider>
                ) : (
                    <div className="min-h-screen bg-white flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </QueryClientProvider>
        </PrivyProvider>
    );
}
