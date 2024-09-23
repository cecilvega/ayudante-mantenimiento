'use client';

import React, { useState, useEffect } from 'react';

export default function NetworkStatus() {
    const [isOnline, setIsOnline] = useState<boolean>(true);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Set initial network status
        setIsOnline(navigator.onLine);

        // Cleanup
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div className={`network-status fixed top-0 right-0 m-4 p-2 rounded ${
            isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
        </div>
    );
}