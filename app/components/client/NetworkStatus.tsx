'use client';

import React, { useState, useEffect } from 'react';

export default function NetworkStatus() {
    const [isOnline, setIsOnline] = useState<boolean>(true);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        setIsOnline(navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div className={`w-3 h-3 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
        }`} title={isOnline ? 'Online' : 'Offline'} />
    );
}