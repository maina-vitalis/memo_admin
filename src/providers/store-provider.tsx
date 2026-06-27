"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { hydrateAuth } from "@/features/auth/store/auth-slice";
import { getStore } from "@/store/store";

type StoreProviderProps = {
  children: React.ReactNode;
};

export function StoreProvider({ children }: StoreProviderProps) {
  const store = getStore();

  useEffect(() => {
    store.dispatch(hydrateAuth());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
