'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, User, Wallet } from 'lucide-react';
import { useAccount, useConnect } from 'wagmi';
import { toast } from 'sonner';
import { getPrivyWalletAddress } from '@/lib/active-wallet';
import { openMiniPayAddCash, openMiniPayBrowse, openMiniPayDiscover, useMiniPay } from '@/lib/minipay';

const PREVIEW_SESSION_KEY = 'farsi_preview_session';

function canUseLocalPreview() {
    if (typeof window === 'undefined') return false;
    return process.env.NODE_ENV !== 'production' || window.location.hostname === 'localhost';
}

export default function Onboarding() {
    const { login, ready, authenticated, user } = usePrivy();
    const { address } = useAccount();
    const { connect, connectors, isPending } = useConnect();
    const { isMiniPay, hasEthereumProvider } = useMiniPay();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const activeAddress = address || getPrivyWalletAddress(user);
    const hasIdentitySession = authenticated || !!address;
    const showPreviewFallback = !isMiniPay && !ready && canUseLocalPreview();

    // Sync step with auth state
    useEffect(() => {
        if ((ready || isMiniPay) && hasIdentitySession && step === 1) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setStep(2);
            }, 1000);
        }
    }, [authenticated, hasIdentitySession, isMiniPay, ready, step]);

    const completeOnboarding = () => {
        localStorage.setItem('farsi_onboarded', 'true');
    };

    const handlePreviewApp = () => {
        localStorage.setItem(PREVIEW_SESSION_KEY, 'true');
        completeOnboarding();
        router.push('/');
    };

    const handleWalletContinue = () => {
        const injectedConnector = connectors.find(
            (connector) => connector.type === 'injected'
        );
        if (injectedConnector) {
            connect({ connector: injectedConnector });
        }
    };

    const handleOpenInMiniPay = () => {
        const didOpen = openMiniPayBrowse();

        if (!didOpen) {
            toast.info('MiniPay listing link not ready yet', {
                description: 'Add NEXT_PUBLIC_MINIPAY_APP_URL after you have a public HTTPS app URL to enable this deeplink.',
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="flex-1 flex flex-col p-8 justify-center max-w-[480px] mx-auto w-full">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-12">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-primary' : 'bg-gray-100'}`} />
                    ))}
                </div>

                {(loading || ((!ready && authenticated) || (isMiniPay && isPending))) && (
                    <div className="flex flex-col items-center justify-center space-y-4 py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-neutral-muted font-bold animate-pulse">
                            {isMiniPay ? 'Connecting your wallet...' : 'Securing your account...'}
                        </p>
                    </div>
                )}

                {!loading && step === 1 && (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-primary mb-8 shadow-sm">
                            <Wallet size={32} strokeWidth={2.25} />
                        </div>
                        <h1 className="text-3xl font-bold text-neutral-dark tracking-tight">Welcome to Farsi</h1>
                        <p className="text-neutral-muted font-medium leading-relaxed">
                            {isMiniPay
                                ? 'MiniPay detected. Connect your wallet and start saving together in cUSD.'
                                : ready
                                    ? 'The easiest way to save together on Celo. No seed phrase drama, just open your wallet and go.'
                                    : 'Preparing secure sign-in so you can get into Farsi on Celo.'}
                        </p>
                        <div className="pt-8">
                            {isMiniPay ? (
                                <button
                                    onClick={handleWalletContinue}
                                    disabled={isPending || !hasEthereumProvider}
                                    className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all disabled:opacity-50"
                                >
                                    {isPending ? 'Connecting Wallet...' : 'Continue with MiniPay'}
                                    <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={login}
                                    disabled={!ready}
                                    className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all"
                                >
                                    {ready ? 'Continue with Email / Social' : 'Preparing Sign-In...'}
                                    <ChevronRight size={18} />
                                </button>
                            )}
                            {showPreviewFallback && (
                                <div className="mt-3 space-y-3">
                                    <button
                                        onClick={handlePreviewApp}
                                        className="w-full border border-slate-200 text-neutral-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                                    >
                                        Preview the App
                                        <ChevronRight size={18} />
                                    </button>
                                    <button
                                        onClick={handleOpenInMiniPay}
                                        className="w-full border border-primary/20 text-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
                                    >
                                        Open in MiniPay
                                        <ChevronRight size={18} />
                                    </button>
                                    <button
                                        onClick={openMiniPayDiscover}
                                        className="w-full border border-slate-200 text-neutral-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                                    >
                                        Browse Mini Apps
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                            <p className="text-center text-[10px] text-neutral-muted mt-4">
                                {isMiniPay
                                    ? 'Farsi connects automatically inside MiniPay when an injected wallet is available.'
                                    : ready
                                        ? 'Built for mobile-first stablecoin saving on Celo.'
                                        : showPreviewFallback
                                            ? 'If the local auth client is slow in this browser, you can preview the app directly.'
                                            : 'The sign-in button will unlock as soon as the secure auth client is ready.'}
                            </p>
                        </div>
                    </div>
                )}

                {!loading && (ready || isMiniPay) && step === 2 && (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-success-light rounded-2xl flex items-center justify-center text-success mb-8 shadow-sm">
                            <User size={32} strokeWidth={2.25} />
                        </div>
                        <h1 className="text-3xl font-bold text-neutral-dark tracking-tight">Almost there!</h1>
                        <p className="text-neutral-muted font-medium leading-relaxed">
                            {isMiniPay ? (
                                <>
                                    Connected wallet <span className="text-neutral-dark font-bold">{activeAddress}</span>.
                                    We&apos;ve prepared your wallet for Farsi on Celo.
                                </>
                            ) : (
                                <>
                                    Authenticated as <span className="text-neutral-dark font-bold">{user?.email?.address}</span>.
                                    We&apos;ve prepared your wallet for Farsi on Celo.
                                </>
                            )}
                        </p>
                        <div className="bg-background-light p-4 rounded-xl border border-gray-100">
                            <p className="text-[10px] uppercase font-bold text-neutral-muted mb-1">
                                {isMiniPay ? 'Connected Wallet' : 'Your Smart Account'}
                            </p>
                            <p className="text-xs font-mono text-neutral-dark truncate">{activeAddress}</p>
                        </div>
                        <button onClick={() => setStep(3)} className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-8 shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all">
                            Finalize Profile
                        </button>
                    </div>
                )}

                {!loading && (ready || isMiniPay) && step === 3 && (
                    <div className="space-y-6 text-center">
                        <div className="mx-auto w-20 h-20 bg-success-light rounded-full flex items-center justify-center text-success mb-8 shadow-sm">
                            <ShieldCheck size={36} strokeWidth={2.25} />
                        </div>
                        <h1 className="text-3xl font-bold text-neutral-dark tracking-tight">You&apos;re all set!</h1>
                        <p className="text-neutral-muted font-medium leading-relaxed">Your smart account is secure and ready for your first deposit.</p>
                        <div className="pt-8 space-y-4">
                            <button
                                onClick={() => {
                                    completeOnboarding();
                                    openMiniPayAddCash();
                                }}
                                className="w-full bg-primary text-white font-bold py-4 rounded-xl block text-center shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all"
                            >
                                Add Cash with MiniPay
                            </button>
                            <Link
                                href="/buy"
                                onClick={completeOnboarding}
                                className="w-full border border-primary/20 text-primary font-bold py-4 rounded-xl block text-center hover:bg-primary/5 transition-all"
                            >
                                Funding Walkthrough
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
