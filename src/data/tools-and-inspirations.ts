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

export const getFaviconSrc = (favicon: ImageMetadata | string): string => {
  return typeof favicon === 'string' ? favicon : favicon.src;
};

export const COLOPHON: SiteEntry[] = [
  {
    name: 'Catppuccin',
    description: 'Color Palette',
    url: 'https://catppuccin.com/',
    favicon: catppuccinFavicon,
  },

  {
    name: 'Maple Mono',
    description: 'Coding Font',
    url: 'https://font.subf.dev/en/',
    favicon: astroFavicon,
  },
  {
    name: 'Tabler Icons',
    description: 'Icon Set',
    url: 'https://tabler.io/icons',
    favicon: starwindUiFavicon,
  },
];

export const INSPIRATIONAL_SITES: SiteEntry[] = [
  {
    name: 'Jason Cameron',
    url: 'https://jasoncameron.dev/',
    favicon: jasonCameronFavicon,
    description: 'Overall Look and Feel',
  },
  {
    name: 'Duy Le',
    url: 'https://www.duyle.dev/',
    favicon: duyLeFavicon,
    description: 'Animations and Components',
  },

  {
    name: 'Brittany Chiang',
    url: 'https://brittanychiang.com/',
    favicon: brittanychiangFavicon,
    description: 'Layout and Components',
  },
];
