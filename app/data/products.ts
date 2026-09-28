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
  // HU-E06-04/E13-02: unidades reales disponibles. Si se omite, no se limita la cantidad en el carrito.
  stockQuantity?: number;
  // HU-E13-01: referencia descontinuada — nunca debe aparecer en catálogo, búsqueda ni categorías,
  // pero sigue siendo accesible por enlace directo (ej. un bookmark viejo) con un estado propio.
  discontinued?: boolean;
  // E55 (posible funcionalidad, dato aún sin dueño): relaciones curadas a mano. Si se omite, NO significa
  // que no falte nada: significa que no hay información cargada (HU-E55-03).
  relations?: ProductRelation[];
  // Instalación compleja: si no hay relaciones cargadas, se ofrece consultar con un asesor (HU-E55-03).
  complexInstall?: boolean;
}

// HU-E55-02: tipos de relación candidatos según Notion (la lista definitiva la define Posventa).
export type ProductRelationType = 'required' | 'replaced_together' | 'recommended';

export interface ProductRelation {
  productId: string;
  type: ProductRelationType;
  /** HU-E55-02: por qué se necesita o se recomienda */
  reason: string;
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
    relations: [
      { productId: 'aceite-motor-1', type: 'required', reason: 'Al cambiar el filtro se drena el aceite del motor; sin aceite nuevo la instalación no se completa.' },
    ],
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
    // Simula "sin datos" (Modelo conceptual §3): referencia sin aplicabilidad cargada en SIISA.
    // Es deuda de datos, no un caso de negocio estable.
    compatibleVehicles: [],
    specifications: {
      referencia: 'CM-67103-31010',
      tipo: 'Correa dentada',
      material: 'Caucho reforzado',
      garantia: '12 meses',
    },
    image: img.engineParts,
    complexInstall: true,
    relations: [
      { productId: 'tensor-correa-1', type: 'required', reason: 'Se cambia junto con la correa: un tensor desgastado vuelve a dañar la correa nueva.' },
      { productId: 'bomba-agua-1', type: 'replaced_together', reason: 'Comparte el acceso con la correa; se suele cambiar en la misma intervención para no desarmar dos veces.' },
    ],
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
    complexInstall: true,
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
    complexInstall: true,
    relations: [
      { productId: 'pastillas-freno-1', type: 'replaced_together', reason: 'Discos y pastillas se reemplazan juntos.' },
      { productId: 'liquido-frenos-1', type: 'recommended', reason: 'Conviene revisarlo al intervenir el sistema de frenos; no es indispensable para instalar el disco.' },
    ],
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
    complexInstall: true,
  },
  // Complementos de ejemplo para E55 (curaduría ilustrativa, por validar con Posventa)
  {
    id: 'tensor-correa-1',
    name: 'Tensor de correa de distribución',
    sku: 'TN-67104-31020',
    category: 'motor',
    subcategory: 'correas',
    price: 190000,
    description: 'Tensor con rodamiento para correa de distribución.',
    stock: 'in_stock',
    compatibleVehicles: [{ brand: 'KGM', model: 'Tivoli', years: '2015 - 2024' }],
    specifications: { referencia: 'TN-67104-31020', tipo: 'Tensor con rodamiento', garantia: '12 meses' },
    image: img.engineParts,
  },
  {
    id: 'bomba-agua-1',
    name: 'Bomba de agua',
    sku: 'BA-21100-32080',
    category: 'motor',
    subcategory: 'refrigeracion',
    price: 320000,
    description: 'Bomba de agua para el sistema de refrigeración del motor.',
    stock: 'out_of_stock',
    compatibleVehicles: [{ brand: 'KGM', model: 'Tivoli', years: '2015 - 2024' }],
    specifications: { referencia: 'BA-21100-32080', tipo: 'Mecánica', garantia: '12 meses' },
    image: img.engineParts,
  },
  {
    id: 'aceite-motor-1',
    name: 'Aceite de motor 5W-30 (4 L)',
    sku: 'AM-00530-4L',
    category: 'motor',
    subcategory: 'lubricantes',
    price: 165000,
    description: 'Aceite sintético 5W-30 para motores gasolina y diésel.',
    stock: 'in_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Tivoli', years: '2015 - 2024' },
      { brand: 'KGM', model: 'Korando', years: '2019 - 2024' },
      { brand: 'KGM', model: 'Rexton', years: '2018 - 2024' },
    ],
    specifications: { referencia: 'AM-00530-4L', viscosidad: '5W-30', contenido: '4 L' },
    image: img.engineParts,
  },
  {
    id: 'liquido-frenos-1',
    name: 'Líquido de frenos DOT 4',
    sku: 'LF-DOT4-500',
    category: 'frenos',
    subcategory: 'liquidos',
    price: 38000,
    description: 'Líquido de frenos DOT 4, envase de 500 ml.',
    stock: 'in_stock',
    compatibleVehicles: [
      { brand: 'KGM', model: 'Tivoli', years: '2015 - 2024' },
      { brand: 'KGM', model: 'Korando', years: '2019 - 2024' },
      { brand: 'KGM', model: 'Rexton', years: '2018 - 2024' },
    ],
    specifications: { referencia: 'LF-DOT4-500', norma: 'DOT 4', contenido: '500 ml' },
    image: img.discBrake,
  },
];

