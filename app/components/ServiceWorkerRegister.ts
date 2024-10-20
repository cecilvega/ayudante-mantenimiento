'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('Service worker registered:', reg))
                    .catch(err => console.error('Service worker registration failed:', err));
            });
        }

        const handleError = (event: ErrorEvent) => {
            console.error('Error occurred:', event.error);
        };

        window.addEventListener('error', handleError);

        return () => {
            window.removeEventListener('load', () => {});
            window.removeEventListener('error', handleError);
        };
    }, []);

    return null; // This component does not render anything
}