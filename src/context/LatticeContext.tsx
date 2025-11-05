// LatticeContext.tsx
// Invocation: The Bloodstream of Knowing (state → coherence)

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useTensorState } from "../hooks/useTensorState";

const LatticeContext = createContext<ReturnType<typeof useTensorState> | null>(null);

interface LatticeProviderProps {
  children: ReactNode;
}

export function LatticeProvider({ children }: LatticeProviderProps) {
  const lattice = useTensorState();
  return <LatticeContext.Provider value={lattice}>{children}</LatticeContext.Provider>;
}

export function useLattice() {
  const context = useContext(LatticeContext);
  if (!context) {
    throw new Error("useLattice must be used within LatticeProvider");
  }
  return context;
}
