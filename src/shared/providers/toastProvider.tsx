"use-client"

import { Toaster } from "@/components/ui/sonner";
import React from "react";

function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

export default ToastProvider;
