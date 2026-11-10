import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { RegistrationMarks } from './Motifs';

/**
 * RimFrame (§3.6): 14px outer radius + inner 1px rim line inset 5px, echoing a
 * container's rolled rim. A blueprint grid behind means "technical data" (§3.2).
 */
export function RimFrame({
  children,
  tone = 'foil',
  grid = true,
  marks = true,
  className,
}: {
  children?: ReactNode;
  tone?: 'foil' | 'white';
  grid?: boolean;
  marks?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rim isolate overflow-hidden',
        tone === 'foil' ? 'bg-foil' : 'bg-white',
        grid && 'bg-blueprint',
        className,
      )}
    >
      {marks && <RegistrationMarks inset={11} size={14} />}
      {children}
    </div>
  );
}
