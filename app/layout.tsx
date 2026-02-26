import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import Navigation from '@/components/Navigation';

export const metadata = {
    title: 'Farsi - Consumer DeFi',
    description: 'Premium finance for everyone on Flow EVM',
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </head>
            <body className="bg-[#F8F9FA] text-[#1A1A1A] antialiased">
                <Providers>
                    {/* The max-width container is now inside each screen if needed, 
                        or we can keep it here but match the design's 480px. 
                        Design code.html uses no wrapper in dashboard, but 480px in buy_crypto.
                        So let's use a standard 480px wrapper for all for PWA feel. */}
                    <div className="flex flex-col min-h-screen max-w-[480px] mx-auto bg-white shadow-xl relative overflow-hidden">
                        <main className="flex-1 overflow-y-auto pb-24">
                            {children}
                        </main>
                        <Navigation />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
