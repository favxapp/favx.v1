import type { SVGProps } from 'react';

const paths = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  home: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  bookmark: 'M6 3h12v18l-6-4-6 4Z',
  user: 'M20 21v-2a7 7 0 0 0-14 0v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  sparkles: 'm12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7ZM20 2v4m-2-2h4',
  image: 'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm-1 13 5-5 4 4 4-4 5 5M16 6v2',
  help: 'M9 8a3 3 0 1 1 4 3c-1 .5-1 1-1 3m0 3h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20',
  logout: 'M9 3H4v18h5m5-14 5 5-5 5M8 12h11',
  link: 'm9 15 6-6m-6 9-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2-4 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0',
  check: 'm5 12 4 4L19 6',
  search: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6',
  layers: 'm12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5',
  globe: 'M2 12h20M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 0c-5 6-5 14 0 20 5-6 5-14 0-20',
  camera: 'M8 5 9 3h6l1 2h5v15H3V5Zm4 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  mic: 'M9 4a3 3 0 0 1 6 0v8a3 3 0 0 1-6 0Zm-3 7v1a6 6 0 0 0 12 0v-1m-6 7v4m-4 0h8',
} as const;
export type IconName = keyof typeof paths;
export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>;
}
