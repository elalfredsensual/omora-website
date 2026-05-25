// ─────────────────────────────────────────────────────────────
//  Omora — purse types + seed data
//
//  In production, the live catalogue lives in a JSON file on a
//  Docker volume (so admin edits persist across redeploys). The
//  array below is the SEED — written to disk on first start if no
//  data file exists yet. Don't edit it to manage the catalogue; use
//  the /admin panel instead.
// ─────────────────────────────────────────────────────────────

export type Category = 'Carteras' | 'Bolsos' | 'Clutches' | 'Mochilas';

export type PurseStatus = 'visible' | 'out-of-stock' | 'hidden';

export interface Purse {
  id: string;
  name: string;
  description: string;
  /** Price in Chilean pesos (CLP), as a plain number. */
  price: number;
  category: Category;
  /** One or more image paths under /public.
   *  The first one shows on the gallery card; additional ones
   *  appear as thumbnails inside the lightbox. */
  images: string[];
  status: PurseStatus;
  /** Lower = earlier in the gallery. */
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** Initial catalogue, used to seed the data file on first run. */
export const seedPurses: Omit<Purse, 'order' | 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'cartera-atardecer',
    name: 'Cartera Atardecer',
    description:
      'Cartera media luna en tono mostaza, tejido acanalado y asas circulares doradas.',
    price: 35000,
    category: 'Carteras',
    images: ['/images/purses/cartera-atardecer.jpg'],
    status: 'visible',
  },
  {
    id: 'clutch-tinta',
    name: 'Clutch Tinta',
    description:
      'Cartera de cuerpo suave con borla colgante, en negro profundo.',
    price: 28000,
    category: 'Clutches',
    images: [
      '/images/purses/clutch-tinta.jpg',
      '/images/purses/clutch-tinta-2.jpg',
    ],
    status: 'visible',
  },
  {
    id: 'bolso-bosque',
    name: 'Bolso Bosque',
    description:
      'Bolso de hombro en verde oliva, tejido calado con flecos laterales y cierre central.',
    price: 42000,
    category: 'Bolsos',
    images: [
      '/images/purses/bolso-bosque.jpg',
      '/images/purses/bolso-bosque-2.jpg',
    ],
    status: 'visible',
  },
  {
    id: 'cartera-vino',
    name: 'Cartera Vino',
    description:
      'Cartera burdeos con punto en relieve, asas rectangulares de madera y borla a juego.',
    price: 36000,
    category: 'Carteras',
    images: ['/images/purses/cartera-vino.jpg'],
    status: 'visible',
  },
  {
    id: 'clutch-amapola',
    name: 'Clutch Amapola',
    description:
      'Cartera con flecos rojos en toda la pieza y cadena fina dorada desmontable.',
    price: 32000,
    category: 'Clutches',
    images: [
      '/images/purses/clutch-amapola.jpg',
      '/images/purses/clutch-amapola-2.jpg',
    ],
    status: 'visible',
  },
  {
    id: 'cartera-trigo',
    name: 'Cartera Trigo',
    description:
      'Cartera dorada con largo fleco de hilo, asas circulares en tono dorado y borde en punto bodoque.',
    price: 38000,
    category: 'Carteras',
    images: ['/images/purses/cartera-trigo.jpg'],
    status: 'visible',
  },
  {
    id: 'bolso-carbon',
    name: 'Bolso Carbón',
    description:
      'Bolso tote en café profundo, con asa de hombro tejida y borla a juego.',
    price: 38000,
    category: 'Bolsos',
    images: [
      '/images/purses/bolso-carbon.jpg',
      '/images/purses/bolso-carbon-2.jpg',
    ],
    status: 'visible',
  },
  {
    id: 'cartera-margarita',
    name: 'Cartera Margarita',
    description:
      'Pequeña cartera amarilla con detalle de bodoques arriba y un fleco generoso en la base.',
    price: 28000,
    category: 'Carteras',
    images: ['/images/purses/cartera-margarita.jpg'],
    status: 'visible',
  },
  {
    id: 'clutch-miel',
    name: 'Clutch Miel',
    description:
      'Cartera de cuerpo suave color miel con borla a juego — ideal para ocasiones especiales.',
    price: 28000,
    category: 'Clutches',
    images: [
      '/images/purses/clutch-miel.jpg',
      '/images/purses/clutch-miel-2.jpg',
    ],
    status: 'visible',
  },
  {
    id: 'cartera-otono',
    name: 'Cartera Otoño',
    description:
      'Cartera mostaza en punto burbuja, con asas rectangulares de madera y borla.',
    price: 36000,
    category: 'Carteras',
    images: ['/images/purses/cartera-otono.jpg'],
    status: 'visible',
  },
  {
    id: 'clutch-azabache',
    name: 'Clutch Azabache',
    description:
      'Cartera con flecos negros en toda la pieza y cadena fina dorada desmontable.',
    price: 32000,
    category: 'Clutches',
    images: [
      '/images/purses/clutch-azabache.jpg',
      '/images/purses/clutch-azabache-2.jpg',
    ],
    status: 'visible',
  },
];

/** Format a CLP amount as "CLP 23.5K". */
export function formatPrice(clp: number): string {
  const k = clp / 1000;
  const value = Number.isInteger(k) ? String(k) : k.toFixed(1);
  return `CLP ${value}K`;
}

export const ALL_CATEGORIES: Category[] = ['Carteras', 'Bolsos', 'Clutches', 'Mochilas'];
