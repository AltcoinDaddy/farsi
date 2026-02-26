'use client';

import { usePrivy } from '@/lib/mock-privy';
import { useBalance } from 'wagmi';
import Link from 'next/link';
import { formatUnits } from 'viem';

export default function DashboardPage() {
    const { user } = usePrivy();
    const { data: balance, isLoading: isBalanceLoading } = useBalance({
        address: user?.wallet?.address as `0x${string}`,
    });

    const displayName = user?.email?.address?.split('@')[0] || 'User';
    const formattedBalance = balance ? parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(2) : '0.00';

    return (
        <div className="bg-background-light text-neutral-dark min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white px-4 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4A90E2]/10 flex items-center justify-center overflow-hidden border border-[#4A90E2]/20">
                        {/* Use a generic avatar or initials if real image is not available */}
                        <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase">
                            {displayName[0]}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-[#4A4A4A] font-medium">Welcome back</p>
                        <h1 className="text-lg font-bold text-[#1A1A1A] leading-tight capitalize">Hi, {displayName}!</h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F8F9FA] text-[#4A4A4A]">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F8F9FA] text-[#4A4A4A]">
                        <span className="material-symbols-outlined">qr_code_scanner</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto pb-24">
                {/* Balance Card */}
                <div className="p-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-[#4A4A4A] mb-1 flex items-center gap-1">
                                    Total Balance <span className="material-symbols-outlined text-xs">visibility</span>
                                </p>
                                <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
                                    {isBalanceLoading ? '...' : formattedBalance} {balance?.symbol || 'FLOW'}
                                </h2>
                                <p className="text-[10px] text-neutral-muted mt-2 font-mono truncate max-w-[150px]">
                                    {user?.wallet?.address}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 bg-[#F8F9FA] px-2 py-1 rounded text-[10px] font-bold text-[#4A4A4A] border border-gray-200 uppercase tracking-wider">
                                <span className="material-symbols-outlined text-xs text-[#4A90E2]">change_history</span> Flow EVM
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 bg-[#4A90E2] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-lg">add_circle</span>
                                Add Funds
                            </button>
                            <Link href="/send" className="flex-1 bg-[#E6F0FA] text-[#4A90E2] font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
                                <span className="material-symbols-outlined text-lg">near_me</span>
                                Send
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Yield Banner */}
                <div className="px-4 mb-6">
                    <Link href="/earn" className="bg-[#D4F4E2] border border-[#27AE60]/20 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#27AE60] shadow-sm">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <div>
                                <p className="text-[#27AE60] font-bold text-sm leading-tight">You earned $0.45 today!</p>
                                <p className="text-[#27AE60]/80 text-xs">Your yield is working for you.</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-[#27AE60]">chevron_right</span>
                    </Link>
                </div>

                {/* Quick Actions Grid */}
                <div className="px-4 mb-8">
                    <h3 className="text-sm font-bold text-[#4A4A4A] mb-4 uppercase tracking-wider">Quick Actions</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <Link href="/buy" className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#4A90E2] border border-gray-100">
                                <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                            </button>
                            <span className="text-[11px] font-semibold text-[#4A4A4A] text-center">Buy Crypto</span>
                        </Link>
                        <Link href="/earn" className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#4A90E2] border border-gray-100">
                                <span className="material-symbols-outlined text-2xl">show_chart</span>
                            </button>
                            <span className="text-[11px] font-semibold text-[#4A4A4A] text-center">Yield</span>
                        </Link>
                        <Link href="/receipt" className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#4A90E2] border border-gray-100">
                                <span className="material-symbols-outlined text-2xl">receipt_long</span>
                            </button>
                            <span className="text-[11px] font-semibold text-[#4A4A4A] text-center">Pay</span>
                        </Link>
                        <Link href="/social" className="flex flex-col items-center gap-2">
                            <button className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#4A90E2] border border-gray-100">
                                <span className="material-symbols-outlined text-2xl">groups</span>
                            </button>
                            <span className="text-[11px] font-semibold text-[#4A4A4A] text-center">Pots</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="px-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-[#4A4A4A] uppercase tracking-wider">Recent Activity</h3>
                        <button className="text-xs font-bold text-[#4A90E2]">View All</button>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#E6F0FA] flex items-center justify-center text-[#4A90E2]">
                                    <span className="material-symbols-outlined text-xl">person</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#1A1A1A]">Sent to @sam</p>
                                    <p className="text-[10px] text-[#4A4A4A]">Today, 2:45 PM</p>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-[#1A1A1A]">-$25.00</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#D4F4E2] flex items-center justify-center text-[#27AE60]">
                                    <span className="material-symbols-outlined text-xl">savings</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#1A1A1A]">Earned Yield</p>
                                    <p className="text-[10px] text-[#4A4A4A]">Today, 8:00 AM</p>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-[#27AE60]">+$0.45</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
