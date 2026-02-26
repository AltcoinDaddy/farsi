'use client';

import { ChevronLeft, CreditCard, ShoppingBag, Wifi, Car, Coffee, Plus, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function SpendScreen() {
    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
            {/* Header */}
            <header className="bg-white px-4 py-4 flex items-center border-b border-slate-100 sticky top-0 z-10">
                <Link href="/" className="text-slate-600">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="flex-1 text-center text-lg font-bold pr-6">Spend</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Premium Card */}
                <div className="relative h-56 w-full rounded-3xl bg-[#1A1A1A] p-8 text-white shadow-2xl overflow-hidden group">
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
                                <p className="text-xs font-bold uppercase tracking-widest">SARAH WILLIAMS</p>
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

                {/* Controls */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-2xl border border-slate-100 font-bold text-sm shadow-sm">
                        <CreditCard size={18} className="text-[#4A90E2]" /> Freeze Card
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-2xl border border-slate-100 font-bold text-sm shadow-sm">
                        <MoreHorizontal size={18} className="text-[#4A90E2]" /> Settings
                    </button>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Spend Categories</h3>
                    <div className="grid grid-cols-2 gap-4 pb-20">
                        {[
                            { name: 'Shopping', icon: ShoppingBag, color: '#E6F0FA', iconColor: '#4A90E2', amount: '$450.00' },
                            { name: 'Travel', icon: Car, color: '#D4F4E2', iconColor: '#27AE60', amount: '$1,200.00' },
                            { name: 'Lifestyle', icon: Coffee, color: '#FEF3C7', iconColor: '#B45309', amount: '$85.50' },
                        ].map((cat) => (
                            <div key={cat.name} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color, color: cat.iconColor }}>
                                    <cat.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">{cat.name}</p>
                                    <p className="text-sm font-bold text-slate-900">{cat.amount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
