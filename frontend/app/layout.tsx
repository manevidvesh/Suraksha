import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SURAKSHA · Spatial Unified Risk Assessment & Habitation Relocation DSS',
  description: 'SURAKSHA: Intelligent Identification of Hazard-Based Red Zones & Settlement Housing Relocation DSS for Zone 7 Pilot Region',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F7F5F1] text-[#1C2420] min-h-screen">
        {children}
      </body>
    </html>
  );
}
