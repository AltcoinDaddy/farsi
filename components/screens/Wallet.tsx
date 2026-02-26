'use client';

import { Search, ArrowUpRight, ArrowDownLeft, Filter, ChevronRight, Wallet as WalletIcon, History } from 'lucide-react';
import Link from 'next/link';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/web3-config';

export default function WalletScreen() {
    const { address } = useAccount();

    // Fetch FLOW balance
    const { data: flowBalance } = useBalance({
        address,
    });

    // Fetch mUSDC balance
    const { data: usdcBalance } = useBalance({
        address,
        token: CONTRACT_ADDRESSES.MUSDC as `0x${string}`,
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
            name: 'Flow',
            symbol: 'FLOW',
            balance: flowBalance ? parseFloat(formatUnits(flowBalance.value, flowBalance.decimals)).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '0.00',
            value: flowBalance ? `$${(parseFloat(formatUnits(flowBalance.value, flowBalance.decimals)) * 0.76).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
            icon: 'F',
            color: 'bg-[#27AE60]'
        },
    ];

    const totalValue = (
        (usdcBalance ? parseFloat(formatUnits(usdcBalance.value, usdcBalance.decimals)) : 0) +
        (flowBalance ? parseFloat(formatUnits(flowBalance.value, flowBalance.decimals)) * 0.76 : 0)
    ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const transactions = [
        { type: 'Activity', amount: 'Check Explorer', from: 'On-chain', date: 'Real-time', status: 'confirmed' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
            {/* Header */}
            <header className="bg-white px-4 py-6 border-b border-slate-100 sticky top-0 z-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Assets</h1>
                    <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <WalletIcon size={20} />
                    </div>
                </div>

                {/* Total Balance Mini */}
                <div className="bg-[#1A1A1A] rounded-2xl p-4 text-white flex justify-between items-center shadow-lg">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Total Estimated Value</p>
                        <h2 className="text-xl font-bold">${totalValue}</h2>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/send" className="size-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                            <ArrowUpRight size={18} />
                        </Link>
                        <Link href="/buy" className="size-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                            <ArrowDownLeft size={18} />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-4 space-y-8 pb-24">
                {/* Token List */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Tokens</h3>
                        <button className="text-[11px] font-bold text-[#4A90E2]">Manage List</button>
                    </div>
                    <div className="space-y-3">
                        {assets.map((asset) => (
                            <div key={asset.symbol} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className={`size-10 rounded-full ${asset.color} flex items-center justify-center text-white font-bold`}>
                                        {asset.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{asset.name}</p>
                                        <p className="text-xs text-slate-500">{asset.balance} {asset.symbol}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">{asset.value}</p>
                                    <p className="text-[10px] text-[#27AE60] font-bold">Live</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* History Link */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <History size={14} /> Recent Activity
                        </h3>
                    </div>

                    <a
                        href={`https://evm-testnet.flowscan.io/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm p-6 flex flex-col items-center justify-center gap-3 group hover:bg-slate-50 transition-colors"
                    >
                        <div className="size-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                            <Search size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-slate-900">View on Explorer</p>
                            <p className="text-[10px] text-slate-500">Check full transaction history on Flowscan</p>
                        </div>
                    </a>
                </section>
            </main>
        </div>
    );
}
