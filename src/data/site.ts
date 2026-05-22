// ─────────────────────────────────────────────────────────────
//  Omora — site configuration
//  Edit the values here to update the whole website.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Omora',
  legalName: 'Omora Tejidos',
  tagline: 'Productos tejidos a mano con mucha paciencia y amor',
  description:
    'Omora — carteras, bolsos y accesorios tejidos a mano en Chile. ' +
    'Cada pieza es única, hecha con dedicación, paciencia y amor.',

  // TODO: replace with the real WhatsApp number when available.
  // Format: country code + number, digits only, no "+", spaces or dashes.
  // Example for Chile: '56912345678'
  whatsapp: '56900000000',

  instagram: 'omora.tejidos',
  instagramUrl: 'https://www.instagram.com/omora.tejidos/',

  domain: 'https://omora.alfredsensual.com',

  location: 'Chile',
} as const;

// Sections used by the navigation menu.
export const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Sobre Omora', href: '#sobre' },
  { label: 'Contacto', href: '#contacto' },
] as const;

/** Build a WhatsApp click-to-chat link with a pre-filled message. */
export function waLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
