'use client';

import React from 'react';
import { ChevronLeft, ShoppingBag, Wifi, Car, Coffee, MoreHorizontal, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useReadContract } from 'wagmi';
import { useSponsoredWriteContract } from '@/lib/useSponsoredTx';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import MockUSDCABI from '@/lib/abi/MockUSDC.json';
import { flowEVMTestnet } from '@/lib/web3-config';
import { wagmiConfig } from '@/app/providers';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createReceiptUrl } from '@/lib/receipts';
import { useActiveWalletAddress } from '@/lib/active-wallet';

import YieldVaultABI from '@/lib/abi/YieldVault.json';

export default function SpendScreen() {
    const router = useRouter();
    const { address } = useActiveWalletAddress();
    const { writeContractAsync, feeMode } = useSponsoredWriteContract();
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [autoSave, setAutoSave] = React.useState(true);

    // Fetch mUSDC balance
    const { data: usdcBalance, refetch: refetchUSDC } = useReadContract({
        address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
        abi: MockUSDCABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    // Fetch allowance for Vault
    const { data: vaultAllowance } = useReadContract({
        address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
        abi: MockUSDCABI,
        functionName: 'allowance',
        args: address ? [address, CONTRACT_ADDRESSES.YieldVault] : undefined,
        query: { enabled: !!address },
    });

    const { data: merchantWallet } = useReadContract({
        address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
        abi: MockUSDCABI,
        functionName: 'owner',
        query: { enabled: !!address },
    });

    const handleBuyGiftCard = async (category: string, amountStr: string) => {
        const merchantAddress = merchantWallet as `0x${string}` | undefined;
        if (!address) return;
        if (!merchantAddress) {
            toast.error('Merchant unavailable', {
                description: 'The demo merchant wallet is still loading. Please try again in a moment.',
            });
            return;
        }
        setIsUpdating(true);
        const amount = parseFloat(amountStr.replace('$', '').replace(',', ''));
        const amountWei = parseUnits(amount.toString(), 18);

        try {
            // 1. Primary Purchase Transaction
            console.log(`Purchasing ${category} for ${amount} mUSDC...`);
            const buyHash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
                abi: MockUSDCABI,
                functionName: 'transfer',
                args: [merchantAddress, amountWei],
                account: address as `0x${string}`,
                chain: flowEVMTestnet,
            });
            await waitForTransactionReceipt(wagmiConfig, { hash: buyHash });

            // 2. Optional Auto-Save Round Up
            let changeAmount = 0;
            if (autoSave) {
                const roundedAmount = Math.ceil(amount);
                changeAmount = roundedAmount - amount;

                if (changeAmount > 0) {
                    const changeWei = parseUnits(changeAmount.toFixed(18), 18);
                    
                    // Check allowance
                    if ((vaultAllowance as bigint || 0n) < changeWei) {
                        const appHash = await writeContractAsync({
                            address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
                            abi: MockUSDCABI,
                            functionName: 'approve',
                            args: [CONTRACT_ADDRESSES.YieldVault as `0x${string}`, parseUnits('1000000', 18)],
                            account: address as `0x${string}`,
                            chain: flowEVMTestnet,
                        });
                        await waitForTransactionReceipt(wagmiConfig, { hash: appHash });
                    }

                    // Deposit to Vault
                    const depositHash = await writeContractAsync({
                        address: CONTRACT_ADDRESSES.YieldVault as `0x${string}`,
                        abi: YieldVaultABI,
                        functionName: 'deposit',
                        args: [changeWei, address],
                        account: address as `0x${string}`,
                        chain: flowEVMTestnet,
                    });
                    await waitForTransactionReceipt(wagmiConfig, { hash: depositHash });
                    
                    toast.success('Round-up Auto-Saved!', {
                        description: `Saved $${changeAmount.toFixed(2)} to your Yield Vault.`,
                        icon: <span className="material-symbols-outlined text-success">auto_awesome</span>
                    });
                }
            }

            await refetchUSDC();
            toast.success('Purchase successful!', {
                description: `Your ${category} gift card is ready.`,
            });

            // Redirect to receipt
            router.push(
                createReceiptUrl(
                    amount.toString(),
                    `${category} Gift Card`,
                    buyHash,
                    feeMode,
                    changeAmount > 0 ? { saved: changeAmount.toFixed(2) } : undefined
                )
            );
        } catch (error) {
            console.error('Spend flow failed:', error);
            toast.error('Transaction failed', {
                description: 'Please check your balance and try again.',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const usdcBalanceValue = typeof usdcBalance === 'bigint' ? usdcBalance : 0n;
    const merchantAddress = typeof merchantWallet === 'string' ? merchantWallet : undefined;
    const formattedUSDC = parseFloat(formatUnits(usdcBalanceValue, 18)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const merchantSummary = merchantAddress
        ? `${merchantAddress.slice(0, 6)}...${merchantAddress.slice(-4)}`
        : 'Loading merchant wallet...';

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-slate-900">
            {/* Header */}
            <header className="bg-white px-6 py-6 flex items-center border-b border-slate-100 sticky top-0 z-10 transition-shadow">
                <Link href="/" className="text-slate-400 hover:text-slate-900 transition-colors">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="flex-1 text-center text-xl font-black italic tracking-tight pr-6">Spend</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Balance Indicator */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 flex items-center justify-between shadow-sm group">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-110 transition-transform">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Available Funds</p>
                            <p className="text-lg font-black text-slate-900 italic">{formattedUSDC} <span className="text-[10px] uppercase opacity-40 not-italic">mUSDC</span></p>
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                        Demo purchases settle to the configured merchant wallet on Flow EVM: <span className="font-black text-slate-900">{merchantSummary}</span>
                    </p>
                </div>

                {/* Premium Card Visual */}
                <div className="relative h-60 w-full rounded-[40px] bg-slate-900 p-10 text-white shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <Wifi size={100} className="rotate-90" />
                    </div>
                    <div className="absolute -bottom-12 -left-12 size-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
                    
                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Quantum Pay</span>
                            <h2 className="text-2xl font-black italic tracking-tighter">FARSI</h2>
                        </div>
                        <div className="w-14 h-10 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 rounded-xl opacity-90 shadow-lg" />
                    </div>

                    <div className="mt-auto relative z-10 pt-12">
                        <p className="text-2xl font-black tracking-[0.25em] mb-6 font-mono text-slate-100">•••• •••• •••• 1280</p>
                        <div className="flex justify-between items-end">
                            <div className="space-y-0.5">
                                <p className="text-[8px] font-black uppercase opacity-40 tracking-widest">Card Holder</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-300">
                                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Smart Account'}
                                </p>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-red-600/80 backdrop-blur-sm" />
                                    <div className="w-6 h-6 rounded-full bg-amber-500/80 backdrop-blur-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auto-Save Toggle */}
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`size-12 rounded-2xl flex items-center justify-center transition-all ${autoSave ? 'bg-success/10 text-success border-success/10' : 'bg-slate-50 text-slate-300 border-slate-100'} border`}>
                                <span className="material-symbols-outlined text-2xl font-black">auto_awesome</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 italic">Keep the Change</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Round up to next $1.00</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setAutoSave(!autoSave)}
                            className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${autoSave ? 'bg-primary' : 'bg-slate-200 shadow-inner'}`}
                        >
                            <div className={`size-6 bg-white rounded-full shadow-md transition-transform duration-300 ${autoSave ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    {autoSave && (
                        <div className="bg-success/5 rounded-2xl p-4 flex items-center gap-3 border border-success/10 animate-in slide-in-from-top-2 duration-300">
                            <span className="material-symbols-outlined text-success text-sm">info</span>
                            <p className="text-[9px] font-black text-success uppercase tracking-widest leading-relaxed">
                                Change is auto-deposited into your <span className="underline italic">Yield Vault</span> at 4.2% APY.
                            </p>
                        </div>
                    )}
                </div>

                {/* Categories */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Spend Categories</h3>
                    <div className="grid grid-cols-2 gap-6 pb-24">
                        {[
                            { name: 'Shopping', icon: ShoppingBag, color: '#E6F0FA', iconColor: '#4A90E2', amount: '45.75' },
                            { name: 'Travel', icon: Car, color: '#D4F4E2', iconColor: '#27AE60', amount: '120.20' },
                            { name: 'Lifestyle', icon: Coffee, color: '#FEF3C7', iconColor: '#B45309', amount: '15.50' },
                            { name: 'Gaming', icon: MoreHorizontal, color: '#FCE7F3', iconColor: '#DB2777', amount: '9.99' },
                        ].map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => handleBuyGiftCard(cat.name, cat.amount)}
                                disabled={isUpdating || !address || !merchantWallet}
                                className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col gap-6 text-left hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all active:scale-95 disabled:opacity-50 group relative overflow-hidden"
                            >
                                <div className="w-14 h-14 rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform relative z-10" style={{ backgroundColor: cat.color, color: cat.iconColor }}>
                                    <cat.icon size={28} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.name}</p>
                                    <p className="text-xl font-black text-slate-900 italic tracking-tight">${cat.amount}</p>
                                    <div className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Buy Card <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                                    </div>
                                </div>
                                {/* Decorative bg circle */}
                                <div className="absolute -bottom-4 -right-4 size-20 rounded-full bg-slate-50 group-hover:bg-primary/5 transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
