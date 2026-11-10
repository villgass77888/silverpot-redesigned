import type { ReactNode } from 'react';
import { FoilWipe } from '@/components/brand/FoilWipe';

// Templates remount on navigation, which is what drives the foil wipe (§4.3-7).
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <FoilWipe />
      {children}
    </>
  );
}
