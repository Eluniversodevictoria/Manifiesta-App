'use client';

import { type ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { SheetUrgente } from './SheetUrgente';
import { ManifestacionesProvider } from '@/lib/ManifestacionesContext';
import { PlanProvider } from '@/lib/PlanContext';
import { SheetUrgenteProvider, useSheetUrgente } from '@/lib/SheetUrgenteContext';

function AppShellInner({ children }: { children: ReactNode }) {
  const { abierto, cerrar } = useSheetUrgente();
  return (
    <div
      className="flex min-h-dvh flex-col"
      style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}
    >
      <div className="flex flex-1 flex-col pb-[calc(68px+env(safe-area-inset-bottom))]">
        {children}
      </div>
      <BottomNav />
      <SheetUrgente abierto={abierto} onCerrar={cerrar} />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <PlanProvider>
    <ManifestacionesProvider>
    <SheetUrgenteProvider>
      <AppShellInner>{children}</AppShellInner>
    </SheetUrgenteProvider>
    </ManifestacionesProvider>
    </PlanProvider>
  );
}
