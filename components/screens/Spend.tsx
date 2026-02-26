'use client';

import React from 'react';
import { ChevronLeft, CreditCard, ShoppingBag, Wifi, Car, Coffee, MoreHorizontal, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import MockUSDCABI from '@/lib/abi/MockUSDC.json';
import { flowEVMTestnet, config } from '@/lib/web3-config';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useRouter } from 'next/navigation';

export default function SpendScreen() {
    const router = useRouter();
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const [isUpdating, setIsUpdating] = React.useState(false);

    // Fetch mUSDC balance
    const { data: usdcBalance, refetch: refetchUSDC } = useReadContract({
        address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
        abi: MockUSDCABI,
        functionName: 'balanceOf',
        args: [address],
    });

    const handleBuyGiftCard = async (category: string, amountStr: string) => {
        if (!address) return;
        setIsUpdating(true);
        const amount = amountStr.replace('$', '').replace(',', '');
        const amountWei = parseUnits(amount, 18);

        try {
            console.log(`Purchasing ${category} for ${amount} mUSDC...`);
            // Simulate purchase by sending to a treasury address (null for demo)
            const buyHash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
                abi: MockUSDCABI,
                functionName: 'transfer',
                args: ['0x0000000000000000000000000000000000000000', amountWei],
                account: address as `0x${string}`,
                chain: flowEVMTestnet,
            });
            await waitForTransactionReceipt(config, { hash: buyHash });
            await refetchUSDC();

            // Redirect to receipt
            router.push(`/receipt?amount=${amount}&type=${encodeURIComponent(category + ' Gift Card')}`);
        } catch (error) {
            console.error('Purchase failed:', error);
            alert('Purchase failed. Please check your balance.');
        } finally {
            setIsUpdating(false);
        }
    };

    const formattedUSDC = usdcBalance ? parseFloat(formatUnits(usdcBalance as bigint, 18)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-slate-900">
            {/* Header */}
            <header className="bg-white px-4 py-4 flex items-center border-b border-slate-100 sticky top-0 z-10">
                <Link href="/" className="text-slate-600">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="flex-1 text-center text-lg font-black pr-6">Spend</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Balance Indicator */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Balance</p>
                            <p className="text-sm font-black text-slate-900">{formattedUSDC} mUSDC</p>
                        </div>
                    </div>
                    {isUpdating && <div className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
                </div>

                {/* Premium Card Visual */}
                <div className="relative h-56 w-full rounded-[32px] bg-[#1A1A1A] p-8 text-white shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wifi size={80} className="rotate-90" />
                    </div>
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Virtual Debit</span>
                            <h2 className="text-xl font-black italic tracking-tighter">FARSI</h2>
                        </div>
                        <div className="w-12 h-9 bg-gradient-to-br from-amber-200 to-amber-500 rounded-lg opacity-80" />
                    </div>

                    <div className="mt-auto">
                        <p className="text-2xl font-black tracking-[0.25em] mb-4">•••• •••• •••• 1280</p>
                        <div className="flex justify-between items-end">
                            <div className="space-y-0.5">
                                <p className="text-[8px] font-black uppercase opacity-40">Card Holder</p>
                                <p className="text-xs font-bold uppercase tracking-widest">
                                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Demo Account'}
                                </p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-[8px] font-black uppercase opacity-40">Brand</p>
                                <div className="flex -space-x-2">
                                    <div className="w-4 h-4 rounded-full bg-red-500 opacity-80" />
                                    <div className="w-4 h-4 rounded-full bg-amber-500 opacity-80" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Spend Categories</h3>
                    <div className="grid grid-cols-2 gap-4 pb-20">
                        {[
                            { name: 'Shopping', icon: ShoppingBag, color: '#E6F0FA', iconColor: '#4A90E2', amount: '45.00' },
                            { name: 'Travel', icon: Car, color: '#D4F4E2', iconColor: '#27AE60', amount: '120.00' },
                            { name: 'Lifestyle', icon: Coffee, color: '#FEF3C7', iconColor: '#B45309', amount: '15.50' },
                        ].map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => handleBuyGiftCard(cat.name, cat.amount)}
                                disabled={isUpdating}
                                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col gap-4 text-left hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all active:scale-95 disabled:opacity-50 group"
                            >
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: cat.color, color: cat.iconColor }}>
                                    <cat.icon size={24} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.name}</p>
                                    <p className="text-lg font-black text-slate-900">${cat.amount}</p>
                                    <p className="text-[9px] font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                        Buy Now <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
