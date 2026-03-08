"use client";

import { create } from "zustand";

interface SearchStore {
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  /** Currently selected category slug for filtering ("all" = no filter) */
  searchCategory: string;
  setSearchCategory: (slug: string) => void;
}

export const useSearch = create<SearchStore>()((set) => ({
  mobileOpen: false,
  openMobile: () => set({ mobileOpen: true }),
  closeMobile: () => set({ mobileOpen: false }),
  searchCategory: "all",
  setSearchCategory: (slug) => set({ searchCategory: slug }),
}));
