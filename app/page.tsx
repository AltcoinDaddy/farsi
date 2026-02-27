'use client';

import { usePrivy } from '@/lib/mock-privy';
import { useBalance } from 'wagmi';
import Link from 'next/link';
import { formatUnits, parseAbiItem } from 'viem';
import { usePublicClient, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import YieldVaultABI from '@/lib/abi/YieldVault.json';
import { ArrowUpRight, ArrowDownLeft, PersonStanding, History } from 'lucide-react';
import React from 'react';

const TRANSFER_EVENT = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)');

export default function DashboardPage() {
    const { user } = usePrivy();
    const { data: balance, isLoading: isBalanceLoading } = useBalance({
        address: user?.wallet?.address as `0x${string}`,
    });

    const displayName = user?.email?.address?.split('@')[0] || 'User';
    const publicClient = usePublicClient();
    const [transactions, setTransactions] = React.useState<any[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = React.useState(false);

    // Fetch Vault shares balance to see if they HAVE yield
    const { data: vaultBalance } = useReadContract({
        address: CONTRACT_ADDRESSES.YieldVault as `0x${string}`,
        abi: YieldVaultABI,
        functionName: 'balanceOf',
        args: [user?.wallet?.address],
    });

    // Fetch recent mUSDC transfers (same logic as Wallet.tsx)
    React.useEffect(() => {
        if (!user?.wallet?.address || !publicClient) return;
        const address = user.wallet.address as `0x${string}`;

        const fetchLogs = async () => {
            setIsHistoryLoading(true);
            try {
                const sentLogs = await publicClient.getLogs({
                    address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
                    event: TRANSFER_EVENT,
                    args: { from: address },
                    fromBlock: 'earliest',
                });
                const receivedLogs = await publicClient.getLogs({
                    address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
                    event: TRANSFER_EVENT,
                    args: { to: address },
                    fromBlock: 'earliest',
                });
                const allLogs = [...sentLogs, ...receivedLogs]
                    .sort((a, b) => Number((b.blockNumber || 0n) - (a.blockNumber || 0n)))
                    .slice(0, 3); // Just show top 3 on dashboard
                setTransactions(allLogs);
            } catch (err) {
                console.error('Failed to fetch dashboard history:', err);
            } finally {
                setIsHistoryLoading(false);
            }
        };
        fetchLogs();
    }, [user?.wallet?.address, publicClient]);

    const formattedBalance = balance ? parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(2) : '0.00';
    const hasYield = vaultBalance && (vaultBalance as bigint) > 0n;

    return (
        <div className="bg-background-light text-neutral-dark min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white px-4 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4A90E2]/10 flex items-center justify-center overflow-hidden border border-[#4A90E2]/20">
                        {/* Use a generic avatar or initials if real image is not available */}
                        <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase">
                            {displayName[0]}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-[#4A4A4A] font-medium">Welcome back</p>
                        <h1 className="text-lg font-bold text-[#1A1A1A] leading-tight capitalize">Hi, {displayName}!</h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F8F9FA] text-[#4A4A4A]">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F8F9FA] text-[#4A4A4A]">
                        <span className="material-symbols-outlined">qr_code_scanner</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto pb-24">
                {/* Balance Card */}
                <div className="p-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-[#4A4A4A] mb-1 flex items-center gap-1">
                                    Total Balance <span className="material-symbols-outlined text-xs">visibility</span>
                                </p>
                                <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
                                    {isBalanceLoading ? '...' : formattedBalance} {balance?.symbol || 'FLOW'}
                                </h2>
                                <p className="text-[10px] text-neutral-muted mt-2 font-mono truncate max-w-[150px]">
                                    {user?.wallet?.address}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 bg-[#F8F9FA] px-2 py-1 rounded text-[10px] font-bold text-[#4A4A4A] border border-gray-200 uppercase tracking-wider">
                                <span className="material-symbols-outlined text-xs text-[#4A90E2]">change_history</span> Flow EVM
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 bg-[#4A90E2] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-lg">add_circle</span>
                                Add Funds
                            </button>
                            <Link href="/send" className="flex-1 bg-[#E6F0FA] text-[#4A90E2] font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
                                <span className="material-symbols-outlined text-lg">near_me</span>
                                Send
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Yield Banner */}
                <div className="px-4 mb-6">
                    <Link href="/earn" className={`${hasYield ? 'bg-[#D4F4E2] border-[#27AE60]/20' : 'bg-blue-50 border-blue-100'} border rounded-lg p-4 flex items-center justify-between transition-all`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-white rounded-full flex items-center justify-center ${hasYield ? 'text-[#27AE60]' : 'text-primary'} shadow-sm`}>
                                <span className="material-symbols-outlined">{hasYield ? 'account_balance' : 'rocket_launch'}</span>
                            </div>
                            <div>
                                <p className={`${hasYield ? 'text-[#27AE60]' : 'text-primary'} font-bold text-sm leading-tight`}>
                                    {hasYield ? 'Your yield is growing!' : 'Start Earning Yield'}
                                </p>
                                <p className={`${hasYield ? 'text-[#27AE60]/80' : 'text-primary/70'} text-xs`}>
                                    {hasYield ? 'Vault assets are working for you.' : 'Put your idle mUSDC to work.'}
                                </p>
                            </div>
                        </div>
                        <span className={`material-symbols-outlined ${hasYield ? 'text-[#27AE60]' : 'text-primary'}`}>chevron_right</span>
                    </Link>
                </div>

                {/* Quick Actions Grid */}
                <div className="px-4 mb-8">
                    <h3 className="text-sm font-bold text-[#4A4A4A] mb-4 uppercase tracking-wider">Quick Actions</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <Link href="/buy" className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#4A90E2] border border-gray-100">
                                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                            </button>
                            <span className="text-[11px] font-semibold text-[#4A4A4A] text-center">Buy Crypto</span>
                        </Link>
                        <Link href="/earn" className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#4A90E2] border border-gray-100">
                                <span className="material-symbols-outlined text-2xl">show_chart</span>
                            </button>
                            <span className="text-[11px] font-semibold text-[#4A4A4A] text-center">Yield</span>
                        </Link>
                        <Link href="/receipt" className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#4A90E2] border border-gray-100">
                                <span className="material-symbols-outlined text-2xl">receipt_long</span>
                            </button>
                            <span className="text-[11px] font-semibold text-[#4A4A4A] text-center">Pay</span>
                        </Link>
                        <Link href="/social" className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#4A90E2] border border-gray-100">
                                <span className="material-symbols-outlined text-2xl">groups</span>
                            </button>
                            <span className="text-[11px] font-semibold text-[#4A4A4A] text-center">Pots</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="px-4">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Recent Activity</h3>
                        <Link href="/wallet" className="text-[10px] font-black text-primary uppercase tracking-widest">View All</Link>
                    </div>
                    <div className="space-y-3">
                        {isHistoryLoading ? (
                            <div className="py-8 flex flex-col items-center gap-2">
                                <div className="size-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Syncing...</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center text-center gap-2">
                                <History size={24} className="text-slate-200" />
                                <p className="text-xs font-bold text-slate-400">No recent activity</p>
                            </div>
                        ) : (
                            transactions.map((tx, i) => {
                                const isOutgoing = tx.args.from.toLowerCase() === user?.wallet?.address?.toLowerCase();
                                const amount = formatUnits(tx.args.value, 18);
                                return (
                                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOutgoing ? 'bg-amber-50 text-amber-600' : 'bg-success/10 text-success'}`}>
                                                {isOutgoing ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#1A1A1A]">{isOutgoing ? 'Sent mUSDC' : 'Received mUSDC'}</p>
                                                <p className="text-[10px] text-neutral-muted uppercase font-bold tracking-tight">Confirmed</p>
                                            </div>
                                        </div>
                                        <p className={`text-sm font-black ${isOutgoing ? 'text-slate-900' : 'text-success'}`}>
                                            {isOutgoing ? '-' : '+'}{parseFloat(amount).toFixed(2)}
                                        </p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
