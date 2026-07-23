// app/layout.tsx
import type { Metadata } from 'next';
import '../global.css';

export const metadata: Metadata = {
  title: 'Helpdesk Management System',
  description: 'Internal Ticketing System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}
