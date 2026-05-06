'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPrivyWalletAddress } from '@/lib/active-wallet';

export default function Onboarding() {
    const { login, ready, authenticated, user } = usePrivy();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Sync step with auth state
    useEffect(() => {
        if (ready && authenticated && step === 1) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setStep(2);
            }, 1000);
        }
    }, [ready, authenticated, step]);

    const completeOnboarding = () => {
        localStorage.setItem('farsi_onboarded', 'true');
    };

    if (!ready && !loading) return null;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="flex-1 flex flex-col p-8 justify-center max-w-[480px] mx-auto w-full">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-12">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-gray-100'}`} />
                    ))}
                </div>

                {(loading || (!ready && authenticated)) && (
                    <div className="flex flex-col items-center justify-center space-y-4 py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-neutral-muted font-bold animate-pulse">Securing your account...</p>
                    </div>
                )}

                {!loading && ready && step === 1 && (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-primary mb-8 shadow-sm">
                            <span className="material-symbols-outlined !text-4xl">account_balance_wallet</span>
                        </div>
                        <h1 className="text-3xl font-bold text-neutral-dark tracking-tight">Welcome to Farsi</h1>
                        <p className="text-neutral-muted font-medium leading-relaxed">The easiest way to save and earn on Flow. No complex seed phrases, just sign in and go.</p>
                        <div className="pt-8">
                            <button
                                onClick={login}
                                className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all"
                            >
                                Continue with Email / Social
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                            <p className="text-center text-[10px] text-neutral-muted mt-4">
                                Experience the power of Account Abstraction on Flow.
                            </p>
                        </div>
                    </div>
                )}

                {!loading && ready && step === 2 && (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-success-light rounded-2xl flex items-center justify-center text-success mb-8 shadow-sm">
                            <span className="material-symbols-outlined !text-4xl">person</span>
                        </div>
                        <h1 className="text-3xl font-bold text-neutral-dark tracking-tight">Almost there!</h1>
                        <p className="text-neutral-muted font-medium leading-relaxed">
                            Authenticated as <span className="text-neutral-dark font-bold">{user?.email?.address}</span>.
                            We&apos;ve created a unique smart account for you on Flow EVM.
                        </p>
                        <div className="bg-background-light p-4 rounded-xl border border-gray-100">
                            <p className="text-[10px] uppercase font-bold text-neutral-muted mb-1">Your Smart Account</p>
                            <p className="text-xs font-mono text-neutral-dark truncate">{getPrivyWalletAddress(user)}</p>
                        </div>
                        <button onClick={() => setStep(3)} className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-8 shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all">
                            Finalize Profile
                        </button>
                    </div>
                )}

                {!loading && ready && step === 3 && (
                    <div className="space-y-6 text-center">
                        <div className="mx-auto w-20 h-20 bg-success-light rounded-full flex items-center justify-center text-success mb-8 shadow-sm">
                            <span className="material-symbols-outlined !text-4xl material-symbols-filled">verified_user</span>
                        </div>
                        <h1 className="text-3xl font-bold text-neutral-dark tracking-tight">You&apos;re all set!</h1>
                        <p className="text-neutral-muted font-medium leading-relaxed">Your smart account is secure and ready for your first deposit.</p>
                        <div className="pt-8 space-y-4">
                            <Link
                                href="/buy"
                                onClick={completeOnboarding}
                                className="w-full bg-primary text-white font-bold py-4 rounded-xl block text-center shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all"
                            >
                                Buy First Crypto
                            </Link>
                            <button
                                onClick={() => { completeOnboarding(); router.push('/'); }}
                                className="w-full p-4 font-bold text-neutral-muted hover:text-neutral-dark transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
