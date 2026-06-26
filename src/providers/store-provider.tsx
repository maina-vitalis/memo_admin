"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { hydrateAuth } from "@/features/auth/store/auth-slice";
import { getStore, type AppStore } from "@/store/store";

type StoreProviderProps = {
  children: React.ReactNode;
};

export function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<AppStore>(getStore());

  useEffect(() => {
    storeRef.current.dispatch(hydrateAuth());
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
