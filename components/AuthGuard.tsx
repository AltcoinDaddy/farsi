'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { ready, authenticated } = usePrivy();

    const [isMounted, setIsMounted] = React.useState(false);

    return <>{children}</>;
}
