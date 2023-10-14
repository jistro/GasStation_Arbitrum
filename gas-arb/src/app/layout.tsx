import './globals.css'
import type { Metadata } from 'next'
import { Mulish } from 'next/font/google'
import Head from 'next/head';

const mulish = Mulish({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Gas hub",
  description: "Gas hub is a tool for Arbitrum users to find the gas prices and gas fees for their transactions.",
  applicationName: "Gas hub",
  keywords: "gas, fees, transactions, arbitrum, ethereum, blockchain, crypto, cryptocurrency, gas hub",
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      
      <head>
        <link rel="icon" href="/arbitrum-shield.svg" />
      </head>
      <body className={mulish.className}>{children}</body>
    </html>
  )
}
