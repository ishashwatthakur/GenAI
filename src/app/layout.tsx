import type { Metadata } from 'next';
import { poppins } from './fonts';
import "./globals.css";

export const metadata: Metadata = {
  title: "Lexi - A Legal Guardian",
  description: "AI-powered legal document analysis that empowers you to understand complex contracts",
  icons: {
    icon: [
      {
        url: '/logo.png',
        type: 'image/png',
      }
    ],
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
        />
        <link 
          href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' 
          rel='stylesheet' 
        />
      </head>
      <body className={`${poppins.className} min-h-screen bg-gray-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}