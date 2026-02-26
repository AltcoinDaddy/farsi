'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Skip check on onboarding page
        if (pathname === '/onboarding') {
            setIsChecking(false);
            return;
        }

        const onboarded = localStorage.getItem('farsi_onboarded');
        if (!onboarded) {
            router.push('/onboarding');
        } else {
            setIsChecking(false);
        }
    }, [pathname, router]);

    // Prevent content "flashing" while checking or redirecting
    if (isChecking && pathname !== '/onboarding') {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}
