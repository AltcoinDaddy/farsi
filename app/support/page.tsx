import Link from 'next/link';

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] px-6 py-8 text-slate-900">
            <div className="mx-auto max-w-[480px] space-y-6">
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Support</p>
                    <h1 className="text-3xl font-black italic tracking-tight">Farsi Help Center</h1>
                    <p className="text-sm font-bold leading-relaxed text-slate-500">
                        This MiniPay build is currently a Celo Sepolia testnet preview. Use the links below if you need help, want to report an issue, or need product context for a demo.
                    </p>
                </div>

                <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                    <div>
                        <h2 className="text-sm font-black text-slate-900">Primary support</h2>
                        <p className="mt-1 text-xs font-bold leading-relaxed text-slate-500">
                            Use the project issue tracker for bugs, broken flows, and feedback about the MiniPay experience.
                        </p>
                    </div>
                    <a
                        href="https://github.com/AltcoinDaddy/farsi/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full rounded-2xl bg-primary px-4 py-4 text-center text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-primary/20"
                    >
                        Open Support Channel
                    </a>
                </div>

                <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm space-y-3">
                    <h2 className="text-sm font-black text-slate-900">What to include in a report</h2>
                    <ul className="space-y-2 text-xs font-bold leading-relaxed text-slate-500">
                        <li>The screen or flow that failed</li>
                        <li>The wallet or MiniPay state you were using</li>
                        <li>The transaction hash if one was created</li>
                        <li>A screenshot or short description of the error</li>
                    </ul>
                </div>

                <div className="flex gap-3">
                    <Link href="/privacy" className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-[10px] font-black uppercase tracking-[0.18em] text-slate-900">
                        Privacy
                    </Link>
                    <Link href="/terms" className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-[10px] font-black uppercase tracking-[0.18em] text-slate-900">
                        Terms
                    </Link>
                </div>
            </div>
        </div>
    );
}
