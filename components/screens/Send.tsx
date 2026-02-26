import Link from 'next/link';
import { ChevronLeft, Send, ArrowUpRight, Search } from 'lucide-react';

export default function SendScreen() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="flex items-center p-4 border-b border-[#E0E0E0]">
                <Link href="/" className="text-[#1A1A1A]">
                    <ChevronLeft size={24} />
                </Link>
                <h2 className="flex-1 text-center text-lg font-black pr-6">Send Funds</h2>
            </div>

            <div className="p-4 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-black text-[#4A4A4A]">Search Recipient</label>
                    <div className="flex items-center rounded-2xl border-2 border-[#E0E0E0] bg-[#F8F9FA] p-4">
                        <Search size={20} className="text-[#4A4A4A] mr-2" />
                        <input type="text" placeholder="Name, @username, or address" className="bg-transparent flex-1 outline-none font-bold" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-black text-[#4A4A4A] uppercase tracking-widest">Recent</h3>
                    <div className="space-y-3">
                        {['@sam', '@lexi', '@flow_fan'].map(name => (
                            <div key={name} className="flex items-center justify-between p-4 rounded-xl border border-[#E0E0E0] hover:bg-[#F8F9FA] cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#E6F0FA] flex items-center justify-center text-[#4A90E2] font-black">
                                        {name[1].toUpperCase()}
                                    </div>
                                    <span className="font-black text-[#1A1A1A]">{name}</span>
                                </div>
                                <ArrowUpRight size={18} className="text-[#E0E0E0]" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
