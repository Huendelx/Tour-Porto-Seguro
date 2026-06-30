"use client";

import { useEffect } from "react";
import { useHeaderContext } from "@/context/HeaderContext";

export default function SetHeaderTitle({ title }: { title: string }) {
  const { setMobileTitle } = useHeaderContext();
  useEffect(() => {
    setMobileTitle(title);
    return () => setMobileTitle("");
  }, [title, setMobileTitle]);
  return null;
}
