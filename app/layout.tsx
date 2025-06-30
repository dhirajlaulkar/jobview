import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"

// Configure Inter font with Latin subset for better performance
const inter = Inter({ subsets: ["latin"] })
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

// SEO metadata configuration - customize for better search rankings
export const metadata: Metadata = {
  title: "JobView - Find Your Dream Job",
  description: "Your premier destination for job opportunities. Connect with top companies and find your dream career with JobView.",
  keywords: ["jobs", "career", "employment", "job portal", "JobView"],
  authors: [{ name: "JobView Team" }],
  openGraph: {
    title: "JobView - India's Leading Job Portal",
    description: "Find your dream job with JobView. Browse thousands of opportunities from top companies.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`} suppressHydrationWarning>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
