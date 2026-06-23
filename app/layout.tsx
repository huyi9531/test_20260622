import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import GlobalNav from "@/components/GlobalNav"
import Footer from "@/components/Footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "证照优化大师 — AI驱动的专业证件照优化",
  description:
    "上传照片，选择背景色和服装，一键生成高质量证件照。AI驱动，专业品质。",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body>
        <GlobalNav />
        <main className="pt-11">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
