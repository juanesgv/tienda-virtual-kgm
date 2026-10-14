// Iconos de categoría dibujados en un mismo trazo (24x24, 1.75 px, esquinas redondeadas).
// Las categorías llevan un id estable en app/data/products.ts; si aparece una nueva sin icono se usa el genérico.
const PATHS: Record<string, React.ReactNode> = {
  frenos: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    </>
  ),
  filtros: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M6 8h12M6 16h12M10 11v2M14 11v2" />
    </>
  ),
  suspension: <path d="M12 3v3M8 6.5l8 2.5-8 3 8 3-8 2.5M12 17.5V21" />,
  motor: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
    </>
  ),
  transmision: (
    <>
      <circle cx="8" cy="12" r="4" />
      <circle cx="17" cy="8" r="3" />
      <circle cx="17" cy="17" r="3" />
    </>
  ),
  electricos: <path d="M13 2L5 14h6l-1 8 8-12h-6l1-8z" />,
  carroceria: (
    <>
      <path d="M3 15l2-6a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 9l2 6v3h-2.5v-1.5h-13V18H3z" />
      <circle cx="7.5" cy="14" r="1" />
      <circle cx="16.5" cy="14" r="1" />
    </>
  ),
};

export default function CategoryIcon({ id, size = 24 }: { id: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[id] ?? <circle cx="12" cy="12" r="9" />}
    </svg>
  );
}
