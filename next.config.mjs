import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    disable: false,
    reloadOnOnline: true
});

export default withPWA({
    // Your Next.js config
    output: 'export',
    images: {
        unoptimized: true
    },
});