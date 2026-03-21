"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLinkIcon, GlobeIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useSearchResults } from "@/hooks/use-search-results";
import { Button } from "./ui/button";

const Favicon = ({ url }: { url: string }) => {
  const [src, setSrc] = useState(
    `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`
  );

  return (
    <Image
      alt=""
      className="h-4 w-4 object-contain"
      height={16}
      onError={() => {
        setSrc("https://www.google.com/s2/favicons?domain=google.com&sz=32");
      }}
      src={src}
      unoptimized
      width={16}
    />
  );
};

export function SearchResultsSidebar() {
  const { results, isSidebarOpen, closeSidebar } = useSearchResults();

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={closeSidebar}
          />

          <motion.div
            animate={{ x: 0 }}
            className="fixed top-0 right-0 z-50 h-dvh w-full md:w-[400px] bg-background border-l shadow-2xl flex flex-col"
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <GlobeIcon className="text-primary" size={18} />
                <h2 className="font-semibold text-lg">Search results</h2>
              </div>
              <Button
                className="rounded-full"
                onClick={closeSidebar}
                size="icon"
                variant="ghost"
              >
                <XIcon size={20} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                  <GlobeIcon className="opacity-20" size={32} />
                  <p>No results found for this message.</p>
                </div>
              ) : (
                results.map((result, i) => (
                  <motion.a
                    animate={{ opacity: 1, y: 0 }}
                    className="block p-4 rounded-2xl border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all group relative overflow-hidden"
                    href={result.url}
                    initial={{ opacity: 0, y: 10 }}
                    key={i}
                    rel="noopener noreferrer"
                    target="_blank"
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border">
                        <Favicon url={result.url} />
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
                        <ExternalLinkIcon
                          className="text-muted-foreground group-hover:text-primary transition-colors"
                          size={14}
                        />
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