// HU-E13-01: catálogo/búsqueda nunca muestran referencias descontinuadas.
export const products: Product[] = allProducts.filter(p => !p.discontinued);

const categoryDefinitions: Omit<Category, 'count'>[] = [
  { id: 'frenos', name: 'Frenos', description: 'Discos, pastillas, calipers', icon: 'circle-notch' },
  { id: 'filtros', name: 'Filtros', description: 'Aire, aceite, combustible', icon: 'filter' },
  { id: 'suspension', name: 'Suspensión', description: 'Amortiguadores, bujes, terminales', icon: 'compress-arrows-alt' },
  { id: 'motor', name: 'Motor', description: 'Correas, bujías, sensores', icon: 'cog' },
  { id: 'transmision', name: 'Transmisión', description: 'Embrague, caja, diferencial', icon: 'cogs' },
  { id: 'electricos', name: 'Sistema eléctrico', description: 'Baterías, alternadores, luces', icon: 'bolt' },
  { id: 'carroceria', name: 'Carrocería', description: 'Parachoques, espejos, puertas', icon: 'car' },
];

// El contador sale de los productos realmente visibles en el catálogo (sin descontinuados)
export const categories: Category[] = categoryDefinitions.map((c) => ({
  ...c,
  count: products.filter((p) => p.category === c.id).length,
}));


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
const STOPWORDS = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'para', 'con', 'y', 'en', 'a', 'al', 'un', 'una', 'mi', 'por']);
const YEAR_TOKEN = /^(19|20)\d{2}$/;

// Plurales simples ("pastillas" → "pastilla", "amortiguadores" → "amortiguador")
function stemToken(token: string): string {
  if (token.length > 5 && token.endsWith('es')) return token.slice(0, -2);
  if (token.length > 4 && token.endsWith('s')) return token.slice(0, -1);
  return token;
}

function includesToken(text: string, token: string): boolean {
  return text.includes(token) || text.includes(stemToken(token));
}

function tokenizeQuery(query: string): string[] {
  return normalizeTerm(query).split(/\s+/).filter(t => t && !STOPWORDS.has(t));
}

// Palabras que identifican vehículos (marcas y modelos presentes en el catálogo)
let cachedVehicleTerms: Set<string> | null = null;
function getVehicleTerms(): Set<string> {
  if (cachedVehicleTerms) return cachedVehicleTerms;
  const terms = new Set<string>();
  products.forEach(p =>
    p.compatibleVehicles.forEach(v => {
      normalizeTerm(v.brand).split(/\s+/).forEach(w => terms.add(w));
      normalizeTerm(v.model).split(/\s+/).forEach(w => terms.add(w));
    })
  );
  cachedVehicleTerms = terms;
  return terms;
}

