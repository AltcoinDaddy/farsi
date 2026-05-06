'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { useMiniPay } from '@/lib/minipay';

const ONBOARDING_ROUTE = '/onboarding';
const ONBOARDING_STORAGE_KEY = 'farsi_onboarded';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { ready, authenticated } = usePrivy();
    const { address } = useAccount();
    const { isMiniPay } = useMiniPay();
    const [isMounted, setIsMounted] = React.useState(false);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(false);

    const isOnboardingRoute = pathname === ONBOARDING_ROUTE;
    const hasWalletSession = !!address;
    const hasIdentitySession = authenticated || hasWalletSession;
    const identityReady = isMiniPay ? true : ready;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        setHasCompletedOnboarding(
            window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true'
        );
    }, [isMounted, pathname]);

    useEffect(() => {
        if (!isMounted || !identityReady) return;

        if (isOnboardingRoute) {
            if (hasIdentitySession && hasCompletedOnboarding) {
                router.replace('/');
            }
            return;
        }

        if (!hasIdentitySession) {
            router.replace(ONBOARDING_ROUTE);
            return;
        }

        if (!hasCompletedOnboarding) {
            router.replace(ONBOARDING_ROUTE);
            return;
        }
    }, [
        hasCompletedOnboarding,
        hasIdentitySession,
        identityReady,
        isMounted,
        isOnboardingRoute,
        router,
    ]);

    const showLoadingState =
        !isMounted ||
        (!isOnboardingRoute &&
            (!identityReady ||
                !hasIdentitySession ||
                !hasCompletedOnboarding)) ||
        (isOnboardingRoute &&
            identityReady &&
            hasIdentitySession &&
            hasCompletedOnboarding);

    if (showLoadingState) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}
