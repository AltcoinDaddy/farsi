'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Notification {
    id: string;
    title: string;
    description: string;
    type: 'success' | 'info' | 'warning' | 'error';
    icon: string;
    timestamp: Date;
    read: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAllRead: () => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    unreadCount: 0,
    addNotification: () => {},
    markAllRead: () => {},
    clearAll: () => {},
});

export function useNotifications() {
    return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotif: Notification = {
            ...n,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            read: false,
        };
        setNotifications((prev) => [newNotif, ...prev].slice(0, 50)); // Keep last 50
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
}
