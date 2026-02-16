
import type { Metadata } from "next";
import { Oswald, Rajdhani } from "next/font/google"; // Industrial & Tech fonts
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ['400', '500', '600', '700'],
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-tech",
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Aerotech Drones | Pulverização e Dispersão de Precisão",
  description: "Tecnologia, Economia e Resultado no Campo. Serviços de Drones Agrícolas no Maranhão (Zé Doca, Buriticupu e Região).",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Aerotech Drones | Pulverização de Alta Precisão",
    description: "Elimine o amassamento e aumente sua produtividade em até 5%. Tecnologia de ponta para o produtor rural maranhense.",
    url: "https://aerotechdronebrasil.com.br",
    siteName: "Aerotech Drones Brasil",
    images: [
      {
        url: "/assets/images/og-image.jpg", // We need to make sure this exists or use a fallback
        width: 1200,
        height: 630,
        alt: "Aerotech Drones - Tecnologia no Campo",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aerotech Drones | Tecnologia no Campo",
    description: "Serviços de pulverização e semeadura com drones agrícolas. Economia e produtividade.",
    images: ["/assets/images/og-image.jpg"],
  },
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased flex flex-col selection:bg-primary selection:text-black",
        oswald.variable,
        rajdhani.variable
      )}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
