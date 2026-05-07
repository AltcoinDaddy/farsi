'use client';

import Image from 'next/image';
import { User, Shield, Bell, HelpCircle, LogOut, ChevronRight, Globe, Moon, Lock, FileText } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';
import { getPrivyWalletAddress } from '@/lib/active-wallet';
import { toast } from 'sonner';
import { openMiniPayBrowse, openMiniPayDiscover } from '@/lib/minipay';

export default function SettingsScreen() {
    const { user, logout } = usePrivy();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const userEmail = user?.email?.address || 'No email linked';
    const userName = userEmail.split('@')[0] || 'User';
    const userWallet = getPrivyWalletAddress(user) || 'No wallet connected';

    const handleLogout = async () => {
        await logout();
        router.push('/onboarding');
    };

    const handleOpenInMiniPay = () => {
        const didOpen = openMiniPayBrowse();

        if (!didOpen) {
            toast.info('MiniPay listing link not ready yet', {
                description: 'Set NEXT_PUBLIC_MINIPAY_APP_URL once Farsi has a public HTTPS URL ready for MiniPay listing.',
            });
        }
    };

    const settingsGroups = [
        {
            title: 'Account',
            items: [
                { icon: User, label: 'Profile Information', detail: userName, color: 'text-blue-500', bg: 'bg-blue-50' },
                { icon: Shield, label: 'Security & Privacy', detail: '2FA Enabled', color: 'text-green-500', bg: 'bg-green-50' },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: Bell, label: 'Notifications', detail: 'On', color: 'text-orange-500', bg: 'bg-orange-50' },
                { icon: Globe, label: 'Language', detail: 'English (US)', color: 'text-purple-500', bg: 'bg-purple-50' },
                { icon: Moon, label: 'Appearance', detail: theme === 'dark' ? 'Dark Mode' : 'Light Mode', color: 'text-slate-500', bg: 'bg-slate-50', onClick: toggleTheme },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: Globe, label: 'Open in MiniPay', detail: 'Launch the listed Mini App', color: 'text-primary', bg: 'bg-blue-50', onClick: handleOpenInMiniPay },
                { icon: Globe, label: 'Browse Mini Apps', detail: 'Open the MiniPay discover tab', color: 'text-emerald-500', bg: 'bg-emerald-50', onClick: openMiniPayDiscover },
                { icon: HelpCircle, label: 'Help Center', detail: 'Support and issue reporting', color: 'text-blue-500', bg: 'bg-blue-50', onClick: () => router.push('/support') },
                { icon: Lock, label: 'Privacy Policy', detail: 'How testnet data is handled', color: 'text-slate-500', bg: 'bg-slate-50', onClick: () => router.push('/privacy') },
                { icon: FileText, label: 'Terms of Use', detail: 'Rules for the MiniPay preview', color: 'text-amber-600', bg: 'bg-amber-50', onClick: () => router.push('/terms') },
            ]
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FA] dark:bg-[#0F1117]">
            {/* Header */}
            <header className="bg-white dark:bg-[#1A1D2E] px-4 py-8 border-b border-slate-100 dark:border-[#2D3348] sticky top-0 z-10">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
            </header>

            <main className="flex-1 p-4 space-y-8 pb-32">
                {/* Profile Snapshot */}
                <div className="bg-white dark:bg-[#1E2235] rounded-3xl p-6 border border-slate-100 dark:border-[#2D3348] flex items-center gap-4 shadow-sm">
                    <div className="size-16 rounded-full bg-slate-200 overflow-hidden">
                        <Image
                            src={`https://ui-avatars.com/api/?name=${userName}&background=4A90E2&color=fff`}
                            alt="Profile"
                            width={64}
                            height={64}
                            className="size-16"
                            unoptimized
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{userName}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight truncate">{userEmail}</p>
                    </div>
                </div>

                {/* Settings Items */}
                {settingsGroups.map((group) => (
                    <div key={group.title} className="space-y-3">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">{group.title}</h3>
                        <div className="bg-white dark:bg-[#1E2235] rounded-3xl border border-slate-100 dark:border-[#2D3348] overflow-hidden shadow-sm">
                            {group.items.map((item, i) => (
                                <div 
                                    key={item.label} 
                                    onClick={item.onClick}
                                    className={`p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#252A3A] transition-colors cursor-pointer ${i !== group.items.length - 1 ? 'border-b border-slate-50 dark:border-[#2D3348]' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-2xl ${item.bg.replace('bg-', 'dark:bg-opacity-20 bg-')} ${item.color} flex items-center justify-center`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</p>
                                            {item.detail && <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{item.detail}</p>}
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full p-4 rounded-2xl border-2 border-red-50/50 text-red-500 font-bold text-sm bg-red-50/20 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                    <LogOut size={18} /> Disconnect Wallet
                </button>

                <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Version 1.2.0 • Farsi PWA
                </p>
            </main>
        </div>
    );
}
