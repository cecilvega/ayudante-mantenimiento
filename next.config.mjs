import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: false,
  register: true,
  skipWaiting: true,
  reloadOnOnline: false,
  cacheOnFrontEndNav: true,
  runtimeCaching: [
    {
      urlPattern: ({ url }) => {
        const isSameOrigin = self.origin === url.origin;
        return isSameOrigin && url.pathname.startsWith("/");
      },
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 32,
        },
      },
    },
    {
      urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "firestore-data",
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const nextConfig = {
  output: "export",
  trailingSlash: true, // Add this
  images: {
    unoptimized: true,
  },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default withPWA(nextConfig);
