// ─────────────────────────────────────────────────────────────
//  Omora — purse catalogue
//
//  To add a purse:  copy a block and edit the fields.
//  To add a photo:  drop the image in  public/images/purses/
//                   and set  image: '/images/purses/your-photo.jpg'
//  Leave  image: ''  to show a branded "Foto próximamente" placeholder.
//
//  ⚠️  PRECIOS PROVISORIOS — los valores de `price` son estimados.
//      Reemplázalos por los precios reales (en pesos chilenos).
//      Los nombres también son sugerencias: cámbialos si quieres.
// ─────────────────────────────────────────────────────────────

export type Category = 'Carteras' | 'Bolsos' | 'Clutches' | 'Mochilas';

export interface Purse {
  id: string;
  name: string;
  description: string;
  /** Price in Chilean pesos (CLP), as a plain number. */
  price: number;
  category: Category;
  /** Path under /public, e.g. '/images/purses/foto.jpg'. Empty = placeholder. */
  image: string;
}

export const purses: Purse[] = [
  {
    id: 'cartera-atardecer',
    name: 'Cartera Atardecer',
    description:
      'Cartera media luna en tono mostaza, con tejido acanalado y asas de madera redondas.',
    price: 35000,
    category: 'Carteras',
    image: '/images/purses/cartera-atardecer.jpg',
  },
  {
    id: 'bolso-noche',
    name: 'Bolso Noche',
    description:
      'Bolso de hombro en azul noche, tejido en punto bodoque, con asa y correa larga.',
    price: 38000,
    category: 'Bolsos',
    image: '/images/purses/bolso-noche.jpg',
  },
  {
    id: 'clutch-esmeralda',
    name: 'Clutch Esmeralda',
    description:
      'Clutch en verde esmeralda con borla blanca y correa larga desmontable.',
    price: 26000,
    category: 'Clutches',
    image: '/images/purses/clutch-esmeralda.jpg',
  },
  {
    id: 'cartera-amelia',
    name: 'Cartera Amelia',
    description:
      'Cartera en punto bodoque rosado, con cadena dorada y un moño tejido a juego.',
    price: 32000,
    category: 'Carteras',
    image: '/images/purses/cartera-amelia.jpg',
  },
  {
    id: 'cartera-piedra',
    name: 'Cartera Piedra',
    description:
      'Cartera tejida en gris, con tapa en contraste terracota y borla azul desmontable.',
    price: 30000,
    category: 'Carteras',
    image: '/images/purses/cartera-piedra.jpg',
  },
  {
    id: 'bolso-margarita',
    name: 'Bolso Margarita',
    description:
      'Bolso tipo balde en amarillo, tejido acanalado, con asa superior y cordón ajustable.',
    price: 28000,
    category: 'Bolsos',
    image: '/images/purses/bolso-margarita.jpg',
  },
  {
    id: 'cartera-cereza',
    name: 'Cartera Cereza',
    description:
      'Cartera media luna en rojo cereza, con tejido acanalado y asas de madera redondas.',
    price: 35000,
    category: 'Carteras',
    image: '/images/purses/cartera-cereza.jpg',
  },
];

/** Format a CLP amount as "CLP 23.5K". */
export function formatPrice(clp: number): string {
  const k = clp / 1000;
  const value = Number.isInteger(k) ? String(k) : k.toFixed(1);
  return `CLP ${value}K`;
}

/** Unique categories in catalogue order, for the gallery filter. */
export const categories: Category[] = [...new Set(purses.map((p) => p.category))];
