'use client';

import { useRouter } from 'next/navigation';
import { usePrivy } from '@/lib/mock-privy';

export default function BuyScreen() {
    const router = useRouter();
    const { user } = usePrivy();

    return (
        <div className="bg-white flex flex-col min-h-full">
            {/* Header */}
            <div className="flex items-center bg-white p-4 pb-2 justify-between border-b border-slate-100">
                <button onClick={() => router.back()} className="text-neutral-dark flex size-10 shrink-0 items-center justify-center cursor-pointer">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-neutral-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Buy Crypto</h2>
            </div>

            {/* Progress Steps */}
            <div className="flex w-full flex-row items-center justify-center gap-8 py-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">1</div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Amount</span>
                </div>
                <div className="h-px w-12 bg-slate-200 mt-[-18px]"></div>
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 text-sm font-bold">2</div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Payment</span>
                </div>
                <div className="h-px w-12 bg-slate-200 mt-[-18px]"></div>
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 text-sm font-bold">3</div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Confirm</span>
                </div>
            </div>

            {/* Input Section */}
            <div className="px-4 py-2 space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-neutral-muted text-sm font-medium">You pay</label>
                    <div className="flex w-full items-stretch rounded-xl border border-slate-200 bg-background-light focus-within:border-primary transition-colors">
                        <input className="flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 p-4 text-xl font-semibold text-neutral-dark" placeholder="0.00" type="number" defaultValue="100" />
                        <div className="flex items-center gap-2 px-4 border-l border-slate-200">
                            <span className="text-neutral-dark font-bold">USD</span>
                            <span className="material-symbols-outlined text-slate-400 text-sm">keyboard_arrow_down</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-white p-1 rounded-full border border-slate-100 shadow-sm">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <span className="material-symbols-outlined text-primary text-xl">swap_vert</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-neutral-muted text-sm font-medium">You receive (Estimated)</label>
                    <div className="flex w-full items-stretch rounded-xl border border-slate-200 bg-background-light focus-within:border-primary transition-colors">
                        <input className="flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 p-4 text-xl font-semibold text-neutral-dark" readOnly type="number" defaultValue="98.45" />
                        <div className="flex items-center gap-2 px-4 border-l border-slate-200">
                            <div className="size-6 rounded-full bg-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-[16px]">toll</span>
                            </div>
                            <span className="text-neutral-dark font-bold">USDC</span>
                            <span className="material-symbols-outlined text-slate-400 text-sm">keyboard_arrow_down</span>
                        </div>
                    </div>
                    <p className="text-[11px] text-neutral-muted flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">info</span>
                        1 USD ≈ 0.9845 USDC. Includes 1.5% fee.
                    </p>
                </div>

                {/* Destination Info */}
                <div className="bg-background-light rounded-xl p-3 border border-slate-100 flex items-center gap-3">
                    <div className="size-8 rounded-full bg-white flex items-center justify-center text-primary border border-gray-100">
                        <span className="material-symbols-outlined text-sm">wallet</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-neutral-muted uppercase font-bold tracking-widest">Destination Address</p>
                        <p className="text-xs font-mono text-neutral-dark truncate">{user?.wallet?.address}</p>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="px-4 py-6">
                <h3 className="text-neutral-dark text-base font-bold mb-4">Payment Method</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-3xl">credit_card</span>
                            </div>
                            <div>
                                <p className="text-neutral-dark font-semibold">Credit/Debit Card</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <img className="h-3 object-contain" alt="Visa Logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArYt3k6r6VPEkKbcMnAdoDD30sedp-X-aKlZGRkKPigP5hOGQ8lXfNXq51zBcDrZxcUY3NwUJ4Nvn8gXieNrnD0hj2dfA3cF5SksB1l7XaSVisgDD7GOZe878lA0JjjlIjnrrmGaPQUhxQNZikcNHZ8yoUxW6-ipEE_MPWV9_krUJVs3HgMzz109dwabOybqPm6x8rapG8VTTvQaum2pFBhfBB7vqTmwmtoJ5V3XnL_WNXMYCg5DtN423cv1ra65WDe3rVHmkux8c" />
                                    <img className="h-4 object-contain" alt="Mastercard Logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmc2aQzsfX67OWseIrVSqGtnqg2o0PpqAlXivHdgd9GTokMsKU0pvjZrI9-hFW21T1QNUv9gOaVzZihHOd7BfIPrVA1qa56GKzM9X-1QMTTv12xws0JuBc8hIgh81xPRHxSs7c1u5dFKf45CcXxOlUoypYJMmdT2Zwk4MpnVi46UAllFyNJ9KKnrvcrz7c__Ujenqk8T0VfmJHCpb9PRB6yiWSOmQqCqJgNdujvvDPtYtRR886Rpa0TC6kxHOOEYWPF1sLchkEOKU" />
                                </div>
                            </div>
                        </div>
                        <div className="size-5 rounded-full border-4 border-primary bg-white"></div>
                    </div>
                </div>
            </div>

            {/* Provider Branding */}
            <div className="mt-auto px-4 py-8 flex flex-col items-center gap-6 pb-24">
                <div className="flex items-center gap-2 opacity-60">
                    <span className="text-[10px] font-medium uppercase tracking-widest text-neutral-muted">Powered by</span>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                        <span className="text-xs font-bold text-neutral-dark">Ramp</span>
                    </div>
                </div>
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20">
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
}
