"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface HeaderCtx {
  mobileTitle: string;
  setMobileTitle: (t: string) => void;
  loginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const HeaderContext = createContext<HeaderCtx>({
  mobileTitle: "",
  setMobileTitle: () => {},
  loginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [mobileTitle, setMobileTitle] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <HeaderContext.Provider
      value={{
        mobileTitle,
        setMobileTitle,
        loginModalOpen,
        openLoginModal: () => setLoginModalOpen(true),
        closeLoginModal: () => setLoginModalOpen(false),
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export const useHeaderContext = () => useContext(HeaderContext);
