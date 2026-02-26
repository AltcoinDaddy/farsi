'use client';

import React from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
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

    // Fetch all pots from the factory
    const { data: pots, isLoading, refetch: refetchPots } = useReadContract({
        address: CONTRACT_ADDRESSES.SharedPotFactory as `0x${string}`,
        abi: SharedPotFactoryABI,
        functionName: 'getPots',
    });

    const handleCreatePot = async () => {
        if (!user?.wallet?.address) return;
        setIsUpdating(true);
        const walletAddress = user.wallet.address as `0x${string}`;

        try {
            console.log('Creating new pot...');
            const createHash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.SharedPotFactory as `0x${string}`,
                abi: SharedPotFactoryABI,
                functionName: 'createPot',
                args: ['New Savings Pot', parseUnits('100', 18)], // Default values for demo
                account: walletAddress,
                chain: flowEVMTestnet,
            });
            await waitForTransactionReceipt(config, { hash: createHash });
            await refetchPots();
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
                        onClick={handleCreatePot}
                        disabled={isUpdating}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">{isUpdating ? 'sync' : 'add'}</span>
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

                {/* Quick Actions / Suggestions */}
                <div className="mt-4">
                    <h3 className="text-neutral-dark text-base font-bold mb-3">Popular with Friends</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        <div className="min-w-[140px] p-3 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">celebration</span>
                            </div>
                            <span className="text-xs font-bold text-center text-neutral-dark">Birthday Gift</span>
                        </div>
                        <div className="min-w-[140px] p-3 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">directions_car</span>
                            </div>
                            <span className="text-xs font-bold text-center text-neutral-dark">Road Trip</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function PotCard({ address }: { address: string }) {
    const { user } = usePrivy();
    const { writeContractAsync } = useWriteContract();
    const [isUpdating, setIsUpdating] = React.useState(false);

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
        if (!user?.wallet?.address) return;
        setIsUpdating(true);
        const walletAddress = user.wallet.address as `0x${string}`;
        const contributeAmount = parseUnits('10', 18); // Default $10 contribution

        try {
            // Step 1: Check and Approve if needed
            const currentAllowance = (allowance as bigint) || 0n;
            if (currentAllowance < contributeAmount) {
                console.log('Insufficient allowance for pot, approving...');
                const approveHash = await writeContractAsync({
                    address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
                    abi: MockUSDCABI,
                    functionName: 'approve',
                    args: [address, parseUnits('100', 18)], // Approve $100 for convenience
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
        <div className="flex flex-col rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden text-neutral-dark">
            <div className="p-4 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                        <div className="h-12 w-12 rounded-lg bg-background-light flex items-center justify-center text-primary border border-gray-100">
                            <span className="material-symbols-outlined text-2xl">savings</span>
                        </div>
                        <div>
                            <h3 className="text-neutral-dark text-base font-bold">{(name as string) || 'Loading Pot...'}</h3>
                            <p className="text-neutral-muted text-xs">Target: ${target ? formatUnits(targetVal, 18) : '0'}</p>
                        </div>
                    </div>
                    <div className="bg-success-light text-success text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                        {progress}% Saved
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end text-sm text-neutral-dark">
                        <span className="font-bold">${current ? formatUnits(currentVal, 18) : '0.00'}</span>
                        <span className="text-neutral-muted text-[10px] uppercase font-bold tracking-tighter">Current Funding</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="flex gap-2 mt-1">
                    <button
                        onClick={handleContribute}
                        disabled={isUpdating}
                        className="flex-1 h-11 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-sm">{isUpdating ? 'sync' : 'payments'}</span>
                        {isUpdating ? 'Contributing...' : 'Contribute'}
                    </button>
                    {isCreator && (
                        <button
                            onClick={handleWithdraw}
                            disabled={isUpdating || currentVal < targetVal}
                            className="flex-1 h-11 bg-neutral-light hover:bg-neutral-light/80 text-neutral-dark rounded-lg font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                            Withdraw
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
