"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const GALAXY_IMAGES = [
  "/galaxy/galaxy-01.webp",
  "/galaxy/galaxy-02.webp",
  "/galaxy/galaxy-03.webp",
  "/galaxy/galaxy-04.webp",
  "/galaxy/galaxy-05-v2.webp",
  "/galaxy/galaxy-06.webp",
  "/galaxy/galaxy-07.webp",
  "/galaxy/galaxy-08.webp",
  "/galaxy/galaxy-09.webp",
] as const;

const TILE_CLASS = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-2 row-span-1",
] as const;

export function AboutGalaxyGrid({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("h-72 w-full overflow-hidden rounded-none sm:h-96 md:h-[440px]", className)} ref={containerRef}>
      <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-1">
        {GALAXY_IMAGES.map((src, index) => (
          <div className={cn("group relative overflow-hidden", TILE_CLASS[index])} key={src}>
            <div className={cn("absolute inset-0 bg-muted/40 transition-opacity duration-300", loadedMap[index] && "opacity-0")} />
            {isInView ? (
              <Image
                alt={`Galaxy ${index + 1}`}
                className="object-cover object-center grayscale transition duration-300 group-hover:grayscale-0"
                decoding="async"
                fetchPriority={index < 4 ? "high" : "auto"}
                fill
                loading="eager"
                onLoad={() => {
                  setLoadedMap((current) => ({ ...current, [index]: true }));
                }}
                sizes="(max-width: 768px) 100vw, 768px"
                style={{ objectPosition: "50% 50%" }}
                src={src}
                unoptimized
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
