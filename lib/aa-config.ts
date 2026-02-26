/**
 * Account Abstraction Configuration for Farsi DeFi
 * Uses Privy for Authentication and ZeroDev for Smart Accounts
 */
import { flowEVMTestnet } from './web3-config';

// Replace with actual IDs from dashboard.privy.io and zerodev.app
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cm...';
export const ZERODEV_PROJECT_ID = process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID || '...';

/**
 * Flow EVM specific RPC for Smart Accounts
 */
export const FLOW_AA_RPC = 'https://testnet.evm.nodes.onflow.org';

/**
 * AA Config Helpers
 */
export const aaConfig = {
    chain: flowEVMTestnet,
    projectId: ZERODEV_PROJECT_ID,
};
