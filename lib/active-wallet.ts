'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';

type WalletBearingUser = {
    smartWallet?: { address?: string | null } | null;
    wallet?: { address?: string | null } | null;
    email?: { address?: string | null } | null;
};

export function getPrivyWalletAddress(user?: WalletBearingUser | null) {
    const address = user?.smartWallet?.address || user?.wallet?.address;
    return (address || undefined) as `0x${string}` | undefined;
}

export function useActiveWalletAddress() {
    const { user } = usePrivy();
    const { address: wagmiAddress } = useAccount();

    return {
        user,
        address:
            getPrivyWalletAddress(user as WalletBearingUser | null) ||
            (wagmiAddress as `0x${string}` | undefined),
    };
}
