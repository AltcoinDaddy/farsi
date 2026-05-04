'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

const ONBOARDING_ROUTE = '/onboarding';
const ONBOARDING_STORAGE_KEY = 'farsi_onboarded';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { ready, authenticated } = usePrivy();
    const [isMounted, setIsMounted] = React.useState(false);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(false);

    const isOnboardingRoute = pathname === ONBOARDING_ROUTE;

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
        if (!isMounted || !ready) return;

        if (isOnboardingRoute) {
            if (authenticated && hasCompletedOnboarding) {
                router.replace('/');
            }
            return;
        }

        if (!authenticated) {
            router.replace(ONBOARDING_ROUTE);
            return;
        }

        if (!hasCompletedOnboarding) {
            router.replace(ONBOARDING_ROUTE);
            return;
        }
    }, [authenticated, hasCompletedOnboarding, isMounted, isOnboardingRoute, ready, router]);

    const showLoadingState =
        !isMounted ||
        (!isOnboardingRoute &&
            (!ready ||
                !authenticated ||
                !hasCompletedOnboarding)) ||
        (isOnboardingRoute && ready && authenticated && hasCompletedOnboarding);

    if (showLoadingState) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}
