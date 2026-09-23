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
  // HU-E07-02: simula que la ficha de compatibilidad de este producto en SIISA está incompleta.
  // false = no se puede afirmar ni negar compatibilidad para vehículos que no están en la lista
  // (en vez de asumir "no compatible" por defecto). Si se omite, se asume true (dato verificado).
  compatibilityVerified?: boolean;
  // HU-E06-04/E13-02: unidades reales disponibles. Si se omite, no se limita la cantidad en el carrito.
  stockQuantity?: number;
  // HU-E13-01: referencia descontinuada — nunca debe aparecer en catálogo, búsqueda ni categorías,
  // pero sigue siendo accesible por enlace directo (ej. un bookmark viejo) con un estado propio.
  discontinued?: boolean;
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

// Productos genéricos (incluye descontinuados; usar `products` para catálogo/búsqueda)
export const allProducts: Product[] = [
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
    // HU-E13-01: simula una referencia descontinuada, para demostrar que desaparece del catálogo/búsqueda.
    discontinued: true,
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
    stockQuantity: 3,
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
    // Simula un hueco real de datos en SIISA: solo se registró Korando, sin confirmar si aplica a otros modelos del motor.
    compatibilityVerified: false,
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
    stockQuantity: 2,
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
    stock: 'out_of_stock',
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

// HU-E13-01: catálogo/búsqueda nunca muestran referencias descontinuadas.
export const products: Product[] = allProducts.filter(p => !p.discontinued);

// Funciones de utilidad
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Busca en TODO el catálogo (incluye descontinuados) para que un enlace directo antiguo
// siga resolviendo a la ficha del producto, aunque ya no aparezca en catálogo ni búsqueda.
export function getProductById(id: string): Product | undefined {
  return allProducts.find(p => p.id === id);
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

// HU-E04-01/04: búsqueda general por nombre, categoría o código de parte
// HU-E04-01: si la búsqueda incluye un modelo de vehículo (ej. "retrovisor Korando"),
// los repuestos compatibles con ese modelo se priorizan sobre el resto.
export function searchProductsFull(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  const scored = products
    .map(p => {
      const matchesCore =
        p.name.toLowerCase().includes(lowerQuery) ||
        p.sku.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.subcategory.toLowerCase().includes(lowerQuery);
      const matchesVehicle = p.compatibleVehicles.some(v =>
        v.brand.toLowerCase().includes(lowerQuery) || v.model.toLowerCase().includes(lowerQuery)
      );
      if (!matchesCore && !matchesVehicle) return null;
      return { product: p, score: matchesCore ? 2 : 1 };
    })
    .filter((entry): entry is { product: Product; score: number } => entry !== null);

  scored.sort((a, b) => b.score - a.score);
  return scored.map(entry => entry.product);
}

function normalizeTerm(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function levenshteinDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[rows - 1][cols - 1];
}

// Vocabulario simulado para tolerancia a errores tipográficos (HU-E04-02).
// En producción esto lo resolvería un motor de búsqueda dedicado (decisión abierta en Notion).
let cachedVocabulary: string[] | null = null;
function getVocabulary(): string[] {
  if (cachedVocabulary) return cachedVocabulary;
  const terms = new Set<string>();
  products.forEach(p => {
    p.name.split(/\s+/).forEach(w => terms.add(normalizeTerm(w)));
    terms.add(normalizeTerm(p.category));
    terms.add(normalizeTerm(p.subcategory));
    p.compatibleVehicles.forEach(v => {
      terms.add(normalizeTerm(v.brand));
      v.model.split(/\s+/).forEach(w => terms.add(normalizeTerm(w)));
    });
  });
  categories.forEach(c => c.name.split(/\s+/).forEach(w => terms.add(normalizeTerm(w))));
  cachedVocabulary = Array.from(terms).filter(t => t.length >= 3);
  return cachedVocabulary;
}

export interface SmartSearchResult {
  results: Product[];
  correctedQuery: string | null;
}

// HU-E04-02: si la búsqueda literal no arroja nada, intenta corregir términos
// con error tipográfico contra un vocabulario conocido de productos/vehículos/categorías.
export function searchProductsSmart(query: string): SmartSearchResult {
  const trimmed = query.trim();
  if (!trimmed) return { results: [], correctedQuery: null };

  const exact = searchProductsFull(trimmed);
  if (exact.length > 0) return { results: exact, correctedQuery: null };

  const vocabulary = getVocabulary();
  const words = trimmed.split(/\s+/);
  let corrected = false;

  const correctedWords = words.map(word => {
    const normalized = normalizeTerm(word);
    if (normalized.length < 3) return word;
    if (vocabulary.some(term => term.includes(normalized) || normalized.includes(term))) return word;

    let bestTerm: string | null = null;
    let bestDistance = Infinity;
    for (const term of vocabulary) {
      const distance = levenshteinDistance(normalized, term);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestTerm = term;
      }
    }

    const threshold = Math.max(1, Math.floor(normalized.length * 0.34));
    if (bestTerm && bestDistance > 0 && bestDistance <= threshold) {
      corrected = true;
      return bestTerm;
    }
    return word;
  });

  if (!corrected) return { results: [], correctedQuery: null };

  const correctedQuery = correctedWords.join(' ');
  const fuzzyResults = searchProductsFull(correctedQuery);
  if (fuzzyResults.length === 0) return { results: [], correctedQuery: null };

  return { results: fuzzyResults, correctedQuery };
}

export interface SearchSuggestion {
  label: string;
  type: 'product' | 'category';
  href: string;
}

// HU-E04-03: sugerencias en vivo mientras el usuario escribe.
export function getSearchSuggestions(query: string, limit = 6): SearchSuggestion[] {
  const q = normalizeTerm(query);
  if (q.length < 2) return [];

  const suggestions: SearchSuggestion[] = [];

  for (const category of categories) {
    if (normalizeTerm(category.name).includes(q)) {
      suggestions.push({ label: category.name, type: 'category', href: `/repuestos?categoria=${category.id}` });
    }
  }

  for (const product of products) {
    if (suggestions.length >= limit) break;
    if (normalizeTerm(product.name).includes(q) || normalizeTerm(product.sku).includes(q)) {
      suggestions.push({ label: product.name, type: 'product', href: `/repuestos/${product.id}` });
    }
  }

  return suggestions.slice(0, limit);
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

// HU-E07-02: estado de compatibilidad de 3 valores. "unknown" ocurre cuando el vehículo no
// aparece en la lista de compatibles Y el producto tiene datos de SIISA marcados como incompletos
// (compatibilityVerified === false) — nunca debe presentarse como "no compatible".
export type CompatibilityStatus = 'compatible' | 'not_compatible' | 'unknown';

export function getCompatibilityStatus(
  product: Product,
  vehicle: { brand: string; model: string; year: number }
): CompatibilityStatus {
  if (isProductCompatible(product, vehicle)) return 'compatible';
  if (product.compatibilityVerified === false) return 'unknown';
  return 'not_compatible';
}
