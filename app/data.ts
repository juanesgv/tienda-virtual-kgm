export type VehicleModel = "Tivoli" | "Korando" | "Rexton";

export type VehicleSelection = {
  plate?: string;
  vin?: string;
  model?: VehicleModel;
  year?: number;
};

export type Product = {
  id: string;
  name: string;
  category: "Frenos" | "Filtros" | "Suspensión" | "Accesorios";
  system: "Frenos" | "Motor" | "Suspensión" | "Accesorios";
  type: "Repuesto original" | "Accesorio" | "Mantenimiento" | "Kit";
  price: number;
  featured?: boolean;
  description: string;
  compatibility: {
    model: VehicleModel;
    fromYear: number;
    toYear: number;
  }[];
};

export const products: Product[] = [
  {
    id: "kit-pastillas-tivoli",
    name: "Kit pastillas de freno delantera Tivoli",
    category: "Frenos",
    system: "Frenos",
    type: "Repuesto original",
    price: 420000,
    featured: true,
    description:
      "Juego de pastillas de freno delanteras para camionetas KGM Tivoli, con frenado progresivo y menor ruido.",
    compatibility: [
      { model: "Tivoli", fromYear: 2022, toYear: 2024 },
      { model: "Korando", fromYear: 2021, toYear: 2023 },
    ],
  },
  {
    id: "filtro-aire-16",
    name: "Filtro de aire motor 1.6",
    category: "Filtros",
    system: "Motor",
    type: "Mantenimiento",
    price: 95000,
    featured: true,
    description:
      "Filtro de aire para motores 1.6 gasolina. Recomendado para mantenimiento anual.",
    compatibility: [
      { model: "Tivoli", fromYear: 2020, toYear: 2024 },
      { model: "Korando", fromYear: 2019, toYear: 2023 },
    ],
  },
  {
    id: "amortiguador-delantero-gas",
    name: "Amortiguador delantero gas",
    category: "Suspensión",
    system: "Suspensión",
    type: "Repuesto original",
    price: 380000,
    featured: true,
    description: "Amortiguador delantero a gas para mayor confort y estabilidad.",
    compatibility: [
      { model: "Rexton", fromYear: 2018, toYear: 2024 },
      { model: "Korando", fromYear: 2020, toYear: 2024 },
    ],
  },
  {
    id: "kit-tapetes-premium",
    name: "Kit tapetes interiores premium",
    category: "Accesorios",
    system: "Accesorios",
    type: "Accesorio",
    price: 210000,
    featured: true,
    description: "Juego de tapetes a la medida para cabina delantera y trasera.",
    compatibility: [
      { model: "Tivoli", fromYear: 2019, toYear: 2024 },
      { model: "Korando", fromYear: 2019, toYear: 2024 },
      { model: "Rexton", fromYear: 2018, toYear: 2024 },
    ],
  },
];

export function formatCurrency(value: number): string {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export function isProductCompatible(
  product: Product,
  vehicle: VehicleSelection | null
): boolean {
  if (!vehicle?.model || vehicle.year == null) return false;
  const year = vehicle.year;
  return product.compatibility.some(
    (rule) =>
      rule.model === vehicle.model &&
      year >= rule.fromYear &&
      year <= rule.toYear
  );
}

