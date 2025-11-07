"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      initialize();
    }
  }, []);

  return <>{children}</>;
}
