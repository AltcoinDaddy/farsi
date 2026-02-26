'use client';

import { Search, ArrowUpRight, ArrowDownLeft, Filter, ChevronRight, Wallet as WalletIcon, Coins, History } from 'lucide-react';
import Link from 'next/link';

export default function WalletScreen() {
    const assets = [
        { name: 'USDC', symbol: 'USDC', balance: '1,250.00', value: '$1,250.00', icon: '$', color: 'bg-[#4A90E2]' },
        { name: 'Flow', symbol: 'FLOW', balance: '450.0', value: '$342.15', icon: 'F', color: 'bg-[#27AE60]' },
        { name: 'Ethereum', symbol: 'ETH', balance: '0.05', value: '$124.50', icon: 'E', color: 'bg-[#627EEA]' },
    ];

    const transactions = [
        { type: 'Received', amount: '+100 USDC', from: '0x1234...5678', date: '2h ago', status: 'confirmed' },
        { type: 'Sent', amount: '-50 USDC', to: '0x8765...4321', date: '5h ago', status: 'confirmed' },
        { type: 'Swapped', amount: '10 FLOW', for: 'USDC', date: '1d ago', status: 'confirmed' },
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
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Total Balance</p>
                        <h2 className="text-xl font-bold">$1,716.65</h2>
                    </div>
                    <div className="flex gap-2">
                        <button className="size-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                            <ArrowUpRight size={18} />
                        </button>
                        <button className="size-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                            <ArrowDownLeft size={18} />
                        </button>
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
                                    <p className="text-[10px] text-[#27AE60] font-bold">+1.2%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* History */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <History size={14} /> Activity
                        </h3>
                        <button className="size-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                            <Filter size={14} />
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                        {transactions.map((tx, i) => (
                            <div key={i} className={`p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${i !== transactions.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`size-9 rounded-xl flex items-center justify-center ${tx.type === 'Received' ? 'bg-[#27AE60]/10 text-[#27AE60]' : 'bg-[#4A90E2]/10 text-[#4A90E2]'}`}>
                                        {tx.type === 'Received' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{tx.type} {tx.amount.split(' ')[1]}</p>
                                        <p className="text-[10px] text-slate-500">{tx.date} • {tx.status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${tx.amount.startsWith('+') ? 'text-[#27AE60]' : 'text-slate-900'}`}>
                                        {tx.amount}
                                    </p>
                                    <ChevronRight size={14} className="text-slate-300 ml-auto mt-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
