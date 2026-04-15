"use client";

import Image from "next/image";
import Link from "next/link";
import kgmLogo from "../kgm-logo.png";
import kgmLogoWhite from "../kgm-logo-white.png";

type BrandLogoProps = {
  href?: string;
  className?: string;
  priority?: boolean;
  size?: "header" | "footer";
  variant?: "default" | "white";
};

export function BrandLogo({
  href = "/",
  className = "",
  priority = false,
  size = "header",
  variant = "default",
}: BrandLogoProps) {
  const logoClassName = ["logo", `logo-${size}`, className].filter(Boolean).join(" ");
  const logoSrc = variant === "white" ? kgmLogoWhite : kgmLogo;
  const logoAlt = variant === "white" ? "Logo oficial SsangYong KGM en blanco" : "Logo oficial SsangYong KGM";

  return (
    <Link href={href} className={logoClassName} aria-label="Ir al inicio de KGM Repuestos">
      <Image
        src={logoSrc}
        alt={logoAlt}
        className="logo-mark"
        priority={priority}
        sizes={size === "header" ? "(max-width: 768px) 180px, 220px" : "(max-width: 768px) 150px, 190px"}
      />
    </Link>
  );
}
