'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ArrowUpRight, Search, Wallet } from 'lucide-react';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import MockUSDCABI from '@/lib/abi/MockUSDC.json';
import { flowEVMTestnet, config } from '@/lib/web3-config';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { toast } from 'sonner';

export default function SendScreen() {
    const { address } = useAccount();
    const { writeContractAsync } = useWriteContract();
    const [recipient, setRecipient] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [isUpdating, setIsUpdating] = React.useState(false);

    // Fetch mUSDC balance for display
    const { data: usdcBalance, refetch: refetchUSDC } = useReadContract({
        address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
        abi: MockUSDCABI,
        functionName: 'balanceOf',
        args: [address],
    });

    const handleTransfer = async () => {
        if (!address || !recipient || !amount) return;
        setIsUpdating(true);

        try {
            console.log(`Sending ${amount} mUSDC to ${recipient}...`);
            const transferHash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
                abi: MockUSDCABI,
                functionName: 'transfer',
                args: [recipient as `0x${string}`, parseUnits(amount, 18)],
                account: address as `0x${string}`,
                chain: flowEVMTestnet,
            });
            await waitForTransactionReceipt(config, { hash: transferHash });
            await refetchUSDC();
            toast.success('Funds sent!', {
                description: `Successfully sent ${amount} mUSDC to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
            });
            setAmount('');
            setRecipient('');
        } catch (error) {
            console.error('Transfer failed:', error);
            toast.error('Transfer failed', {
                description: 'Check the recipient address and your balance.',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const formattedUSDC = usdcBalance ? parseFloat(formatUnits(usdcBalance as bigint, 18)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';

    return (
        <div className="flex flex-col min-h-screen bg-white text-slate-900">
            <div className="flex items-center p-4 border-b border-slate-100">
                <Link href="/" className="text-slate-900 flex size-10 items-center justify-center">
                    <ChevronLeft size={24} />
                </Link>
                <h2 className="flex-1 text-center text-lg font-black pr-10">Send Funds</h2>
            </div>

            <main className="flex-1 p-6 space-y-8">
                {/* Balance & Amount */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Amount to Send</label>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                            <Wallet size={12} />
                            {formattedUSDC} mUSDC
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[32px] p-8 text-4xl font-black text-slate-900 focus:border-primary outline-none transition-all pr-24"
                        />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-400">
                            USDC
                        </div>
                    </div>
                </div>

                {/* Recipient Input */}
                <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Recipient Address</label>
                    <div className="flex items-center rounded-3xl border-2 border-slate-100 bg-slate-50 p-5 focus-within:border-primary transition-all">
                        <Search size={22} className="text-slate-400 mr-3" />
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="0x... or ENS name"
                            className="bg-transparent flex-1 outline-none font-bold text-slate-900 placeholder:text-slate-300"
                        />
                    </div>
                </div>

                {/* Recent Items Placeholder */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Tip</h3>
                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                        <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                            Paste a Flow EVM address above to send mUSDC instantly. Your recently used addresses will appear here in the next update.
                        </p>
                    </div>
                </div>
            </main>

            {/* Float Action Button */}
            <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0">
                <button
                    onClick={handleTransfer}
                    disabled={isUpdating || !recipient || !amount || parseFloat(amount) <= 0}
                    className="w-full bg-primary text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                    {isUpdating ? (
                        <>
                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <ArrowUpRight size={20} />
                            Send mUSDC
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
