"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export default function Footer() {
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
            <h4>Ayuda</h4>
            <Link href="#">Cómo comprar</Link>
            <Link href="#">Compatibilidad</Link>
            <Link href="#">Envíos</Link>
            <Link href="#">Devoluciones</Link>
          </div>
          <div className="footer-column">
            <h4>Contacto</h4>
            <Link href="#">Línea de atención</Link>
            <Link href="#">WhatsApp</Link>
            <Link href="#">Correo electrónico</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 KGM Repuestos Colombia. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
