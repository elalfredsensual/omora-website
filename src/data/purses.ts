// ─────────────────────────────────────────────────────────────
//  Omora — purse catalogue
//
//  To add a purse:  copy a block and edit the fields.
//  To add a photo:  drop the image in  public/images/purses/
//                   and set  image: '/images/purses/your-photo.jpg'
//  Leave  image: ''  to show a branded "Foto próximamente" placeholder.
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
    description: 'Tonos cálidos tejidos en punto cruzado, ideal para el día a día.',
    price: 28000,
    category: 'Carteras',
    image: '',
  },
  {
    id: 'bolso-trenza',
    name: 'Bolso Trenza',
    description: 'Diseño de trenzas en hilo grueso, espacioso y resistente.',
    price: 34500,
    category: 'Bolsos',
    image: '',
  },
  {
    id: 'clutch-amapola',
    name: 'Clutch Amapola',
    description: 'Pequeño y elegante, perfecto para ocasiones especiales.',
    price: 19000,
    category: 'Clutches',
    image: '',
  },
  {
    id: 'cartera-luna',
    name: 'Cartera Luna',
    description: 'Forma redonda con asa de madera natural, suave al tacto.',
    price: 31000,
    category: 'Carteras',
    image: '',
  },
  {
    id: 'bolso-praga',
    name: 'Bolso Praga',
    description: 'Estilo bandolera tejido en crochet, con bolsillo interior.',
    price: 37500,
    category: 'Bolsos',
    image: '',
  },
  {
    id: 'mochila-aurora',
    name: 'Mochila Aurora',
    description: 'Mochila tejida liviana, con cordón ajustable y forro suave.',
    price: 42000,
    category: 'Mochilas',
    image: '',
  },
  {
    id: 'cartera-almendra',
    name: 'Cartera Almendra',
    description: 'Punto compacto en tonos tierra, con cierre de botón de madera.',
    price: 26500,
    category: 'Carteras',
    image: '',
  },
  {
    id: 'clutch-petalo',
    name: 'Clutch Pétalo',
    description: 'Sobre tejido a mano con un delicado detalle de flor en relieve.',
    price: 21500,
    category: 'Clutches',
    image: '',
  },
  {
    id: 'bolso-camino',
    name: 'Bolso Camino',
    description: 'Bolso amplio tipo tote, tejido en algodón natural resistente.',
    price: 39000,
    category: 'Bolsos',
    image: '',
  },
  {
    id: 'cartera-brisa',
    name: 'Cartera Brisa',
    description: 'Tejido calado y fresco, con forro de tela interior.',
    price: 24000,
    category: 'Carteras',
    image: '',
  },
  {
    id: 'bolso-nido',
    name: 'Bolso Nido',
    description: 'Textura tipo nido en hilo trenzado, con asas reforzadas.',
    price: 35000,
    category: 'Bolsos',
    image: '',
  },
  {
    id: 'clutch-rocio',
    name: 'Clutch Rocío',
    description: 'Minimalista y delicado, con cadena dorada desmontable.',
    price: 22500,
    category: 'Clutches',
    image: '',
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