function getSearchFields(p: Product) {
  const categoryName = categories.find(c => c.id === p.category)?.name ?? p.category;
  return {
    strong: normalizeTerm(`${p.name} ${p.sku} ${categoryName} ${p.subcategory.replace(/-/g, ' ')}`),
    weak: normalizeTerm(p.description),
    vehicle: normalizeTerm(p.compatibleVehicles.map(v => `${v.brand} ${v.model}`).join(' ')),
  };
}

// HU-E04-01: la consulta se interpreta por palabras, no como una cadena completa.
// - Cada palabra del repuesto ("filtro", "pastillas", "aire") debe aparecer en nombre, referencia, categoría o descripción.
// - Las palabras que nombran un vehículo ("Tivoli", "Korando") y los años PRIORIZAN, no excluyen:
//   los repuestos de ese modelo van primero (Modelo conceptual §1). Si la consulta es solo un vehículo, se listan sus repuestos.
export function searchProductsFull(query: string): Product[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return [];

  const vehicleTerms = getVehicleTerms();
  const yearTokens = tokens.filter(t => YEAR_TOKEN.test(t)).map(Number);
  const vehicleTokens = tokens.filter(t => vehicleTerms.has(t));
  const partTokens = tokens.filter(t => !vehicleTerms.has(t) && !YEAR_TOKEN.test(t));

  const scored: { product: Product; score: number }[] = [];

  for (const p of products) {
    const fields = getSearchFields(p);
    let score = 0;
    let matchesAllParts = true;

    for (const token of partTokens) {
      if (includesToken(fields.strong, token)) score += 3;
      else if (includesToken(fields.weak, token)) score += 1;
      else {
        matchesAllParts = false;
        break;
      }
    }
    if (!matchesAllParts) continue;

    const vehicleHits = vehicleTokens.filter(t => includesToken(fields.vehicle, t)).length;

    if (partTokens.length === 0) {
      // Solo vehículo: todos los términos de vehículo deben coincidir
      if (vehicleTokens.length === 0 || vehicleHits < vehicleTokens.length) continue;
    }

    score += vehicleHits * 2;
    if (yearTokens.some(year => p.compatibleVehicles.some(v => yearInRange(v.years, year)))) score += 1;

    scored.push({ product: p, score });
  }

  return scored
    .map((entry, index) => ({ ...entry, index }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(entry => entry.product);
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
    if (normalized.length < 3 || STOPWORDS.has(normalized) || YEAR_TOKEN.test(normalized)) return word;
    if (vocabulary.some(term => term.includes(normalized) || normalized.includes(term))) return word;
    if (products.some(p => includesToken(getSearchFields(p).strong, normalized))) return word;

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

  // Varias palabras en cualquier orden: "aire filtro" también sugiere "Filtro de aire motor"
  const tokens = q.split(/\s+/).filter(Boolean);
  const matchesAll = (text: string) => tokens.every(t => text.includes(t));

  const suggestions: SearchSuggestion[] = [];

  for (const category of categories) {
    if (matchesAll(normalizeTerm(category.name))) {
      suggestions.push({ label: category.name, type: 'category', href: `/repuestos?categoria=${category.id}` });
    }
  }

  for (const product of products) {
    if (suggestions.length >= limit) break;
    if (matchesAll(normalizeTerm(`${product.name} ${product.sku}`))) {
      suggestions.push({ label: product.name, type: 'product', href: `/repuestos/${product.id}` });
    }
  }

  return suggestions.slice(0, limit);
}

export interface VehicleLike {
  brand: string;
  model: string;
  year: number;
  engine?: string;
}

// Modelo conceptual §2–3: aplicabilidad (atributo del repuesto) vs compatibilidad (evaluación contra el vehículo activo).
// - compatible: hay dato y coincide en marca, modelo, año y (si el dato lo exige) motor.
// - not_compatible: hay dato y no coincide (modelo ausente, año fuera de rango o motor distinto).
// - unknown ("sin datos"): no hay aplicabilidad cargada, o depende de un motor que el usuario no confirmó.
export type CompatibilityStatus = 'compatible' | 'not_compatible' | 'unknown';

export type CompatibilityReason =
  | 'match'
  | 'no_data'
  | 'model_not_listed'
  | 'year_out_of_range'
  | 'engine_mismatch'
  | 'engine_unconfirmed';

export interface CompatibilityDetail {
  status: CompatibilityStatus;
  reason: CompatibilityReason;
  /** Rangos de años declarados para el modelo, cuando el motivo es "año fuera de rango". */
  applicableYears?: string;
}

function yearInRange(years: string, year: number): boolean {
  const range = years.match(/(\d{4})\s*-\s*(\d{4})/);
  if (!range) return true; // rango ilegible: no se usa para descartar
  return year >= parseInt(range[1]) && year <= parseInt(range[2]);
}

export function getCompatibilityDetail(product: Product, vehicle: VehicleLike): CompatibilityDetail {
  if (product.compatibleVehicles.length === 0) {
    return { status: 'unknown', reason: 'no_data' };
  }

  const sameModel = product.compatibleVehicles.filter(v =>
    v.brand.toLowerCase() === vehicle.brand.toLowerCase() &&
    v.model.toLowerCase() === vehicle.model.toLowerCase()
  );
  if (sameModel.length === 0) {
    return { status: 'not_compatible', reason: 'model_not_listed' };
  }

  const sameYear = sameModel.filter(v => yearInRange(v.years, vehicle.year));
  if (sameYear.length === 0) {
    return { status: 'not_compatible', reason: 'year_out_of_range', applicableYears: sameModel.map(v => v.years).join(', ') };
  }

  // Sin restricción de motor en el dato → coincide
  if (sameYear.some(v => !v.engine)) {
    return { status: 'compatible', reason: 'match' };
  }

  if (!vehicle.engine) {
    return { status: 'unknown', reason: 'engine_unconfirmed' };
  }

  const engineMatches = sameYear.some(v => v.engine!.toLowerCase() === vehicle.engine!.toLowerCase());
  return engineMatches
    ? { status: 'compatible', reason: 'match' }
    : { status: 'not_compatible', reason: 'engine_mismatch' };
}

export function getCompatibilityStatus(product: Product, vehicle: VehicleLike): CompatibilityStatus {
  return getCompatibilityDetail(product, vehicle).status;
}

// Compatibilidad confirmada (estricta): la usan el filtro "solo compatibles" y los conteos.
export function isProductCompatible(product: Product, vehicle: VehicleLike): boolean {
  return getCompatibilityStatus(product, vehicle) === 'compatible';
}

export function getCompatibleProducts(vehicle: VehicleLike): Product[] {
  return products.filter(p => isProductCompatible(p, vehicle));
}

// Modelo conceptual §1: con vehículo activo, los compatibles tienen prioridad en el orden (no exclusividad).
// Orden estable: compatibles, luego sin datos, luego no compatibles.
export function sortByCompatibility<T extends Product>(list: T[], vehicle: VehicleLike | null): T[] {
  if (!vehicle) return list;
  const rank: Record<CompatibilityStatus, number> = { compatible: 0, unknown: 1, not_compatible: 2 };
  return list
    .map((product, index) => ({ product, index, rank: rank[getCompatibilityStatus(product, vehicle)] }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(entry => entry.product);
}

// HU-E55-01/03: relaciones de un producto resueltas contra el catálogo actual y el vehículo activo.
export interface ResolvedRelation {
  relation: ProductRelation;
  product: Product;
  compatibility: CompatibilityStatus | null;
}

export function getProductRelations(product: Product, vehicle: VehicleLike | null) {
  const declared = product.relations ?? [];
  const resolved: ResolvedRelation[] = [];
  declared.forEach((relation) => {
    const related = getProductById(relation.productId);
    if (!related || related.discontinued) return; // referencia que ya no se vende: no se ofrece
    const compatibility = vehicle ? getCompatibilityStatus(related, vehicle) : null;
    if (compatibility === 'not_compatible') return; // HU-E55-01: con vehículo activo, solo lo que puede servir
    resolved.push({ relation, product: related, compatibility });
  });
  return { hasData: declared.length > 0, resolved, hiddenCount: declared.length - resolved.length };
}
