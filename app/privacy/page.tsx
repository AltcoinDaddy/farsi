import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] px-6 py-8 text-slate-900">
            <div className="mx-auto max-w-[480px] space-y-6">
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Privacy</p>
                    <h1 className="text-3xl font-black italic tracking-tight">Privacy Policy</h1>
                    <p className="text-sm font-bold leading-relaxed text-slate-500">
                        Farsi is currently a MiniPay-oriented testnet app on Celo Sepolia. This page explains the limited data the app handles during that preview.
                    </p>
                </div>

                <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm space-y-4 text-sm font-bold leading-relaxed text-slate-600">
                    <p>
                        Farsi reads public wallet and transaction data from Celo Sepolia to display balances, receipts, and savings pot activity.
                    </p>
                    <p>
                        If you use Privy-based sign-in outside MiniPay, the authentication provider may process your email or social login according to its own policies.
                    </p>
                    <p>
                        Farsi stores limited local state in your browser, such as onboarding progress, theme preference, and development preview session flags.
                    </p>
                    <p>
                        Because this is a testnet preview, do not treat any balances, savings rates, or social pot activity as private or production-grade financial records.
                    </p>
                </div>

                <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm space-y-3">
                    <h2 className="text-sm font-black text-slate-900">Questions</h2>
                    <p className="text-xs font-bold leading-relaxed text-slate-500">
                        If you need clarification about data handling for this preview, use the in-app support link or open an issue in the project repository.
                    </p>
                    <a
                        href="https://github.com/AltcoinDaddy/farsi/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-2xl bg-slate-900 px-4 py-4 text-center text-[10px] font-black uppercase tracking-[0.18em] text-white"
                    >
                        Contact Support
                    </a>
                </div>

                <Link href="/terms" className="block rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-[10px] font-black uppercase tracking-[0.18em] text-slate-900">
                    View Terms of Use
                </Link>
            </div>
        </div>
    );
}
