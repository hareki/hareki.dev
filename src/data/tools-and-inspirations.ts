import astroFavicon from '@/assets/sites/astro.svg';
import brittanychiangFavicon from '@/assets/sites/brittanychiang.png';
import catppuccinFavicon from '@/assets/sites/catppuccin.png';
import duyLeFavicon from '@/assets/sites/duy-le.ico';
import jasonCameronFavicon from '@/assets/sites/jason-cameron.svg';
import starwindUiFavicon from '@/assets/sites/starwind-ui.ico';

export interface SiteEntry {
  name: string;
  description?: string;
  url: string;
  favicon: ImageMetadata | string;
}

export function getFaviconSrc(favicon: ImageMetadata | string): string {
  return typeof favicon === 'string' ? favicon : favicon.src;
}

export const TOOLS_USED: SiteEntry[] = [
  {
    name: 'Astro',
    description: 'Web Framework',
    url: 'https://astro.build/',
    favicon: astroFavicon,
  },
  {
    name: 'Starwind UI',
    description: 'UI Component Set',
    url: 'https://starwind.dev/',
    favicon: starwindUiFavicon,
  },
  {
    name: 'Catppuccin',
    description: 'Color Palette',
    url: 'https://catppuccin.com/',
    favicon: catppuccinFavicon,
  },
];

export const INSPIRATIONAL_SITES: SiteEntry[] = [
  {
    name: 'Jason Cameron',
    url: 'https://jasoncameron.dev/',
    favicon: jasonCameronFavicon,
    description: 'Overall Design and Layout',
  },
  {
    name: 'Duy Le',
    url: 'https://www.duyle.dev/',
    favicon: duyLeFavicon,
    description: 'Typing Test Component',
  },

  {
    name: 'Brittany Chiang',
    url: 'https://brittanychiang.com/',
    favicon: brittanychiangFavicon,
    description: 'Résumé Button',
  },
];
