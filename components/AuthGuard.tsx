'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { ready, authenticated } = usePrivy();

    useEffect(() => {
        // Skip check on onboarding page
        if (pathname === '/onboarding') {
            return;
        }

        if (ready && !authenticated) {
            router.push('/onboarding');
        }
    }, [ready, authenticated, pathname, router]);

    // Prevent content "flashing" while check or redirecting
    if (!ready && pathname !== '/onboarding') {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}
