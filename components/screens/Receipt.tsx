'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface ReceiptProps {
    withShare?: boolean;
}

function ReceiptContent({ withShare }: ReceiptProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const amount = searchParams.get('amount') || '0.00';
    const type = searchParams.get('type') || 'Transaction';
    const date = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="bg-white text-neutral-dark min-h-full flex flex-col items-center justify-center p-4">
            <div className="w-full bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-10 duration-500">
                <div className="flex items-center px-6 py-4 border-b border-gray-100 justify-between">
                    <button onClick={() => router.back()} className="text-neutral-muted hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <h2 className="text-lg font-bold tracking-tight text-neutral-dark">Receipt</h2>
                    <div className="w-6"></div>
                </div>

                <div className="flex flex-col items-center px-6 py-8 text-center">
                    <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-success/10 scale-in-center">
                        <span className="material-symbols-outlined text-success !text-5xl material-symbols-filled">check_circle</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-success font-black text-xl uppercase tracking-wider">Success</p>
                        <p className="text-neutral-muted text-sm font-medium">Confirmed on Flow EVM</p>
                    </div>
                    <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 italic">
                        {amount} USDC
                    </h1>
                </div>

                <div className="px-6 py-4 space-y-1">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2">Details</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-1">
                            <span className="text-slate-500 text-sm font-medium">Type</span>
                            <span className="text-slate-900 font-bold text-sm">{type}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-slate-500 text-sm font-medium">Status</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-success"></span>
                                <span className="text-slate-900 font-bold text-sm">Completed</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-slate-500 text-sm font-medium">Date</span>
                            <span className="text-slate-900 font-bold text-sm">{date}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-slate-500 text-sm font-medium">Network Fee</span>
                            <span className="text-success font-bold text-sm">Sponsored</span>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-8 pt-6 border-t border-gray-100 space-y-3">
                    {searchParams.get('hash') && (
                        <a
                            href={`https://evm-testnet.flowscan.io/tx/${searchParams.get('hash')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-5 bg-white border-2 border-slate-100 text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined !text-xl">open_in_new</span>
                            View on Flowscan
                        </a>
                    )}
                    <button onClick={() => router.push('/')} className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all">
                        Done
                    </button>
                    {!withShare && (
                        <button className="w-full py-5 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-2xl hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined !text-xl">share</span>
                            Share Receipt
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ReceiptScreen({ withShare }: ReceiptProps) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Receipt...</div>}>
            <ReceiptContent withShare={withShare} />
        </Suspense>
    );
}
