'use client';

import React from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import SharedPotFactoryABI from '@/lib/abi/SharedPotFactory.json';
import SharedPotABI from '@/lib/abi/SharedPot.json';
import MockUSDCABI from '@/lib/abi/MockUSDC.json';
import { formatUnits, parseUnits } from 'viem';
import { flowEVMTestnet, config } from '@/lib/web3-config';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { usePrivy } from '@/lib/mock-privy';

export default function SocialScreen() {
    const { user } = usePrivy();
    const { writeContractAsync } = useWriteContract();
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [potName, setPotName] = React.useState('');
    const [potTarget, setPotTarget] = React.useState('500');

    // Fetch all pots from the factory
    const { data: pots, isLoading, refetch: refetchPots } = useReadContract({
        address: CONTRACT_ADDRESSES.SharedPotFactory as `0x${string}`,
        abi: SharedPotFactoryABI,
        functionName: 'getPots',
    });

    const handleCreatePot = async () => {
        if (!user?.wallet?.address || !potName || !potTarget) return;
        setIsUpdating(true);
        const walletAddress = user.wallet.address as `0x${string}`;

        try {
            console.log('Creating new pot:', potName);
            const createHash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.SharedPotFactory as `0x${string}`,
                abi: SharedPotFactoryABI,
                functionName: 'createPot',
                args: [potName, parseUnits(potTarget, 18)],
                account: walletAddress,
                chain: flowEVMTestnet,
            });
            await waitForTransactionReceipt(config, { hash: createHash });
            await refetchPots();
            setShowModal(false);
            setPotName('');
            console.log('Pot created!');
        } catch (error) {
            console.error('Create pot failed:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white flex flex-col min-h-screen">
            {/* Header */}
            <header className="flex items-center bg-white p-4 sticky top-0 z-10 border-b border-slate-100 justify-between">
                <h1 className="text-neutral-dark text-xl font-bold">Social Pots</h1>
                <div className="flex items-center justify-end">
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                    <h2 className="text-neutral-dark text-lg font-bold leading-tight">Active Pots</h2>
                    <p className="text-neutral-muted text-sm mb-4">Saving together with friends</p>

                    <div className="space-y-4 pb-24">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                                <div className="w-12 h-12 bg-slate-100 rounded-full mb-4"></div>
                                <div className="h-4 w-32 bg-slate-100 rounded mb-2"></div>
                                <div className="h-3 w-24 bg-slate-100 rounded"></div>
                            </div>
                        )}

                        {!isLoading && (!pots || (pots as any[]).length === 0) && (
                            <div className="text-center py-20 bg-background-light rounded-2xl border border-dashed border-gray-200">
                                <span className="material-symbols-outlined text-4xl text-neutral-muted mb-2">folder_open</span>
                                <p className="text-sm text-neutral-muted font-bold">No active pots yet</p>
                                <p className="text-xs text-neutral-muted mt-1 px-10">Start a new pot to save for a goal with your friends!</p>
                            </div>
                        )}

                        {pots &&
                            (pots as any[]).map((potAddress: string) => (
                                <PotCard key={potAddress} address={potAddress} />
                            ))}
                    </div>
                </div>
            </main>

            {/* Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black text-slate-900tracking-tight">New Pot</h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Pot Name</label>
                                    <input
                                        type="text"
                                        value={potName}
                                        onChange={(e) => setPotName(e.target.value)}
                                        placeholder="e.g. Summer Trip 2024"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Savings Target (mUSDC)</label>
                                    <input
                                        type="number"
                                        value={potTarget}
                                        onChange={(e) => setPotTarget(e.target.value)}
                                        placeholder="500"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:border-primary outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreatePot}
                                disabled={isUpdating || !potName || !potTarget}
                                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95"
                            >
                                {isUpdating ? 'Creating...' : 'Start Pot'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PotCard({ address }: { address: string }) {
    const { user } = usePrivy();
    const { writeContractAsync } = useWriteContract();
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [amount, setAmount] = React.useState('10');

    // Fetch account allowance for this pot
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
        abi: MockUSDCABI,
        functionName: 'allowance',
        args: [user?.wallet?.address, address],
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

    const handleContribute = async () => {
        if (!user?.wallet?.address || !amount) return;
        setIsUpdating(true);
        const walletAddress = user.wallet.address as `0x${string}`;
        const contributeAmount = parseUnits(amount, 18);

        try {
            // Step 1: Check and Approve if needed
            const currentAllowance = (allowance as bigint) || 0n;
            if (currentAllowance < contributeAmount) {
                console.log('Insufficient allowance for pot, approving...');
                const approveHash = await writeContractAsync({
                    address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
                    abi: MockUSDCABI,
                    functionName: 'approve',
                    args: [address, parseUnits('1000', 18)], // Approve $1000 for convenience
                    account: walletAddress,
                    chain: flowEVMTestnet,
                });
                await waitForTransactionReceipt(config, { hash: approveHash });
                await refetchAllowance();
            }

            // Step 2: Contribute
            console.log('Contributing to pot...');
            const contributeHash = await writeContractAsync({
                address: address as `0x${string}`,
                abi: SharedPotABI,
                functionName: 'contribute',
                args: [contributeAmount],
                account: walletAddress,
                chain: flowEVMTestnet,
            });
            await waitForTransactionReceipt(config, { hash: contributeHash });

            // Final refresh
            await refetchCurrent();
            console.log('Contribution successful!');
        } catch (error) {
            console.error('Contribution flow failed:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleWithdraw = async () => {
        if (!user?.wallet?.address) return;
        setIsUpdating(true);
        const walletAddress = user.wallet.address as `0x${string}`;

        try {
            console.log('Withdrawing from pot...');
            const withdrawHash = await writeContractAsync({
                address: address as `0x${string}`,
                abi: SharedPotABI,
                functionName: 'withdraw',
                account: walletAddress,
                chain: flowEVMTestnet,
            });
            await waitForTransactionReceipt(config, { hash: withdrawHash });
            await refetchCurrent();
            console.log('Withdrawal successful!');
        } catch (error) {
            console.error('Withdraw failed:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const targetVal = target ? BigInt(target.toString()) : 0n;
    const currentVal = current ? BigInt(current.toString()) : 0n;
    const progress = targetVal > 0n ? Number((currentVal * 100n) / targetVal) : 0;
    const isCreator = user?.wallet?.address && creator && user.wallet.address.toLowerCase() === (creator as string).toLowerCase();

    return (
        <div className="flex flex-col rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden text-neutral-dark">
            <div className="p-6 flex flex-col gap-5">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/5">
                            <span className="material-symbols-outlined text-3xl">savings</span>
                        </div>
                        <div>
                            <h3 className="text-slate-900 text-lg font-black tracking-tight">{(name as string) || 'Loading Pot...'}</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Target: ${target ? formatUnits(targetVal, 18) : '0'}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-black text-slate-900">${current ? formatUnits(currentVal, 18) : '0.00'}</span>
                        <div className="bg-success/10 text-success text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                            {progress}% Goal
                        </div>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-50 overflow-hidden border border-slate-100">
                        <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-24 bg-slate-50 border border-slate-100 rounded-xl px-3 text-sm font-bold text-slate-900 focus:border-primary outline-none"
                        />
                        <button
                            onClick={handleContribute}
                            disabled={isUpdating}
                            className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-lg shadow-primary/10"
                        >
                            <span className="material-symbols-outlined text-sm">{isUpdating ? 'sync' : 'add'}</span>
                            {isUpdating ? 'Wait...' : 'Contribute'}
                        </button>
                    </div>

                    {isCreator && currentVal >= targetVal && (
                        <button
                            onClick={handleWithdraw}
                            disabled={isUpdating}
                            className="h-12 bg-success text-white rounded-xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-lg shadow-success/10"
                        >
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            Claim Savings
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
