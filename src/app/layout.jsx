import "./globals.css";
import Chatbot from "../components/chatbot/ChatBot";

export const metadata = {
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon Links - Updated with timestamp trick */}
        <link rel="icon" href="/logo.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png?v=2" />
        <link rel="shortcut icon" href="/logo.png?v=2" />
        
        {/* Font Links */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
        />
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
          {children}
      </body>
    </html>
  );
}