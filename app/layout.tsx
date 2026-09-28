import type { ReactNode } from "react";
import "./globals.css";
import { VehicleProvider } from "./context/VehicleContext";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { ServiceStatusProvider } from "./context/ServiceStatusContext";
import { AdvisorProvider } from "./context/AdvisorContext";
import { Header } from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "KGM Repuestos | Tienda oficial Colombia",
  description:
    "Tienda oficial de repuestos KGM. Explora nuestro catálogo completo de repuestos genuinos compatibles con SsangYong y KGM.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // Extensiones del navegador (p. ej. LanguageTool) agregan atributos a <html>/<body> antes de hidratar;
    // suppressHydrationWarning solo silencia la diferencia de atributos en estos dos nodos, no en sus hijos.
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
