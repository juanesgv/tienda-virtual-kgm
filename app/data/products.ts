// Datos genéricos de repuestos para la tienda KGM

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  price: number;
  description: string;
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
  compatibleVehicles: VehicleCompatibility[];
  specifications: Record<string, string>;
  image?: string;
}

const img = {
  brakePad:
    "https://images.unsplash.com/photo-1697855532251-8102356a2175?auto=format&fit=crop&w=1200&q=80",
  airFilter:
    "https://images.unsplash.com/photo-1720929617042-ac3ea5a6d1e2?auto=format&fit=crop&w=1200&q=80",
  battery:
    "https://images.unsplash.com/photo-1765211003026-f7666ea3a948?auto=format&fit=crop&w=1200&q=80",
  engineParts:
    "https://images.unsplash.com/photo-1753183514957-0e50d201a6fa?auto=format&fit=crop&w=1200&q=80",
  discBrake:
    "https://images.unsplash.com/photo-1751724193117-0a3f352c4a3f?auto=format&fit=crop&w=1200&q=80",
};

export interface VehicleCompatibility {
  brand: string;
  model: string;
  years: string;
  engine?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

// Categorías disponibles
export const categories: Category[] = [
  { id: 'frenos', name: 'Frenos', description: 'Discos, pastillas, calipers', icon: 'circle-notch', count: 245 },
  { id: 'filtros', name: 'Filtros', description: 'Aire, aceite, combustible', icon: 'filter', count: 189 },
  { id: 'suspension', name: 'Suspensión', description: 'Amortiguadores, bujes, terminales', icon: 'compress-arrows-alt', count: 312 },
  { id: 'motor', name: 'Motor', description: 'Correas, bujías, sensores', icon: 'cog', count: 428 },
  { id: 'transmision', name: 'Transmisión', description: 'Embrague, caja, diferencial', icon: 'cogs', count: 156 },
  { id: 'electricos', name: 'Sistema eléctrico', description: 'Baterías, alternadores, luces', icon: 'bolt', count: 267 },
  { id: 'carroceria', name: 'Carrocería', description: 'Parachoques, espejos, puertas', icon: 'car', count: 198 },
];

// Productos genéricos
export const products: Product[] = [
  {
    id: 'filtro-aire-1',
    name: 'Filtro de aire motor',
    sku: 'FA-23140-34010',
    category: 'filtros',
    subcategory: 'filtro-aire',
    price: 85000,
    description: 'Filtro de aire original para motores gasolina. Garantiza la máxima protección contra partículas contaminantes.',
    stock: 'in_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Tivoli', years: '2015 - 2024', engine: '1.6L Gasolina' },
      { brand: 'KGM', model: 'Tivoli XLV', years: '2016 - 2024', engine: '1.6L Gasolina' },
      { brand: 'SsangYong', model: 'Tivoli', years: '2015 - 2022', engine: '1.6L Gasolina' },
      { brand: 'SsangYong', model: 'Tivoli XLV', years: '2016 - 2022', engine: '1.6L Gasolina' },
    ],
    specifications: {
      referencia: 'FA-23140-34010',
      marca: 'KGM Original',
      tipo: 'Filtro de aire',
      material: 'Papel filtrante de alta eficiencia',
      dimensiones: '240mm x 180mm x 45mm',
      peso: '0.35 kg',
      garantia: '12 meses',
    },
    image: img.airFilter,
  },
  {
    id: 'pastillas-freno-1',
    name: 'Pastillas de freno delanteras',
    sku: 'BP-58101-C5100',
    category: 'frenos',
    subcategory: 'pastillas',
    price: 145000,
    description: 'Juego de pastillas de freno originales de alto rendimiento para condiciones normales de conducción.',
    stock: 'in_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Tivoli', years: '2015 - 2024' },
      { brand: 'KGM', model: 'Korando', years: '2019 - 2024' },
    ],
    specifications: {
      referencia: 'BP-58101-C5100',
      marca: 'KGM Original',
      posicion: 'Delantera',
      material: 'Cerámica orgánica',
      garantia: '12 meses',
    },
    image: img.brakePad,
  },
  {
    id: 'filtro-aceite-1',
    name: 'Filtro de aceite',
    sku: 'FO-26300-35504',
    category: 'filtros',
    subcategory: 'filtro-aceite',
    price: 45000,
    description: 'Filtro de aceite para motor diésel de alta capacidad de retención de partículas.',
    stock: 'low_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Tivoli', years: '2015 - 2024' },
      { brand: 'KGM', model: 'Rexton', years: '2018 - 2024' },
      { brand: 'SsangYong', model: 'Tivoli', years: '2015 - 2022' },
    ],
    specifications: {
      referencia: 'FO-26300-35504',
      marca: 'KGM Original',
      tipo: 'Filtro de aceite',
      capacidad: 'Alta capacidad',
      garantia: '12 meses',
    },
    image: img.engineParts,
  },
  {
    id: 'bateria-1',
    name: 'Batería 12V 65Ah',
    sku: 'BA-37110-C5100',
    category: 'electricos',
    subcategory: 'baterias',
    price: 520000,
    description: 'Batería de alto rendimiento para camionetas con tecnología de calcio-plata.',
    stock: 'in_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Tivoli', years: '2015 - 2024' },
      { brand: 'KGM', model: 'Tivoli XLV', years: '2016 - 2024' },
      { brand: 'KGM', model: 'Korando', years: '2019 - 2024' },
    ],
    specifications: {
      referencia: 'BA-37110-C5100',
      voltaje: '12V',
      amperaje: '65Ah',
      cca: '600A',
      garantia: '24 meses',
    },
    image: img.battery,
  },
  {
    id: 'correa-distribucion-1',
    name: 'Correa de distribución',
    sku: 'CM-67103-31010',
    category: 'motor',
    subcategory: 'correas',
    price: 280000,
    description: 'Correa de distribución de alta resistencia para motores gasolina.',
    stock: 'in_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Korando', years: '2019 - 2024' },
      { brand: 'SsangYong', model: 'Korando', years: '2017 - 2022' },
    ],
    specifications: {
      referencia: 'CM-67103-31010',
      tipo: 'Correa dentada',
      material: 'Caucho reforzado',
      garantia: '12 meses',
    },
    image: img.engineParts,
  },
  {
    id: 'amortiguador-1',
    name: 'Amortiguador delantero',
    sku: 'SH-45300-32020',
    category: 'suspension',
    subcategory: 'amortiguadores',
    price: 320000,
    description: 'Amortiguador de gas de alto rendimiento para mayor estabilidad y confort.',
    stock: 'in_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Tivoli', years: '2015 - 2024' },
      { brand: 'KGM', model: 'Tivoli XLV', years: '2016 - 2024' },
    ],
    specifications: {
      referencia: 'SH-45300-32020',
      posicion: 'Delantero',
      tipo: 'Gas presurizado',
      garantia: '18 meses',
    },
    image: img.engineParts,
  },
  {
    id: 'filtro-combustible-1',
    name: 'Filtro de combustible',
    sku: 'FC-68102-31020',
    category: 'filtros',
    subcategory: 'filtro-combustible',
    price: 95000,
    description: 'Filtro de combustible original para motores diésel y gasolina.',
    stock: 'in_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Tivoli', years: '2015 - 2024' },
      { brand: 'KGM', model: 'Rexton', years: '2018 - 2024' },
      { brand: 'KGM', model: 'Musso', years: '2018 - 2024' },
    ],
    specifications: {
      referencia: 'FC-68102-31020',
      tipo: 'Filtro de combustible',
      compatible: 'Diésel y Gasolina',
      garantia: '12 meses',
    },
    image: img.engineParts,
  },
  {
    id: 'filtro-cabina-1',
    name: 'Filtro de cabina',
    sku: 'AC-97103-31010',
    category: 'filtros',
    subcategory: 'filtro-cabina',
    price: 65000,
    description: 'Filtro de aire acondicionado con carbón activado para eliminar olores.',
    stock: 'in_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Tivoli', years: '2015 - 2024' },
      { brand: 'KGM', model: 'Tivoli XLV', years: '2016 - 2024' },
    ],
    specifications: {
      referencia: 'AC-97103-31010',
      tipo: 'Filtro de cabina',
      caracteristica: 'Carbón activado',
      garantia: '12 meses',
    },
    image: img.airFilter,
  },
  {
    id: 'disco-freno-1',
    name: 'Disco de freno delantero',
    sku: 'BD-58101-D5100',
    category: 'frenos',
    subcategory: 'discos',
    price: 280000,
    description: 'Disco de freno ventilado de alto rendimiento con tratamiento anticorrosión.',
    stock: 'low_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Tivoli', years: '2015 - 2024' },
      { brand: 'KGM', model: 'Korando', years: '2019 - 2024' },
    ],
    specifications: {
      referencia: 'BD-58101-D5100',
      posicion: 'Delantero',
      tipo: 'Ventilado',
      diametro: '300mm',
      garantia: '12 meses',
    },
    image: img.discBrake,
  },
  {
    id: 'bujia-1',
    name: 'Bujía de encendido',
    sku: 'SP-18846-11160',
    category: 'motor',
    subcategory: 'bujias',
    price: 75000,
    description: 'Bujía de iridio de larga duración para motores gasolina.',
    stock: 'in_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Tivoli', years: '2015 - 2024' },
      { brand: 'KGM', model: 'Tivoli XLV', years: '2016 - 2024' },
      { brand: 'SsangYong', model: 'Tivoli', years: '2015 - 2022' },
    ],
    specifications: {
      referencia: 'SP-18846-11160',
      tipo: 'Iridio',
      duracion: '100,000 km',
      garantia: '12 meses',
    },
    image: img.engineParts,
  },
  {
    id: 'alternador-1',
    name: 'Alternador 90A',
    sku: 'AL-67202-31030',
    category: 'electricos',
    subcategory: 'alternadores',
    price: 1250000,
    description: 'Alternador reconstruido con componentes originales y garantía extendida.',
    stock: 'in_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Rexton', years: '2018 - 2024' },
      { brand: 'SsangYong', model: 'Rexton', years: '2017 - 2022' },
    ],
    specifications: {
      referencia: 'AL-67202-31030',
      amperaje: '90A',
      voltaje: '12V',
      garantia: '12 meses',
    },
    image: img.engineParts,
  },
  {
    id: 'embrague-1',
    name: 'Kit de embrague',
    sku: 'CL-30200-32040',
    category: 'transmision',
    subcategory: 'embragues',
    price: 890000,
    description: 'Kit completo de embrague: disco, plato y collarín. Componentes originales.',
    stock: 'in_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Tivoli', years: '2015 - 2024' },
      { brand: 'KGM', model: 'Korando', years: '2019 - 2024' },
    ],
    specifications: {
      referencia: 'CL-30200-32040',
      componentes: 'Disco, plato, collarín',
      garantia: '12 meses',
    },
    image: img.engineParts,
  },
];

// Funciones de utilidad
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(p => p.category === categoryId);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.sku.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  );
}

export function isProductCompatible(product: Product, vehicle: { brand: string; model: string; year: number }): boolean {
  return product.compatibleVehicles.some(v =>
    v.brand.toLowerCase() === vehicle.brand.toLowerCase() &&
    v.model.toLowerCase() === vehicle.model.toLowerCase()
  );
}

export function getCompatibleProducts(vehicle: { brand: string; model: string; year: number }): Product[] {
  return products.filter(p => isProductCompatible(p, vehicle));
}
