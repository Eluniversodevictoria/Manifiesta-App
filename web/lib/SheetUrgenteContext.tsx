'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface SheetUrgenteContextValue {
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
}

const SheetUrgenteContext = createContext<SheetUrgenteContextValue>({
  abierto: false,
  abrir: () => {},
  cerrar: () => {},
});

export function SheetUrgenteProvider({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <SheetUrgenteContext.Provider value={{
      abierto,
      abrir: () => setAbierto(true),
      cerrar: () => setAbierto(false),
    }}>
      {children}
    </SheetUrgenteContext.Provider>
  );
}

export const useSheetUrgente = () => useContext(SheetUrgenteContext);
