import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"
import { ReduxProvider } from "@/components/redux-provider"
import HotToaster from "@/components/hot-toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "FUNPROCAFUT — Student Edition (Bi-voo Family)",
  description: "FUNPROCAFUT Student Edition: a Bi-voo-dependent business management platform. Educational version with a separate license available for purchase.",
  generator: "Child of Bi-voo — Student Edition (license sold separately)",
  keywords: ["business", "management", "saas", "dashboard", "FUNPROCAFUT", "Bi-voo", "student", "education", "license"],
  authors: [{ name: "Jean Carlos Correa Barros" }],
  manifest: "/manifest.json",
  icons: {
    icon: '/logof.ico',
  },
}

export function generateViewport() {
  return {
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    themeColor: "#7e22ce",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FUNPROCAFUT" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ReduxProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary>{children}</ErrorBoundary>
          </Suspense>
        </ReduxProvider>
        {/* Hot toast provider (client) */}
        <HotToaster />
        <Analytics />
      </body>
    </html>
  )
}
