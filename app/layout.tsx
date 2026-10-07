import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { VehicleProvider } from "./context/VehicleContext";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { ServiceStatusProvider } from "./context/ServiceStatusContext";
import { AdvisorProvider } from "./context/AdvisorContext";
import { Header } from "./components/Header";
import Footer from "./components/Footer";

// Inter servida por Next (sin petición externa en el navegador); se expone como variable CSS para --font-sans
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata = {
  title: "KGM Repuestos | Tienda oficial Colombia",
  description:
    "Tienda oficial de repuestos KGM. Explora nuestro catálogo completo de repuestos genuinos compatibles con SsangYong y KGM.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // Extensiones del navegador (p. ej. LanguageTool) agregan atributos a <html>/<body> antes de hidratar;
    // suppressHydrationWarning solo silencia la diferencia de atributos en estos dos nodos, no en sus hijos.
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        <ServiceStatusProvider>
          <UserProvider>
            <VehicleProvider>
              <CartProvider>
                <AdvisorProvider>
                  <Header />
                  <main>{children}</main>
                  <Footer />
                </AdvisorProvider>
              </CartProvider>
            </VehicleProvider>
          </UserProvider>
        </ServiceStatusProvider>
      </body>
    </html>
  );
}
