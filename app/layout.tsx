import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppProviders from "./AppProviders";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#140a9a" },
    { media: "(prefers-color-scheme: dark)", color: "#140a9a" },
  ],
};

export const metadata: Metadata = {
  title: "Ayudante Mantenimiento",
  manifest: "/manifest.json",
  description: "Aplicación de ayudante de mantenimiento para KOMATSU",

  metadataBase: new URL("https://ayudante-mantenimiento.firebaseapp.com"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ayudante Mantenimiento",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <body className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
        <ServiceWorkerRegister />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
