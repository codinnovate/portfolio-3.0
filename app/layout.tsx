import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Samuel Adeyemi - Frontend Engineer (Web & Mobile)',
  description: 'Portfolio of Samuel Adeyemi, a passionate Frontend Engineer creating beautiful web applications.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0d1117] antialiased`}>{children}</body>
    </html>
  );
}