import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] px-6 py-8 text-slate-900">
            <div className="mx-auto max-w-[480px] space-y-6">
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Terms</p>
                    <h1 className="text-3xl font-black italic tracking-tight">Terms of Use</h1>
                    <p className="text-sm font-bold leading-relaxed text-slate-500">
                        These terms apply to the current Farsi MiniPay preview running on Celo Sepolia.
                    </p>
                </div>

                <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm space-y-4 text-sm font-bold leading-relaxed text-slate-600">
                    <p>
                        Farsi is a testnet product preview. It is provided for demonstration, evaluation, and development purposes only.
                    </p>
                    <p>
                        Do not rely on Farsi for production financial activity, custody, guaranteed savings performance, or merchant settlement.
                    </p>
                    <p>
                        You are responsible for confirming wallet addresses, transaction amounts, and network details before signing any action.
                    </p>
                    <p>
                        Features may change, pause, or be removed while the MiniPay version is still being prepared for submission and testing.
                    </p>
                </div>

                <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm space-y-3">
                    <h2 className="text-sm font-black text-slate-900">Need help?</h2>
                    <p className="text-xs font-bold leading-relaxed text-slate-500">
                        If anything here is unclear, use the in-app support page before continuing with the preview.
                    </p>
                    <Link href="/support" className="block rounded-2xl bg-primary px-4 py-4 text-center text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-primary/20">
                        Open Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
