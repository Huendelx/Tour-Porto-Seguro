"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface HeaderCtx {
  mobileTitle: string;
  setMobileTitle: (t: string) => void;
}

const HeaderContext = createContext<HeaderCtx>({ mobileTitle: "", setMobileTitle: () => {} });

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [mobileTitle, setMobileTitle] = useState("");
  return (
    <HeaderContext.Provider value={{ mobileTitle, setMobileTitle }}>
      {children}
    </HeaderContext.Provider>
  );
}

export const useHeaderContext = () => useContext(HeaderContext);
