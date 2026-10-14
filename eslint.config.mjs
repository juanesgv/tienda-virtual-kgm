import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// Next 16 ya no incluye `next lint`: se usa ESLint directamente con las configuraciones de eslint-config-next.
const config = [
  ...coreWebVitals,
  ...typescript,
  {
    // Carpetas que no son código de la tienda (herramientas, propuestas y salidas de build)
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      ".claude/**",
      ".impeccable/**",
      "propuesta-rediseño/**",
    ],
  },
  {
    rules: {
      // Deuda conocida y deliberada: los contextos leen localStorage al montar para hidratar el estado
      // (el prototipo no tiene backend). Resolverlo bien (useSyncExternalStore o inicializadores diferidos)
      // es un refactor propio, así que se mantiene visible como aviso y no como error.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default config;
