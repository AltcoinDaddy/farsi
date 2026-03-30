'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { label: 'Home', icon: 'home', href: '/' },
        { label: 'Wallet', icon: 'account_balance_wallet', href: '/wallet' },
        { label: 'Spend', icon: 'shopping_bag', href: '/spend' },
        { label: 'Social', icon: 'group', href: '/social' },
        { label: 'Settings', icon: 'settings', href: '/settings' },
    ];

    if (pathname === '/onboarding') return null;

    return (
        <nav className="fixed bottom-0 w-full max-w-[480px] bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between z-50 mx-auto left-0 right-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
            {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.label}
                        href={item.href || '#'}
                        className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-neutral-muted'}`}
                    >
                        <span className={`material-symbols-outlined ${isActive ? 'material-symbols-filled' : ''}`}>
                            {item.icon}
                        </span>
                        <span className="text-[10px] font-bold">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
