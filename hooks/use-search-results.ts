"use client";

import { useMemo } from "react";
import { create } from "zustand";
import type { TavilySearchResult } from "@/lib/ai/search";

interface SearchResultsState {
  searchResults: Record<string, TavilySearchResult[]>; // messageId -> results
  pendingResults: TavilySearchResult[] | null;
  isSidebarOpen: boolean;
  activeMessageId: string | null;
  setSearchResults: (messageId: string, results: TavilySearchResult[]) => void;
  setPendingResults: (results: TavilySearchResult[]) => void;
  claimPendingResults: (messageId: string) => void;
  openSidebar: (messageId: string) => void;
  closeSidebar: () => void;
  clearResults: () => void;
}

export const useSearchResultsStore = create<SearchResultsState>((set) => ({
  searchResults: {},
  pendingResults: null,
  isSidebarOpen: false,
  activeMessageId: null,
  setSearchResults: (messageId, results) =>
    set((state) => ({
      searchResults: { ...state.searchResults, [messageId]: results },
    })),
  setPendingResults: (results) => set({ pendingResults: results }),
  claimPendingResults: (messageId) => 
    set((state) => {
      if (!state.pendingResults) return state;
      return {
        searchResults: { ...state.searchResults, [messageId]: state.pendingResults },
        pendingResults: null,
      };
    }),
  openSidebar: (messageId) =>
    set({ isSidebarOpen: true, activeMessageId: messageId }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  clearResults: () => set({ searchResults: {}, pendingResults: null, activeMessageId: null, isSidebarOpen: false }),
}));

export function useSearchResults(messageId?: string) {
  const { searchResults, isSidebarOpen, activeMessageId, openSidebar, closeSidebar, setSearchResults, claimPendingResults } = useSearchResultsStore();
  
  const effectiveMessageId = messageId || activeMessageId;
  const results = useMemo(() => 
    effectiveMessageId ? searchResults[effectiveMessageId] || [] : [], 
    [searchResults, effectiveMessageId]
  );

  return {
    results,
    isSidebarOpen: isSidebarOpen && (messageId ? activeMessageId === messageId : true),
    activeMessageId,
    openSidebar: (id?: string) => {
      const targetId = id || messageId;
      if (targetId) openSidebar(targetId);
    },
    closeSidebar,
    setSearchResults: (results: TavilySearchResult[], id?: string) => {
      const targetId = id || messageId;
      if (targetId) setSearchResults(targetId, results);
    },
    claimPendingResults: () => messageId && claimPendingResults(messageId),
  };
}
