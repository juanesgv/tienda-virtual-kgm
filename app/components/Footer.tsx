"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { useServiceStatus } from "../context/ServiceStatusContext";
import { useAdvisor } from "../context/AdvisorContext";

export default function Footer() {
  const { isInventoryDown, toggleInventoryDown } = useServiceStatus();
  const { openAdvisor } = useAdvisor();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <BrandLogo size="footer" variant="white" />
          <p>Tienda oficial de repuestos genuinos KGM en Colombia. Compatible con vehículos SsangYong.</p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Categorías</h4>
            <Link href="/repuestos?categoria=frenos">Frenos</Link>
            <Link href="/repuestos?categoria=suspension">Suspensión</Link>
            <Link href="/repuestos?categoria=motor">Motor</Link>
            <Link href="/repuestos?categoria=filtros">Filtros</Link>
          </div>
          <div className="footer-column">
            <h4>Mi tienda</h4>
            <Link href="/repuestos">Catálogo de repuestos</Link>
            <Link href="/cuenta">Mi cuenta y pedidos</Link>
            <Link href="/carrito">Mi carrito</Link>
          </div>
          <div className="footer-column">
            <h4>Contacto</h4>
            {/* E54: los tres canales abren el mismo flujo de asesoría simulado; el canal real está por definir */}
            <button type="button" onClick={() => openAdvisor({ origin: "footer" })}>Línea de atención</button>
            <button type="button" onClick={() => openAdvisor({ origin: "footer" })}>WhatsApp</button>
            <button type="button" onClick={() => openAdvisor({ origin: "footer" })}>Correo electrónico</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 KGM Repuestos Colombia. Todos los derechos reservados.</p>
        {/* HU-E40: interruptor de demo para presentar el escenario "catálogo/SIISA caído" */}
        <Link href="/asesoria/registro" className="demo-toggle">Demo: registro de solicitudes de asesoría</Link>
        <button type="button" className="demo-toggle" onClick={toggleInventoryDown}>
          <span className={`demo-toggle-dot ${isInventoryDown ? "on" : ""}`} />
          Modo demo: simular fallo del catálogo {isInventoryDown ? "(activo)" : ""}
        </button>
      </div>
    </footer>
  );
}
