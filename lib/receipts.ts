import { TransactionFeeMode } from './aa-config';
import { celoSepoliaChain } from './web3-config';

export function createReceiptUrl(
    amount: string,
    type: string,
    hash?: string,
    feeMode: TransactionFeeMode = 'native',
    extraParams?: Record<string, string | undefined>
) {
    const params = new URLSearchParams({
        amount,
        type,
        fee: feeMode,
    });

    if (hash) {
        params.set('hash', hash);
    }

    if (extraParams) {
        for (const [key, value] of Object.entries(extraParams)) {
            if (value) {
                params.set(key, value);
            }
        }
    }

    return `/receipt?${params.toString()}`;
}

export function getReceiptFeeLabel(feeMode: TransactionFeeMode) {
    return feeMode === 'configured' ? 'Configured Route' : 'Native CELO';
}

export function createExplorerReceiptUrl(hash: string) {
    return `${celoSepoliaChain.blockExplorers?.default.url}/tx/${hash}`;
}

export function createMiniPayReceiptUrl(hash: string) {
    return `https://link.minipay.xyz/receipt?tx=${hash}`;
}
