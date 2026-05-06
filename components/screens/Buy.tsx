'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useActiveWalletAddress } from '@/lib/active-wallet';
import { openMiniPayAddCash } from '@/lib/minipay';

export default function BuyScreen() {
    const router = useRouter();
    const { address } = useActiveWalletAddress();
    const [usdAmount, setUsdAmount] = React.useState('100');
    const cUsdReceived = (parseFloat(usdAmount || '0') * 0.9845).toFixed(2);

    const handleStartPurchase = () => {
        if (!address) {
            toast.error('Connect wallet', {
                description: 'Open Farsi from MiniPay or connect a Celo wallet first.',
            });
            return;
        }

        openMiniPayAddCash();

        toast.info('Opening MiniPay Add Cash', {
            description: 'This opens MiniPay so you can fund your wallet with cUSD.',
        });
    };

    return (
        <div className="bg-white flex flex-col min-h-screen text-slate-900">
            {/* Header */}
            <div className="flex items-center bg-white p-4 pb-2 justify-between border-b border-slate-100">
                <button onClick={() => router.back()} className="text-slate-900 flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-50 rounded-full transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-slate-900 text-lg font-black leading-tight tracking-tight flex-1 text-center pr-10">Add Cash</h2>
            </div>

            <div className="mx-6 mt-6 rounded-[28px] border border-primary/15 bg-primary/5 p-4 text-slate-900">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-xl text-primary">account_balance_wallet</span>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">MiniPay Funding</p>
                        <p className="text-xs font-bold leading-relaxed">
                            Farsi uses MiniPay&apos;s native Add Cash flow for funding. Choose an amount, then continue in MiniPay to top up your wallet with cUSD.
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="flex w-full flex-row items-center justify-center gap-8 py-8">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-black shadow-lg shadow-primary/20">1</div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Amount</span>
                </div>
                <div className="h-1 w-12 bg-slate-100 rounded-full"></div>
                <div className="flex flex-col items-center gap-2">
                    <div className="h-9 w-9 rounded-full border-2 border-slate-100 bg-white flex items-center justify-center text-slate-300 text-sm font-black">2</div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Payment</span>
                </div>
            </div>

            {/* Input Section */}
            <main className="flex-1 px-6 space-y-8">
                <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">You pay</label>
                    <div className="relative group">
                        <input
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[32px] p-8 text-4xl font-black text-slate-900 focus:border-primary outline-none transition-all pr-28 group-hover:border-slate-200"
                            type="number"
                            value={usdAmount}
                            onChange={(e) => setUsdAmount(e.target.value)}
                            placeholder="0.00"
                        />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <span className="text-slate-900 font-black tracking-tight">USD</span>
                            <span className="material-symbols-outlined text-slate-400 text-lg">expand_more</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center -my-4 relative z-10">
                    <div className="bg-white p-1 rounded-full border border-slate-100 shadow-xl">
                        <div className="bg-primary/5 p-3 rounded-full text-primary">
                            <span className="material-symbols-outlined font-black">swap_vert</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">You receive</label>
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">experiment</span> Demo Quote
                        </span>
                    </div>
                    <div className="relative">
                        <input
                            className="w-full bg-slate-100 border-2 border-transparent rounded-[32px] p-8 text-4xl font-black text-slate-400 outline-none pr-32 cursor-default"
                            readOnly
                            type="number"
                            value={cUsdReceived}
                        />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="size-6 rounded-full bg-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-[14px] material-symbols-filled">toll</span>
                            </div>
                            <span className="text-slate-900 font-black tracking-tight">cUSD</span>
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold px-1 flex items-center gap-2 italic">
                        Estimated funding preview: 1 USD ≈ 0.9845 cUSD
                    </p>
                </div>

                {/* Destination */}
                <div className="bg-slate-50 rounded-[24px] p-5 border border-slate-100 flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-primary border border-slate-100 shadow-sm">
                        <span className="material-symbols-outlined text-2xl font-black">account_balance_wallet</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Deposit To</p>
                        <p className="text-xs font-black text-slate-900 truncate">
                            {address || 'Connecting wallet...'}
                        </p>
                    </div>
                </div>
            </main>

            {/* Float Action Button */}
            <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-10">
                <button
                    onClick={handleStartPurchase}
                    disabled={!usdAmount || parseFloat(usdAmount) <= 0}
                    className="w-full bg-primary text-white py-6 rounded-[28px] font-black text-lg shadow-2xl shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">payments</span>
                    Open MiniPay Add Cash
                </button>
                <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Funding continues in MiniPay
                </p>
            </div>
        </div>
    );
}
