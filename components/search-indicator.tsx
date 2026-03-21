"use client";

import { motion } from "framer-motion";
import { ChevronRightIcon, GlobeIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useSearchResults } from "@/hooks/use-search-results";

const Favicon = ({ url }: { url: string }) => {
  const [src, setSrc] = useState(
    `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`
  );

  return (
    <Image
      alt=""
      className="h-full w-full object-contain"
      height={20}
      onError={() => {
        setSrc("https://www.google.com/s2/favicons?domain=google.com&sz=32");
      }}
      src={src}
      unoptimized
      width={20}
    />
  );
};

export function SearchIndicator({ messageId }: { messageId: string }) {
  const { results, openSidebar } = useSearchResults(messageId);
  const count = results.length;

  if (count === 0) return null;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 my-2 cursor-pointer group w-fit"
      initial={{ opacity: 0, y: 5 }}
      onClick={() => openSidebar()}
    >
      <div className="flex -space-x-1.5 overflow-hidden">
        {results.slice(0, 4).map((result, i) => (
          <div
            className="inline-block h-5 w-5 rounded-full ring-2 ring-background bg-muted overflow-hidden flex-shrink-0"
            key={i}
          >
            <Favicon url={result.url} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors ml-1">
        <GlobeIcon
          className="text-primary/70 group-hover:text-primary"
          size={14}
        />
        <span>Read {count} web pages</span>
        <ChevronRightIcon
          className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0"
          size={14}
        />
      </div>
    </motion.div>
  );
}
