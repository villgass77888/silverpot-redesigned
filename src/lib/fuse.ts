import Fuse from 'fuse.js';
import type { CardProduct } from './catalog';

export function makeFuse(list: CardProduct[]) {
  return new Fuse(list, {
    keys: [
      { name: 'code', weight: 3 },
      { name: 'aliases', weight: 2.5 },
      { name: 'name', weight: 1.6 },
      { name: 'familyLabel', weight: 1 },
      { name: 'goodFor', weight: 0.8 },
      { name: 'tagline', weight: 0.3 },
    ],
    threshold: 0.36,
    ignoreLocation: true,
  });
}
