'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useBalance } from 'wagmi';
import Link from 'next/link';
import { formatUnits, parseAbiItem } from 'viem';
import { usePublicClient, useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import YieldVaultABI from '@/lib/abi/YieldVault.json';
import MockUSDCABI from '@/lib/abi/MockUSDC.json';
import { ArrowUpRight, ArrowDownLeft, History, Wallet, Sparkles, TrendingUp } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { useNotifications } from '@/lib/notification-context';

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

const TRANSFER_EVENT = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)');

import { QRCodeSVG } from 'qrcode.react';

export default function DashboardPage() {
    const { user } = usePrivy();
    const { address: wagmiAddress } = useAccount();
    const address = (user?.smartWallet?.address || user?.wallet?.address || wagmiAddress) as `0x${string}`;
    const [showReceiveModal, setShowReceiveModal] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [flowPrice, setFlowPrice] = React.useState<number | null>(null);
    const { notifications, unreadCount, markAllRead } = useNotifications();

    const { data: balance, isLoading: isBalanceLoading } = useBalance({
        address: address,
    });

    const displayName = user?.email?.address?.split('@')[0] || 'User';
    const publicClient = usePublicClient();
    const [transactions, setTransactions] = React.useState<any[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = React.useState(false);

    // Fetch FLOW price from CoinGecko
    React.useEffect(() => {
        const fetchPrice = async () => {
            try {
                const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=flow&vs_currencies=usd');
                const data = await res.json();
                setFlowPrice(data.flow.usd);
            } catch (err) {
                console.error('Failed to fetch FLOW price:', err);
                // Fallback price if API fails
                setFlowPrice(0.65); 
            }
        };
        fetchPrice();
    }, []);

    // Fetch mUSDC balance
    const { data: usdcBalance, isLoading: isUsdcLoading } = useReadContract({
        address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
        abi: MockUSDCABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    // Fetch Vault shares balance to see if they HAVE yield
    const { data: vaultBalance } = useReadContract({
        address: CONTRACT_ADDRESSES.YieldVault as `0x${string}`,
        abi: YieldVaultABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    // Fetch recent mUSDC transfers (same logic as Wallet.tsx)
    React.useEffect(() => {
        if (!address || !publicClient) return;

        const fetchLogs = async () => {
            setIsHistoryLoading(true);
            try {
                const sentLogs = await publicClient.getLogs({
                    address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
                    event: TRANSFER_EVENT,
                    args: { from: address },
                    fromBlock: 'earliest',
                });
                const receivedLogs = await publicClient.getLogs({
                    address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
                    event: TRANSFER_EVENT,
                    args: { to: address },
                    fromBlock: 'earliest',
                });
                const allLogs = [...sentLogs, ...receivedLogs]
                    .sort((a, b) => Number((b.blockNumber || 0n) - (a.blockNumber || 0n)))
                    .slice(0, 3); // Just show top 3 on dashboard
                setTransactions(allLogs);
            } catch (err) {
                console.error('Failed to fetch dashboard history:', err);
            } finally {
                setIsHistoryLoading(false);
            }
        };
        fetchLogs();
    }, [address, publicClient]);

    const flowVal = balance ? parseFloat(formatUnits(balance.value, balance.decimals)) : 0;
    const usdcVal = usdcBalance ? parseFloat(formatUnits(usdcBalance as bigint, 18)) : 0;
    
    // Calculate Portfolio Value in USD
    const totalFiatValue = (flowVal * (flowPrice || 0)) + usdcVal;

    const formattedBalance = flowVal.toFixed(2);
    const formattedUsdc = usdcVal.toFixed(2);
    const hasYield = vaultBalance && (vaultBalance as bigint) > 0n;

    const handleCopyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            toast.success('Address copied!', {
                description: 'The wallet address has been copied to your clipboard.',
            });
        }
    };

    return (
        <div className="text-slate-900 font-sans pb-6">
            {/* Header */}
            <header className="px-6 pt-8 pb-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm overflow-hidden group">
                        <div className="size-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-black text-xl uppercase italic group-hover:scale-110 transition-transform">
                            {displayName[0]}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Portfolio</p>
                        <h1 className="text-xl font-black text-slate-900 leading-tight capitalize italic">Hi, {displayName}!</h1>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllRead(); }}
                        className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-[#252A3A] text-slate-400 border border-slate-100 dark:border-[#2D3348] shadow-sm hover:text-primary transition-colors relative"
                    >
                        <span className="material-symbols-outlined text-2xl">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                    <button 
                        onClick={() => setShowReceiveModal(true)}
                        className="size-11 flex items-center justify-center rounded-2xl bg-white text-slate-400 border border-slate-100 shadow-sm hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                    </button>
                </div>
            </header>

            {/* Notification Dropdown */}
            {showNotifications && (
                <div className="absolute top-20 right-4 left-4 z-[60] bg-white dark:bg-[#1E2235] rounded-[28px] shadow-2xl border border-slate-100 dark:border-[#2D3348] overflow-hidden animate-in slide-in-from-top-2 duration-300">
                    <div className="p-5 border-b border-slate-100 dark:border-[#2D3348] flex items-center justify-between">
                        <h3 className="text-sm font-black italic tracking-tight">Notifications</h3>
                        <button onClick={() => setShowNotifications(false)} className="text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <span className="material-symbols-outlined text-3xl text-slate-200 dark:text-slate-600 mb-2">notifications_off</span>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.slice(0, 8).map((n) => (
                                <div key={n.id} className={`p-4 flex items-start gap-3 border-b border-slate-50 dark:border-[#252A3A] last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}>
                                    <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${
                                        n.type === 'success' ? 'bg-success/10 text-success' :
                                        n.type === 'warning' ? 'bg-amber-50 text-amber-500' :
                                        n.type === 'error' ? 'bg-red-50 text-red-500' :
                                        'bg-primary/10 text-primary'
                                    }`}>
                                        <span className="material-symbols-outlined text-lg">{n.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black tracking-tight">{n.title}</p>
                                        <p className="text-[10px] text-slate-400 font-bold truncate">{n.description}</p>
                                        <p className="text-[9px] text-slate-300 font-bold mt-1">{timeAgo(n.timestamp)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <div className="px-6 pt-6 space-y-8">
                {/* Total Balance Card */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-[34px] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    <div className="relative bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col gap-8 overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] -mr-4 -mt-4">
                            <Sparkles size={120} />
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    Unified Net Worth <span className="material-symbols-outlined text-[14px]">visibility</span>
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-4xl font-black tracking-tight text-slate-900 italic">
                                        ${totalFiatValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </h2>
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">USD Equivalent</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-2xl self-start">
                                    <div className="size-4 rounded-full bg-primary border-2 border-white flex items-center justify-center text-[8px] font-bold text-white italic">F</div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                        {formattedBalance} FLOW <span className="text-slate-300 mx-1">/</span> <span className="text-primary">${(flowVal * (flowPrice || 0)).toFixed(2)}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-2xl self-start">
                                    <div className="size-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">U</div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                        {formattedUsdc} USDC <span className="text-slate-300 mx-1">/</span> <span className="text-blue-500">${usdcVal.toFixed(2)}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Link href="/buy" className="flex-1 bg-primary text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-lg !font-black">add_circle</span>
                                Top Up
                            </Link>
                            <Link href="/send" className="flex-1 bg-white border-2 border-slate-50 text-slate-900 font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-lg !font-black">near_me</span>
                                Send
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Receive Modal */}
                {showReceiveModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                        <div className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                            <div className="p-10 flex flex-col items-center text-center space-y-8">
                                <div className="flex justify-between items-center w-full">
                                    <h2 className="text-xl font-black text-slate-900 italic tracking-tight">Receive Funds</h2>
                                    <button onClick={() => setShowReceiveModal(false)} className="text-slate-300">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-[32px] border-2 border-slate-100 flex items-center justify-center group transition-all hover:bg-white hover:border-primary/20">
                                    {address ? (
                                        <QRCodeSVG 
                                            value={address} 
                                            size={200} 
                                            fgColor="#1A1A1A"
                                            includeMargin={true}
                                        />
                                    ) : (
                                        <div className="size-48 flex items-center justify-center">
                                            <div className="size-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 w-full">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Wallet Address</p>
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 break-all text-[11px] font-mono font-bold text-slate-600">
                                            {address || 'Connecting...'}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleCopyAddress}
                                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-lg">content_copy</span>
                                        Copy Address
                                    </button>
                                </div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px] text-success">verified</span> Flow EVM Network
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Rest of the original Dashboard content... */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Status</h3>
                        {hasYield && <span className="flex items-center gap-1.5 text-[9px] font-black text-success uppercase tracking-widest animate-pulse">
                            <span className="size-1.5 rounded-full bg-success" /> Multiplier Active
                        </span>}
                    </div>
                    
                    <Link href="/earn" className={`relative rounded-3xl p-6 flex items-center justify-between border transition-all active:scale-[0.98] group overflow-hidden ${hasYield ? 'bg-success/5 border-success/10' : 'bg-primary/5 border-primary/10'}`}>
                        <div className="flex items-center gap-5 relative z-10">
                            <div className={`size-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${hasYield ? 'bg-white text-success' : 'bg-white text-primary'}`}>
                                <span className="material-symbols-outlined text-3xl material-symbols-filled">
                                    {hasYield ? 'account_balance' : 'rocket_launch'}
                                </span>
                            </div>
                            <div>
                                <h4 className={`text-sm font-black italic tracking-tight ${hasYield ? 'text-success' : 'text-primary'}`}>
                                    {hasYield ? 'Your savings are active' : 'Start Earning Yield'}
                                </h4>
                                <p className="text-xs font-bold text-slate-500">
                                    {hasYield ? 'Vault assets are working for you' : 'Put your idle mUSDC to work'}
                                </p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-1 ${hasYield ? 'text-success' : 'text-primary'}`}>
                             <span className="text-xs font-black italic tracking-tighter">View</span>
                             <span className="material-symbols-outlined">chevron_right</span>
                        </div>
                    </Link>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-3 gap-6">
                    {[
                        { href: '/spend', name: 'Spend', icon: 'shopping_cart_checkout', color: '#4A90E2' },
                        { href: '/social', name: 'Pots', icon: 'groups', color: '#B45309' },
                        { href: '/wallet', name: 'History', icon: 'history', color: '#64748b' },
                    ].map((btn) => (
                        <Link key={btn.name} href={btn.href} className="flex flex-col items-center gap-3 group">
                            <div className="size-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center border border-slate-100 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/5 transition-all text-slate-400 group-hover:text-primary">
                                <span className="material-symbols-outlined text-3xl">{btn.icon}</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{btn.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Activity Feed */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recent Activity</h3>
                        <Link href="/wallet" className="text-[9px] font-black text-primary uppercase tracking-[0.1em] underline decoration-primary/30 underline-offset-4">Full History</Link>
                    </div>
                    
                    <div className="space-y-3">
                        {isHistoryLoading ? (
                            <div className="py-12 flex flex-col items-center gap-3">
                                <div className="size-6 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Syncing Nodes</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="bg-white p-10 rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center text-center gap-4 opacity-60">
                                <History size={32} className="text-slate-200" />
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-slate-400 uppercase">System Clean</p>
                                    <p className="text-[10px] font-bold text-slate-300 px-8">No recent peer transfers found in the ledger.</p>
                                </div>
                            </div>
                        ) : (
                            transactions.map((tx, i) => {
                                const isOutgoing = tx.args.from.toLowerCase() === address?.toLowerCase();
                                const amount = formatUnits(tx.args.value, 18);
                                return (
                                    <div key={i} className="bg-white p-5 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm transition-all hover:border-slate-200">
                                        <div className="flex items-center gap-4">
                                            <div className={`size-12 rounded-2xl flex items-center justify-center transition-colors ${isOutgoing ? 'bg-amber-50 text-amber-600' : 'bg-success/5 text-success'}`}>
                                                {isOutgoing ? <ArrowUpRight size={22} strokeWidth={3} /> : <ArrowDownLeft size={22} strokeWidth={3} />}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-black text-slate-900 italic tracking-tight">
                                                    {isOutgoing ? 'Sent mUSDC' : 'Received mUSDC'}
                                                </p>
                                                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Confirmed • Block {Number(tx.blockNumber).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-black tracking-tighter ${isOutgoing ? 'text-slate-900' : 'text-success'}`}>
                                                {isOutgoing ? '-' : '+'}{parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-[8px] text-slate-300 font-black uppercase tracking-widest">USDC</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
