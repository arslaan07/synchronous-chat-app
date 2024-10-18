import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";

export const useAppStore = create((set) => ({
    ...createAuthSlice(set),
}))