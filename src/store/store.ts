import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth/store/auth-slice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

let store: AppStore | undefined;

export function getStore() {
  if (!store) {
    store = makeStore();
  }

  return store;
}

export function resetStoreForTests() {
  store = undefined;
}
