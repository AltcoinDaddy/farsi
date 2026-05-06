'use client';

import { useState, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http, useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { celoSepoliaChain } from '@/lib/web3-config';
import { PrivyProvider } from '@privy-io/react-auth';
import { AuthGuard } from '@/components/AuthGuard';
import { ThemeProvider } from '@/lib/theme-context';
import { NotificationProvider } from '@/lib/notification-context';
import { useMiniPay } from '@/lib/minipay';

export const wagmiConfig = createConfig({
    ssr: true,
    chains: [celoSepoliaChain],
    connectors: [injected()],
    transports: {
        [celoSepoliaChain.id]: http(),
    },
});

function MiniPayAutoConnect(): null {
    const { isMiniPay } = useMiniPay();
    const { address, status } = useAccount();
    const { connect, connectors, isPending } = useConnect();
    const hasAttemptedAutoConnect = useRef(false);

    useEffect(() => {
        if (!isMiniPay || address || status === 'connected' || isPending) return;
        if (hasAttemptedAutoConnect.current) return;

        const injectedConnector = connectors.find(
            (connector) => connector.type === 'injected'
        );

        if (!injectedConnector) return;

        hasAttemptedAutoConnect.current = true;
        connect({ connector: injectedConnector });
    }, [
        address,
        connect,
        connectors,
        isMiniPay,
        isPending,
        status,
    ]);

    return null;
}

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
                        <MiniPayAutoConnect />
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
