'use client';

import { useRouter } from 'next/navigation';

export default function ReceiptScreen() {
    const router = useRouter();

    return (
        <div className="bg-white text-neutral-dark min-h-full flex flex-col items-center justify-center p-4">
            {/* Transaction Receipt Container */}
            <div className="w-full bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="flex items-center px-6 py-4 border-b border-gray-100 justify-between">
                    <button onClick={() => router.back()} className="text-neutral-muted hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <h2 className="text-lg font-bold tracking-tight text-neutral-dark">Transaction Receipt</h2>
                    <div className="w-6"></div>
                </div>

                {/* Success Animation/Icon Area */}
                <div className="flex flex-col items-center px-6 py-8 text-center">
                    <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-success/10">
                        <span className="material-symbols-outlined text-success !text-5xl material-symbols-filled">check_circle</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-success font-bold text-xl uppercase tracking-wider">Success</p>
                        <p className="text-neutral-muted text-sm">Your transaction was confirmed on Flow</p>
                    </div>
                    <h1 className="mt-6 text-4xl font-bold tracking-tight text-neutral-dark">
                        +100.00 USDC
                    </h1>
                </div>

                {/* Transaction Details */}
                <div className="px-6 py-4 space-y-1">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest pb-2">Transaction Details</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-1">
                            <span className="text-neutral-muted text-sm">Transaction Type</span>
                            <span className="text-neutral-dark font-medium text-sm">Bought USDC</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-neutral-muted text-sm">Status</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-success"></span>
                                <span className="text-neutral-dark font-medium text-sm">Confirmed</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-neutral-muted text-sm">Date & Time</span>
                            <span className="text-neutral-dark font-medium text-sm">Oct 24, 2023, 14:20</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-neutral-muted text-sm">Network Fee</span>
                            <span className="text-neutral-dark font-medium text-sm">$0.00</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 pb-8 pt-6 border-t border-gray-100">
                    <button onClick={() => router.push('/')} className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                        Done
                    </button>
                    <button className="w-full mt-3 py-4 bg-transparent border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined !text-xl">share</span>
                        Share Receipt
                    </button>
                </div>
            </div>
        </div>
    );
}
