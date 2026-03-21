"use client";

import { motion } from "framer-motion";
import { GlobeIcon, ChevronRightIcon } from "lucide-react";
import { useSearchResults } from "@/hooks/use-search-results";

export function SearchIndicator({ messageId }: { messageId: string }) {
  const { results, openSidebar } = useSearchResults(messageId);
  const count = results.length;

  if (count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 my-2 cursor-pointer group w-fit"
      onClick={() => openSidebar()}
    >
      <div className="flex -space-x-1.5 overflow-hidden">
        {results.slice(0, 4).map((result, i) => (
          <div key={i} className="inline-block h-5 w-5 rounded-full ring-2 ring-background bg-muted overflow-hidden">
            <img
              src={`https://www.google.com/s2/favicons?domain=${new URL(result.url).hostname}&sz=32`}
              className="h-full w-full object-contain"
              alt=""
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://www.google.com/s2/favicons?domain=google.com&sz=32";
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors ml-1">
        <GlobeIcon size={14} className="text-primary/70 group-hover:text-primary" />
        <span>Read {count} web pages</span>
        <ChevronRightIcon size={14} className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
      </div>
    </motion.div>
  );
}
