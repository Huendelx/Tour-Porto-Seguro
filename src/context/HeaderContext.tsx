"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type LoginRole = "turista" | "operador";

interface HeaderCtx {
  mobileTitle: string;
  setMobileTitle: (t: string) => void;
  loginModalOpen: boolean;
  loginModalRole: LoginRole;
  openLoginModal: (role?: LoginRole) => void;
  closeLoginModal: () => void;
}

const HeaderContext = createContext<HeaderCtx>({
  mobileTitle: "",
  setMobileTitle: () => {},
  loginModalOpen: false,
  loginModalRole: "turista",
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [mobileTitle, setMobileTitle] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalRole, setLoginModalRole] = useState<LoginRole>("turista");

  return (
    <HeaderContext.Provider
      value={{
        mobileTitle,
        setMobileTitle,
        loginModalOpen,
        loginModalRole,
        openLoginModal: (role) => {
          setLoginModalRole(role ?? "turista");
          setLoginModalOpen(true);
        },
        closeLoginModal: () => setLoginModalOpen(false),
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export const useHeaderContext = () => useContext(HeaderContext);
