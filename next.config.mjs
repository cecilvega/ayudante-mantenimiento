import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    disable: false,
    reloadOnOnline: true,
    runtimeCaching: [
        {
            urlPattern: /manifest\.json$/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'manifest',
            }
        },
        {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts',
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
                }
            }
        },
        {
            urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-font-assets',
            }
        },
        {
            urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-image-assets',
            }
        },
        {
            urlPattern: /\.(?:js)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-js-assets',
            }
        },
        {
            urlPattern: /\.(?:css|less)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'static-style-assets',
            }
        },
        {
            urlPattern: /\.(?:json|xml|csv)$/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'static-data-assets',
            }
        },
        {
            urlPattern: /\/api\/.*$/i,
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
                cacheName: 'apis',
                expiration: {
                    maxEntries: 16,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                },
                networkTimeoutSeconds: 10
            }
        },
        {
            urlPattern: /.*/i,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'others',
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                },
                networkTimeoutSeconds: 10
            }
        }
    ]
});

// const withPWA = withPWAInit({
//     dest: "public",
//     disable: false,
//     reloadOnOnline: true
// });

export default withPWA({
    // Your Next.js config
    output: 'export',
    images: {
        unoptimized: true
    },
});