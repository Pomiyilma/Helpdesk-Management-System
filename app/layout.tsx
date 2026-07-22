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
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}
