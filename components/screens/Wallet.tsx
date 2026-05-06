'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, History, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { useActiveWalletAddress } from '@/lib/active-wallet';
import { useCeloUsdPrice } from '@/lib/use-celo-price';
import { useUsdcTransferHistory } from '@/lib/use-usdc-transfer-history';

function timeAgo(date: number | Date) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';
    return Math.floor(seconds) + 's ago';
}

export default function WalletScreen() {
    const { address } = useActiveWalletAddress();
    const { celoUsdPrice } = useCeloUsdPrice();
    const { transactions, isLoadingHistory } = useUsdcTransferHistory(address, 10);

    // Fetch CELO balance
    const { data: flowBalance } = useBalance({
        address,
    });

    // Fetch mUSDC balance
    const { data: usdcBalance } = useBalance({
        address,
        token: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
    });

    const assets = [
        {
            name: 'USDC',
            symbol: 'USDC',
            balance: usdcBalance ? parseFloat(formatUnits(usdcBalance.value, usdcBalance.decimals)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00',
            value: usdcBalance ? `$${parseFloat(formatUnits(usdcBalance.value, usdcBalance.decimals)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
            icon: '$',
            color: 'bg-[#4A90E2]'
        },
        {
            name: 'Celo',
            symbol: 'CELO',
            balance: flowBalance ? parseFloat(formatUnits(flowBalance.value, flowBalance.decimals)).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '0.00',
            value: flowBalance ? `$${(parseFloat(formatUnits(flowBalance.value, flowBalance.decimals)) * celoUsdPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
            icon: 'F',
            color: 'bg-[#27AE60]'
        },
    ];

    const totalValue = (
        (usdcBalance ? parseFloat(formatUnits(usdcBalance.value, usdcBalance.decimals)) : 0) +
        (flowBalance ? parseFloat(formatUnits(flowBalance.value, flowBalance.decimals)) * celoUsdPrice : 0)
    ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-slate-900">
            {/* Header */}
            <header className="bg-white px-4 py-6 border-b border-slate-100 sticky top-0 z-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">My Assets</h1>
                    <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <WalletIcon size={20} />
                    </div>
                </div>

                {/* Total Balance Mini */}
                <div className="bg-[#1A1A1A] rounded-[24px] p-6 text-white flex justify-between items-center shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <WalletIcon size={80} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Total Estimated Value</p>
                        <h2 className="text-2xl font-black">${totalValue}</h2>
                    </div>
                    <div className="flex gap-2 relative z-10">
                        <Link href="/send" className="size-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-90">
                            <ArrowUpRight size={20} />
                        </Link>
                        <Link href="/buy" className="size-10 bg-primary/80 rounded-xl flex items-center justify-center hover:bg-primary transition-all active:scale-90 shadow-lg shadow-primary/20">
                            <ArrowDownLeft size={20} />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 space-y-10 pb-24">
                {/* Token List */}
                <section>
                    <div className="flex justify-between items-center mb-6 px-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Your Holdings</h3>
                    </div>
                    <div className="space-y-4">
                        {assets.map((asset) => (
                            <div key={asset.symbol} className="bg-white rounded-3xl p-5 border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer shadow-sm active:scale-[0.98]">
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 rounded-2xl ${asset.color} flex items-center justify-center text-white font-black text-lg border-2 border-white shadow-sm`}>
                                        {asset.icon}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 tracking-tight">{asset.name}</p>
                                        <p className="text-xs font-bold text-slate-400">{asset.balance} {asset.symbol}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900 tracking-tight">{asset.value}</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <span className="size-1.5 rounded-full bg-success"></span>
                                        <span className="text-[9px] text-success font-black uppercase tracking-tighter">Live</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Activity List */}
                <section>
                    <div className="flex justify-between items-center mb-6 px-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-2">
                            <History size={12} /> Recent Activity
                        </h3>
                        <a
                            href={address ? `https://celo-sepolia.blockscout.com/address/${address}` : '#'}
                            target="_blank"
                            className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline"
                        >
                            View All <ExternalLink size={10} />
                        </a>
                    </div>

                    <div className="space-y-1">
                        {isLoadingHistory ? (
                            <div className="py-10 flex flex-col items-center gap-3">
                                <div className="size-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Syncing events...</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center gap-4 text-center">
                                <History size={32} className="text-slate-300" />
                                <div>
                                    <p className="text-sm font-black text-slate-900 tracking-tight">No events found</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-8 mt-1">Transactions will appear here once confirmed</p>
                                </div>
                            </div>
                        ) : (
                            transactions.map((tx, i) => {
                                const isOutgoing = tx.args.from.toLowerCase() === address?.toLowerCase();
                                const counterpart = isOutgoing ? tx.args.to : tx.args.from;
                                const amount = formatUnits(tx.args.value, 18);

                                return (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                                        <div className="flex items-center gap-4">
                                            <div className={`size-10 rounded-full flex items-center justify-center ${isOutgoing ? 'bg-amber-50 text-amber-600' : 'bg-success/10 text-success'} transition-colors`}>
                                                {isOutgoing ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 tracking-tight">
                                                    {isOutgoing ? 'Payment Sent' : 'Payment Received'}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <p className="text-[10px] font-bold text-slate-400 truncate max-w-[120px]">
                                                        {counterpart.slice(0, 6)}...{counterpart.slice(-4)}
                                                    </p>
                                                    {tx.timestamp && (
                                                        <>
                                                            <span className="size-0.5 bg-slate-300 rounded-full"></span>
                                                            <p className="text-[10px] font-bold text-slate-400">
                                                                {timeAgo(tx.timestamp)}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-black ${isOutgoing ? 'text-slate-900' : 'text-success'}`}>
                                                {isOutgoing ? '-' : '+'}{parseFloat(amount).toFixed(2)}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">USDC</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
