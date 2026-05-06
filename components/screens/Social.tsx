'use client';

import React from 'react';
import { useReadContract } from 'wagmi';
import { useSponsoredWriteContract } from '@/lib/useSponsoredTx';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import SharedPotFactoryABI from '@/lib/abi/SharedPotFactory.json';
import SharedPotABI from '@/lib/abi/SharedPot.json';
import CUSDTokenABI from '@/lib/abi/MockUSDC.json';
import { formatUnits, parseUnits } from 'viem';
import { celoSepoliaChain } from '@/lib/web3-config';
import { wagmiConfig } from '@/app/providers';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createReceiptUrl } from '@/lib/receipts';
import { useActiveWalletAddress } from '@/lib/active-wallet';
import { getErrorMessage, validateTokenAmount } from '@/lib/transaction-validation';

import { QRCodeSVG } from 'qrcode.react';

type PotAddress = `0x${string}`;

export default function SocialScreen() {
    const router = useRouter();
    const { address } = useActiveWalletAddress();
    const { writeContractAsync, feeMode } = useSponsoredWriteContract();
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [potName, setPotName] = React.useState('');
    const [potTarget, setPotTarget] = React.useState('500');
    const potTargetValidation = validateTokenAmount(potTarget);

    // Fetch all pots from the factory
    const { data: pots, isLoading, refetch: refetchPots } = useReadContract({
        address: CONTRACT_ADDRESSES.SharedPotFactory as `0x${string}`,
        abi: SharedPotFactoryABI,
        functionName: 'getPots',
    });
    const potAddresses = Array.isArray(pots) ? (pots as PotAddress[]) : [];

    const handleCreatePot = async () => {
        if (!address || !potName || !potTarget) return;
        if (!potTargetValidation.ok) {
            toast.error('Invalid target', {
                description: potTargetValidation.message,
            });
            return;
        }
        setIsUpdating(true);
        const walletAddress = address as `0x${string}`;

        try {
            console.log('Creating new pot:', potName);
            const createHash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.SharedPotFactory as `0x${string}`,
                abi: SharedPotFactoryABI,
                functionName: 'createPot',
                args: [potName, potTargetValidation.amountWei],
                account: walletAddress,
                chain: celoSepoliaChain,
            });
            await waitForTransactionReceipt(wagmiConfig, { hash: createHash });
            await refetchPots();
            setShowModal(false);
            setPotName('');
            toast.success('Social Pot created!', {
                description: `Successfully started "${potName}" with a ${potTarget} cUSD goal.`,
            });
            // Redirect to receipt for creating the pot
            router.push(
                createReceiptUrl(
                    potTarget,
                    'Created Social Pot: ' + potName,
                    createHash,
                    feeMode
                )
            );
        } catch (error) {
            console.error('Create pot failed:', error);
            toast.error('Failed to create pot', {
                description: 'Please ensure you have enough funds and try again.',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-[#F8F9FA] flex flex-col min-h-screen text-slate-900">
            {/* Header */}
            <header className="flex items-center bg-white p-6 sticky top-0 z-10 border-b border-slate-100 justify-between">
                <div>
                    <h1 className="text-xl font-black italic tracking-tight">Social Pots</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Saving Together</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/10 hover:bg-primary/20 transition-all font-black"
                >
                    <span className="material-symbols-outlined">add</span>
                </button>
            </header>

            <div className="mx-6 mt-6 rounded-[28px] border border-amber-200 bg-amber-50 p-4 text-amber-900">
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Demo Sharing</p>
                <p className="mt-1 text-xs font-bold leading-relaxed">
                    Pot creation and contributions are live on testnet. Sharing is still a manual demo flow, so invitees may need the pot address copied below.
                </p>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4 pb-24">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-20 animate-pulse space-y-4">
                            <div className="size-16 bg-slate-100 rounded-[20px]"></div>
                            <div className="space-y-2 flex flex-col items-center">
                                <div className="h-4 w-32 bg-slate-100 rounded"></div>
                                <div className="h-2 w-24 bg-slate-100 rounded"></div>
                            </div>
                        </div>
                    )}

                    {!isLoading && potAddresses.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center space-y-6">
                            <div className="size-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-200">
                                <span className="material-symbols-outlined text-4xl font-black">folder_open</span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-tight">No Active Pots</p>
                                <p className="text-xs text-slate-300 font-bold px-12 leading-relaxed">Start a new collective goal and invite your friends to save with you.</p>
                            </div>
                            <button onClick={() => setShowModal(true)} className="text-primary font-black text-[10px] uppercase tracking-widest border-2 border-primary/20 px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-primary/5 transition-colors">
                                <span className="material-symbols-outlined text-xs">add</span>
                                Create First Pot
                            </button>
                        </div>
                    )}

                    {potAddresses.map((potAddress) => (
                        <PotCard key={potAddress} address={potAddress} />
                    ))}
                </div>
            </main>

            {/* Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                    <div className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight italic leading-none">New Pot</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Define your goal</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Goal Name</label>
                                    <input
                                        type="text"
                                        value={potName}
                                        onChange={(e) => setPotName(e.target.value)}
                                        placeholder="e.g. Summer Trip 2024"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 font-black text-slate-900 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Savings Target (cUSD)</label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            value={potTarget}
                                            onChange={(e) => setPotTarget(e.target.value)}
                                            placeholder="500"
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 font-black text-slate-900 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                                        />
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-sm">cUSD</div>
                                    </div>
                                </div>
                            </div>

                        <button
                            onClick={handleCreatePot}
                            disabled={isUpdating || !potName || !potTargetValidation.ok}
                            className="w-full bg-primary text-white py-6 rounded-[28px] font-black text-lg shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                        >
                                {isUpdating ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">sync</span>
                                        Deploying...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">rocket_launch</span>
                                        Start Goal
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PotCard({ address }: { address: PotAddress }) {
    const router = useRouter();
    const { address: activeAddress } = useActiveWalletAddress();
    const { writeContractAsync, feeMode } = useSponsoredWriteContract();
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [amount, setAmount] = React.useState('10');
    const [showShareModal, setShowShareModal] = React.useState(false);
    const amountValidation = validateTokenAmount(amount);

    // Fetch account allowance for this pot
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: CONTRACT_ADDRESSES.cUSD as `0x${string}`,
        abi: CUSDTokenABI,
        functionName: 'allowance',
        args: activeAddress ? [activeAddress, address] : undefined,
        query: { enabled: !!activeAddress },
    });

    const { data: name } = useReadContract({
        address: address as `0x${string}`,
        abi: SharedPotABI,
        functionName: 'name',
    });

    const { data: target } = useReadContract({
        address: address as `0x${string}`,
        abi: SharedPotABI,
        functionName: 'targetAmount',
    });

    const { data: current, refetch: refetchCurrent } = useReadContract({
        address: address as `0x${string}`,
        abi: SharedPotABI,
        functionName: 'totalContributed',
    });

    const { data: creator } = useReadContract({
        address: address as `0x${string}`,
        abi: SharedPotABI,
        functionName: 'creator',
    });
    const allowanceValue = typeof allowance === 'bigint' ? allowance : 0n;
    const potName = typeof name === 'string' ? name : 'Loading Pot...';
    const creatorAddress = typeof creator === 'string' ? creator : undefined;

    const handleContribute = async () => {
        if (!activeAddress || !amount) return;
        if (!amountValidation.ok) {
            toast.error('Invalid amount', {
                description: amountValidation.message,
            });
            return;
        }
        setIsUpdating(true);
        const walletAddress = activeAddress as `0x${string}`;

        try {
            // Step 1: Check and Approve if needed
            if (allowanceValue < amountValidation.amountWei) {
                console.log('Insufficient allowance for pot, approving...');
                const approveHash = await writeContractAsync({
                    address: CONTRACT_ADDRESSES.cUSD as `0x${string}`,
                    abi: CUSDTokenABI,
                    functionName: 'approve',
                    args: [address, parseUnits('1000', 18)], // Approve $1000 for convenience
                    account: walletAddress,
                    chain: celoSepoliaChain,
                });
                await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });
                await refetchAllowance();
            }

            // Step 2: Contribute
            console.log('Contributing to pot...');
            const contributeHash = await writeContractAsync({
                address: address as `0x${string}`,
                abi: SharedPotABI,
                functionName: 'contribute',
                args: [amountValidation.amountWei],
                account: walletAddress,
                chain: celoSepoliaChain,
            });
            await waitForTransactionReceipt(wagmiConfig, { hash: contributeHash });

            // Final refresh
            await refetchCurrent();
            toast.success('Contribution sent!', {
                description: `Successfully added ${amount} cUSD to the pot.`,
            });
            // Redirect to receipt
            router.push(
                createReceiptUrl(
                    amount,
                    'Pot Contribution: ' + name,
                    contributeHash,
                    feeMode
                )
            );
        } catch (error) {
            console.error('Contribution flow failed:', error);
            toast.error('Contribution failed', {
                description: getErrorMessage(
                    error,
                    'Please check your balance and try again.'
                ),
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleWithdraw = async () => {
        if (!activeAddress) return;
        setIsUpdating(true);
        const walletAddress = activeAddress as `0x${string}`;

        try {
            console.log('Withdrawing from pot...');
            const withdrawHash = await writeContractAsync({
                address: address as `0x${string}`,
                abi: SharedPotABI,
                functionName: 'withdraw',
                account: walletAddress,
                chain: celoSepoliaChain,
            });
            await waitForTransactionReceipt(wagmiConfig, { hash: withdrawHash });
            await refetchCurrent();
            toast.success('Funds claimed!', {
                description: 'The pot savings have been transferred to your wallet.',
            });
            // Redirect to receipt
            router.push(
                createReceiptUrl(
                    formatUnits(currentVal, 18),
                    'Claimed Social Pot: ' + name,
                    withdrawHash,
                    feeMode
                )
            );
        } catch (error) {
            console.error('Withdraw failed:', error);
            toast.error('Claim failed', {
                description: getErrorMessage(
                    error,
                    'You may not have the authority to claim this pot yet.'
                ),
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const targetVal = target ? BigInt(target.toString()) : 0n;
    const currentVal = current ? BigInt(current.toString()) : 0n;
    const progress = targetVal > 0n ? Number((currentVal * 100n) / targetVal) : 0;
    const isCreator =
        !!activeAddress &&
        !!creatorAddress &&
        activeAddress.toLowerCase() === creatorAddress.toLowerCase();

    return (
        <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-orange-400 rounded-[34px] blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
            <div className="relative flex flex-col rounded-[32px] border border-slate-100 bg-white shadow-sm overflow-hidden text-slate-900 transition-all hover:shadow-xl hover:shadow-primary/5">
                <div className="p-8 flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className={`size-16 rounded-[24px] flex items-center justify-center transition-all ${progress >= 100 ? 'bg-success/5 text-success border-success/10' : 'bg-primary/5 text-primary border-primary/10'} border`}>
                                <span className="material-symbols-outlined text-3xl font-black">{progress >= 100 ? 'task_alt' : 'savings'}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight italic">{potName}</h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Goal: ${target ? formatUnits(targetVal, 18) : '0'}
                                    </p>
                                    <span className="size-1 rounded-full bg-slate-200" />
                                    <button 
                                        onClick={() => setShowShareModal(true)}
                                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[12px]">share</span> Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-1">
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saved So Far</p>
                                <span className="text-3xl font-black text-slate-900 italic tracking-tighter">
                                    ${current ? formatUnits(currentVal, 18) : '0.00'}
                                </span>
                            </div>
                            <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${progress >= 100 ? 'bg-success text-white shadow-lg shadow-success/20' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                {progress}% Complete
                            </div>
                        </div>
                        <div className="h-4 w-full rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 p-1">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-inner ${progress >= 100 ? 'bg-success' : 'bg-primary'}`} 
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-4 border-t border-slate-50">
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs italic">$</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-8 pr-4 text-sm font-black text-slate-900 focus:border-primary focus:bg-white outline-none transition-all"
                                />
                            </div>
                            <button
                                onClick={handleContribute}
                                disabled={isUpdating || !activeAddress || !amountValidation.ok}
                                className="flex-[1.5] h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-xl shadow-primary/20"
                            >
                                {isUpdating ? (
                                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                                ) : (
                                    <span className="material-symbols-outlined text-sm">add</span>
                                )}
                                {isUpdating ? 'Saving...' : 'Contribute'}
                            </button>
                        </div>

                        {isCreator && currentVal >= targetVal && (
                            <button
                                onClick={handleWithdraw}
                                disabled={isUpdating}
                                className="h-14 bg-success text-white rounded-2xl font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-xl shadow-success/20"
                            >
                                <span className="material-symbols-outlined">verified</span>
                                Claim Vault Savings
                            </button>
                        )}
                    </div>
                </div>

                {/* Pot Share Modal */}
                {showShareModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                        <div className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                            <div className="p-10 flex flex-col items-center text-center space-y-8">
                                <div className="flex justify-between items-center w-full">
                                    <h2 className="text-xl font-black text-slate-900 italic tracking-tight">Share Goal</h2>
                                    <button onClick={() => setShowShareModal(false)} className="text-slate-300 hover:text-slate-900">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-[32px] border-2 border-slate-100 shadow-inner group">
                                    <QRCodeSVG 
                                        value={address} 
                                        size={200} 
                                        fgColor="#1A1A1A"
                                        includeMargin={true}
                                    />
                                </div>

                                <div className="space-y-4 w-full text-center">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-slate-900 italic">{potName}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 leading-relaxed">
                                            Share this pot address for the current demo flow. Invitees can paste it into Farsi while deep linking is still being finished.
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pot Address</p>
                                        <p className="mt-2 break-all text-[11px] font-mono font-bold text-slate-600">
                                            {address}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(address);
                                            toast.success('Address copied!', { description: 'Share this pot address with contributors.' });
                                        }}
                                        className="w-full bg-slate-100 text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">content_copy</span>
                                        Copy Pot Address
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
