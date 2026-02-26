'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Mock Privy Account for Demo
 */
interface MockUser {
    id: string;
    email?: { address: string };
    wallet?: { address: string };
}

interface PrivyContextType {
    ready: boolean;
    authenticated: boolean;
    user: MockUser | null;
    login: () => void;
    logout: () => void;
}

const PrivyContext = createContext<PrivyContextType | undefined>(undefined);

export function usePrivy() {
    const context = useContext(PrivyContext);
    if (!context) throw new Error('usePrivy must be used within a MockPrivyProvider');
    return context;
}

/**
 * Mock Privy Provider to ensure UI visibility and demo functionality
 */
export function MockPrivyProvider({ children }: { children: React.ReactNode }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState<MockUser | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Hydrate from localStorage
        const saved = localStorage.getItem('farsi_demo_user');
        if (saved) {
            setUser(JSON.parse(saved));
            setAuthenticated(true);
        }
        setReady(true);
    }, []);

    const login = () => {
        // Simulate login process
        setReady(false);
        setTimeout(() => {
            const mockUser = {
                id: 'did:privy:ck...' + Math.random().toString(36).substring(7),
                email: { address: 'demo@example.com' },
                wallet: { address: '0x' + Math.random().toString(16).substring(2, 42) }
            };
            setUser(mockUser);
            setAuthenticated(true);
            setReady(true);
            localStorage.setItem('farsi_demo_user', JSON.stringify(mockUser));
        }, 800);
    };

    const logout = () => {
        setAuthenticated(false);
        setUser(null);
        localStorage.removeItem('farsi_demo_user');
        localStorage.removeItem('farsi_onboarded');
    };

    return (
        <PrivyContext.Provider value={{ ready, authenticated, user, login, logout }}>
            {children}
        </PrivyContext.Provider>
    );
}
