'use client';

import { User, Shield, Bell, HelpCircle, LogOut, ChevronRight, Globe, Moon, Lock } from 'lucide-react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export default function SettingsScreen() {
    const { user, logout } = usePrivy();
    const router = useRouter();
    const userEmail = user?.email?.address || 'No email linked';
    const userName = userEmail.split('@')[0] || 'User';
    const userWallet = user?.wallet?.address || 'No wallet connected';

    const handleLogout = async () => {
        await logout();
        router.push('/onboarding');
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
                { icon: Moon, label: 'Appearance', detail: 'Light Mode', color: 'text-slate-500', bg: 'bg-slate-50' },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: HelpCircle, label: 'Help Center', detail: '', color: 'text-blue-500', bg: 'bg-blue-50' },
                { icon: Lock, label: 'Privacy Policy', detail: '', color: 'text-slate-500', bg: 'bg-slate-50' },
            ]
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
            {/* Header */}
            <header className="bg-white px-4 py-8 border-b border-slate-100 sticky top-0 z-10">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
            </header>

            <main className="flex-1 p-4 space-y-8 pb-32">
                {/* Profile Snapshot */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 flex items-center gap-4 shadow-sm">
                    <div className="size-16 rounded-full bg-slate-200 overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${userName}&background=4A90E2&color=fff`} alt="Profile" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold text-slate-900 capitalize">{userName}</h2>
                        <p className="text-xs text-slate-500 font-medium tracking-tight truncate">{userEmail}</p>
                    </div>
                </div>

                {/* Settings Items */}
                {settingsGroups.map((group) => (
                    <div key={group.title} className="space-y-3">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">{group.title}</h3>
                        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                            {group.items.map((item, i) => (
                                <div key={item.label} className={`p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${i !== group.items.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`size-10 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{item.label}</p>
                                            {item.detail && <p className="text-[10px] text-slate-500 font-medium">{item.detail}</p>}
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300" />
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
