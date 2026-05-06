/**
 * Account Abstraction Configuration for Farsi DeFi
 * Uses Privy for Authentication and ZeroDev for Smart Accounts
 */
import { flowEVMTestnet } from './web3-config';

// Replace with actual IDs from dashboard.privy.io and zerodev.app
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cm...';
export const ZERODEV_PROJECT_ID = process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID || '...';
export const SPONSORED_TRANSACTIONS_FLAG =
    process.env.NEXT_PUBLIC_ENABLE_SPONSORED_TRANSACTIONS === 'true';

/**
 * Flow EVM specific RPC for Smart Accounts
 */
export const FLOW_AA_RPC = 'https://testnet.evm.nodes.onflow.org';

export type TransactionFeeMode = 'native' | 'configured';

function hasConfiguredProjectId(projectId: string) {
    return (
        !!projectId &&
        projectId !== 'your_zerodev_project_id' &&
        !projectId.includes('...')
    );
}

export function getSponsorshipState() {
    const hasProjectId = hasConfiguredProjectId(ZERODEV_PROJECT_ID);
    const isConfigured = SPONSORED_TRANSACTIONS_FLAG && hasProjectId;

    return {
        isConfigured,
        feeMode: (isConfigured ? 'configured' : 'native') as TransactionFeeMode,
        feeLabel: isConfigured ? 'Configured Sponsorship' : 'Native FLOW',
        feeDescription: isConfigured
            ? 'Uses the configured smart-account sponsorship path when available.'
            : 'Requires the wallet to pay Flow testnet gas.',
    };
}

/**
 * AA Config Helpers
 */
export const aaConfig = {
    chain: flowEVMTestnet,
    projectId: ZERODEV_PROJECT_ID,
    sponsorship: getSponsorshipState(),
};
