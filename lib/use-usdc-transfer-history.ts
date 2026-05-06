'use client';

import React from 'react';
import { parseAbiItem, type Log } from 'viem';
import { usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';

const TRANSFER_EVENT = parseAbiItem(
    'event Transfer(address indexed from, address indexed to, uint256 value)'
);

const MAX_HISTORY_LOOKBACK_BLOCKS = 9000n;

export type TransferHistoryItem = Log & {
    args: {
        from: `0x${string}`;
        to: `0x${string}`;
        value: bigint;
    };
    timestamp: number;
};

export function useCusdTransferHistory(
    address?: `0x${string}`,
    limit = 10
) {
    const publicClient = usePublicClient();
    const [transactions, setTransactions] = React.useState<TransferHistoryItem[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = React.useState(false);

    React.useEffect(() => {
        if (!address || !publicClient) {
            setTransactions([]);
            return;
        }

        let isCancelled = false;

        const fetchLogs = async () => {
            setIsLoadingHistory(true);

            try {
                const blockNumber = await publicClient.getBlockNumber();
                const fromBlock =
                    blockNumber > MAX_HISTORY_LOOKBACK_BLOCKS
                        ? blockNumber - MAX_HISTORY_LOOKBACK_BLOCKS
                        : 0n;

                const [sentLogs, receivedLogs] = await Promise.all([
                    publicClient.getLogs({
                        address: CONTRACT_ADDRESSES.cUSD as `0x${string}`,
                        event: TRANSFER_EVENT,
                        args: { from: address },
                        fromBlock,
                    }),
                    publicClient.getLogs({
                        address: CONTRACT_ADDRESSES.cUSD as `0x${string}`,
                        event: TRANSFER_EVENT,
                        args: { to: address },
                        fromBlock,
                    }),
                ]);

                const dedupedLogs = Array.from(
                    new Map(
                        [...sentLogs, ...receivedLogs].map((log) => [
                            `${log.transactionHash}-${log.logIndex?.toString() ?? '0'}`,
                            log,
                        ])
                    ).values()
                )
                    .sort((a, b) => {
                        const blockDelta = Number(
                            (b.blockNumber || 0n) - (a.blockNumber || 0n)
                        );
                        if (blockDelta !== 0) {
                            return blockDelta;
                        }

                        return Number(
                            (b.logIndex || 0) - (a.logIndex || 0)
                        );
                    })
                    .slice(0, limit);

                const logsWithTime = await Promise.all(
                    dedupedLogs.map(async (log) => {
                        let timestamp = Date.now();

                        try {
                            if (log.blockNumber) {
                                const block = await publicClient.getBlock({
                                    blockNumber: log.blockNumber,
                                });
                                timestamp = Number(block.timestamp) * 1000;
                            }
                        } catch (error) {
                            console.error(
                                'Failed to parse block time for',
                                log.blockHash,
                                error
                            );
                        }

                        return {
                            ...log,
                            args: log.args as TransferHistoryItem['args'],
                            timestamp,
                        };
                    })
                );

                if (!isCancelled) {
                    setTransactions(logsWithTime);
                }
            } catch (error) {
                console.error('Failed to fetch transaction history:', error);
                if (!isCancelled) {
                    setTransactions([]);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoadingHistory(false);
                }
            }
        };

        fetchLogs();

        return () => {
            isCancelled = true;
        };
    }, [address, limit, publicClient]);

    return {
        transactions,
        isLoadingHistory,
    };
}
