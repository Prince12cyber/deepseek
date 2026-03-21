"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XIcon, ExternalLinkIcon, GlobeIcon } from "lucide-react";
import { useSearchResults } from "@/hooks/use-search-results";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function SearchResultsSidebar() {
  const { results, isSidebarOpen, closeSidebar } = useSearchResults();

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-dvh w-full md:w-[400px] bg-background border-l shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <GlobeIcon size={18} className="text-primary" />
                <h2 className="font-semibold text-lg">Search results</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={closeSidebar} className="rounded-full">
                <XIcon size={20} />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                  <GlobeIcon size={32} className="opacity-20" />
                  <p>No results found for this message.</p>
                </div>
              ) : (
                results.map((result, i) => (
                  <motion.a
                    key={i}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="block p-4 rounded-2xl border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border">
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${new URL(result.url).hostname}&sz=32`}
                          className="h-4 w-4 object-contain"
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://www.google.com/s2/favicons?domain=google.com&sz=32";
                          }}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium truncate uppercase tracking-wider text-muted-foreground/80">
                          {new URL(result.url).hostname.replace("www.", "")}
                        </span>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">
                          Source [{i + 1}]
                        </span>
                        <ExternalLinkIcon size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {result.title}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground line-clamp-4 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {result.content}
                    </p>
                    
                    <div className="absolute top-0 right-0 w-1 h-full bg-primary transform translate-x-full group-hover:translate-x-0 transition-transform" />
                  </motion.a>
                ))
              )}
            </div>
            
            <div className="p-4 bg-muted/30 border-t">
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-medium">
                Results provided by Tavily Search AI
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
