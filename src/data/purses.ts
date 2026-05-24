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
      'Cartera media luna en tono mostaza, tejido acanalado y asas circulares doradas.',
    price: 35000,
    category: 'Carteras',
    image: '/images/purses/cartera-atardecer.jpg',
  },
  {
    id: 'clutch-tinta',
    name: 'Clutch Tinta',
    description:
      'Cartera de cuerpo suave con borla colgante, en negro profundo.',
    price: 28000,
    category: 'Clutches',
    image: '/images/purses/clutch-tinta.jpg',
  },
  {
    id: 'bolso-bosque',
    name: 'Bolso Bosque',
    description:
      'Bolso de hombro en verde oliva, tejido calado con flecos laterales y cierre central.',
    price: 42000,
    category: 'Bolsos',
    image: '/images/purses/bolso-bosque.jpg',
  },
  {
    id: 'cartera-vino',
    name: 'Cartera Vino',
    description:
      'Cartera burdeos con punto en relieve, asas rectangulares de madera y borla a juego.',
    price: 36000,
    category: 'Carteras',
    image: '/images/purses/cartera-vino.jpg',
  },
  {
    id: 'clutch-amapola',
    name: 'Clutch Amapola',
    description:
      'Cartera con flecos rojos en toda la pieza y cadena fina dorada desmontable.',
    price: 32000,
    category: 'Clutches',
    image: '/images/purses/clutch-amapola.jpg',
  },
  {
    id: 'cartera-trigo',
    name: 'Cartera Trigo',
    description:
      'Cartera dorada con largo fleco de hilo, asas circulares en tono dorado y borde en punto bodoque.',
    price: 38000,
    category: 'Carteras',
    image: '/images/purses/cartera-trigo.jpg',
  },
  {
    id: 'bolso-carbon',
    name: 'Bolso Carbón',
    description:
      'Bolso tote en café profundo, con asa de hombro tejida y borla a juego.',
    price: 38000,
    category: 'Bolsos',
    image: '/images/purses/bolso-carbon.jpg',
  },
  {
    id: 'cartera-margarita',
    name: 'Cartera Margarita',
    description:
      'Pequeña cartera amarilla con detalle de bodoques arriba y un fleco generoso en la base.',
    price: 28000,
    category: 'Carteras',
    image: '/images/purses/cartera-margarita.jpg',
  },
  {
    id: 'clutch-miel',
    name: 'Clutch Miel',
    description:
      'Cartera de cuerpo suave color miel con borla a juego — ideal para ocasiones especiales.',
    price: 28000,
    category: 'Clutches',
    image: '/images/purses/clutch-miel.jpg',
  },
  {
    id: 'cartera-otono',
    name: 'Cartera Otoño',
    description:
      'Cartera mostaza en punto burbuja, con asas rectangulares de madera y borla.',
    price: 36000,
    category: 'Carteras',
    image: '/images/purses/cartera-otono.jpg',
  },
  {
    id: 'clutch-azabache',
    name: 'Clutch Azabache',
    description:
      'Cartera con flecos negros en toda la pieza y cadena fina dorada desmontable.',
    price: 32000,
    category: 'Clutches',
    image: '/images/purses/clutch-azabache.jpg',
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
