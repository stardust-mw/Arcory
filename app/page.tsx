"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { HeroAsciiGrid } from "@/components/hero-ascii-grid";
import { IdenticonAvatar } from "@/components/identicon-avatar";
import { ListEmptyState } from "@/components/list-empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { categories, siteCategories, type Category, type SavedSite, type SiteCategory } from "@/lib/site-types";
import { cn } from "@/lib/utils";

type SitesApiResponse = {
  sites: SavedSite[];
  source: "notion" | "unavailable";
  syncedAt: string | null;
};

function LoadingSiteRows() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="flex items-center gap-2 rounded-sm px-1 py-3" key={`loading-row-${index}`}>
          <div className="h-4 w-2 animate-pulse rounded bg-muted" />
          <div className="size-5 animate-pulse rounded-full bg-muted" />
          <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <div className="h-3 w-36 animate-pulse rounded bg-muted" />
              <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SavedSiteRow({ site }: { site: SavedSite }) {
  const metaTokens = site.meta
    .split("•")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="group flex items-center gap-2 rounded-sm px-1 py-3 text-xs transition-colors duration-150 hover:bg-muted/50">
      <div className="flex items-center justify-center text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
        &gt;
      </div>
      <IdenticonAvatar
        alt={`${site.title} identicon`}
        className="size-5"
        monoChroma={0.08}
        monoLightnessHigh={0.8}
        monoLightnessLow={0.35}
        seed={site.title}
        size={20}
      />
      <div className="flex min-w-0 flex-1 items-start justify-between gap-4 pl-0">
        <div className="min-w-0">
          <p className="truncate text-foreground">{site.title}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {metaTokens.map((item, index) => (
              <span key={`${site.id}-${item}`}>
                {index > 0 ? <span className="px-1">•</span> : null}
                {item}
              </span>
            ))}
          </p>
        </div>
        <p className="shrink-0 self-center text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
          {site.clicks} Clicks
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [activeSubcategory, setActiveSubcategory] = useState("ALL");
  const [keyword, setKeyword] = useState("");
  const [sites, setSites] = useState<SavedSite[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const buttonRefs = useRef<Partial<Record<Category, HTMLButtonElement | null>>>({});

  useEffect(() => {
    let cancelled = false;

    const fetchSites = async () => {
      setIsLoadingSites(true);
      try {
        const response = await fetch("/api/sites", { cache: "no-store" });
        if (!response.ok) {
          if (!cancelled) setSites([]);
          return;
        }
        const data = (await response.json()) as SitesApiResponse;
        if (cancelled || !Array.isArray(data.sites)) {
          if (!cancelled) setSites([]);
          return;
        }
        setSites(data.sites);
      } catch {
        if (!cancelled) setSites([]);
      } finally {
        if (!cancelled) setIsLoadingSites(false);
      }
    };

    void fetchSites();

    return () => {
      cancelled = true;
    };
  }, []);

  const subcategoriesByCategory = useMemo(() => {
    const grouped = Object.fromEntries(
      siteCategories.map((category) => [category, new Set<string>()]),
    ) as Record<SiteCategory, Set<string>>;

    for (const site of sites) {
      if (site.subcategory) {
        grouped[site.category].add(site.subcategory.trim().toUpperCase());
      }
    }

    return Object.fromEntries(
      siteCategories.map((category) => {
        const dynamic = Array.from(grouped[category]).sort((a, b) => a.localeCompare(b, "en"));
        return [category, dynamic];
      }),
    ) as Record<SiteCategory, string[]>;
  }, [sites]);

  const categoryCounts = useMemo(() => {
    const counts = Object.fromEntries(categories.map((category) => [category, 0])) as Record<Category, number>;
    counts.ALL = sites.length;

    for (const site of sites) {
      counts[site.category] += 1;
    }

    return counts;
  }, [sites]);

  const filteredSites = useMemo(() => {
    const searchValue = keyword.trim().toLowerCase();

    return sites.filter((site) => {
      const categoryMatched = activeCategory === "ALL" || site.category === activeCategory;
      const subcategoryMatched =
        activeSubcategory === "ALL" || site.subcategory?.trim().toUpperCase() === activeSubcategory;
      const keywordMatched = !searchValue || site.title.toLowerCase().includes(searchValue);

      return categoryMatched && subcategoryMatched && keywordMatched;
    });
  }, [activeCategory, activeSubcategory, keyword, sites]);

  const switchCategoryByArrow = (current: Category, direction: 1 | -1) => {
    const currentIndex = categories.indexOf(current);
    if (currentIndex === -1 || categories.length <= 1) return;

    const nextIndex = (currentIndex + direction + categories.length) % categories.length;
    const nextCategory = categories[nextIndex];

    setActiveSubcategory("ALL");
    setActiveCategory(nextCategory);
    buttonRefs.current[nextCategory]?.focus();
  };

  const isCategoryEmpty =
    !isLoadingSites && activeCategory !== "ALL" && categoryCounts[activeCategory] === 0 && keyword.trim().length === 0;

  return (
    <main className="min-h-[100dvh] bg-background">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[768px] flex-col bg-card px-6 pt-9 pb-10 sm:px-16 sm:pt-9 sm:pb-16">
        <header className="flex items-center justify-between text-sm">
          <Link className="flex items-center gap-1.5 text-foreground transition-colors hover:text-foreground/80" href="/">
            <IdenticonAvatar
              className="size-4"
              monoChroma={0}
              monoLightnessHigh={0.84}
              monoLightnessLow={0.12}
              seed="arcory-logo"
              size={16}
              variant="bayer-4x4-mono-oklch"
            />
            <span className="text-[16px] leading-none">Arcory</span>
          </Link>
          <div className="flex items-center gap-3">
            <a className="text-foreground" href="#">
              About
            </a>
            <ThemeToggle />
            <Button aria-label="Submit" size="icon" type="button" variant="outline">
              <ArrowRightIcon />
            </Button>
          </div>
        </header>

        <section className="mt-12 flex justify-center">
          <HeroAsciiGrid />
        </section>

        <section className="mt-9">
          <div className="sticky top-0 z-20 -mx-1 bg-card/95 px-1 pt-2 pb-2 backdrop-blur supports-[backdrop-filter]:bg-card/80">
            <div
              aria-label="Site categories"
              className="flex flex-wrap items-center gap-2 text-[13px] text-foreground"
              role="tablist"
            >
              {categories.map((category) => (
                <button
                  aria-selected={activeCategory === category}
                  className={cn(
                    "rounded-none px-1.5 py-1 leading-none transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                    "text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/80 active:text-foreground",
                    activeCategory === category &&
                      "bg-foreground text-background hover:bg-foreground/90 hover:text-background active:text-background",
                  )}
                  key={category}
                  onClick={() => {
                    setActiveSubcategory("ALL");
                    setActiveCategory(category);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight") {
                      event.preventDefault();
                      switchCategoryByArrow(category, 1);
                    }

                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      switchCategoryByArrow(category, -1);
                    }
                  }}
                  ref={(node) => {
                    buttonRefs.current[category] = node;
                  }}
                  role="tab"
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>

            {activeCategory !== "ALL" ? (
              <div aria-label={`${activeCategory} subcategories`} className="no-scrollbar mt-2 overflow-x-auto">
                <div className="inline-flex items-center gap-2 whitespace-nowrap bg-muted px-1 py-1">
                  <button
                    aria-pressed={activeSubcategory === "ALL"}
                    className={cn(
                      "rounded-none px-1.5 py-1 text-[11px] leading-none transition-colors duration-150",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                      "text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/80 active:text-foreground",
                      activeSubcategory === "ALL" &&
                        "bg-foreground text-background hover:bg-foreground/90 hover:text-background active:text-background",
                    )}
                    onClick={() => setActiveSubcategory("ALL")}
                    type="button"
                  >
                    ALL
                  </button>
                  {subcategoriesByCategory[activeCategory].map((subcategory) => (
                    <button
                      aria-pressed={activeSubcategory === subcategory}
                      className={cn(
                        "rounded-none px-1.5 py-1 text-[11px] leading-none transition-colors duration-150",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                        "text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/80 active:text-foreground",
                        activeSubcategory === subcategory &&
                          "bg-foreground text-background hover:bg-foreground/90 hover:text-background active:text-background",
                      )}
                      key={subcategory}
                      onClick={() => setActiveSubcategory(subcategory)}
                      type="button"
                    >
                      {subcategory}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <Input
              aria-label="Search saved websites"
              className="mt-3 mb-1 h-8 rounded-none border-input bg-transparent px-2 text-xs shadow-none focus-visible:ring-0"
              placeholder="Search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>

          <div className="mt-1">
            {isLoadingSites ? (
              <LoadingSiteRows />
            ) : isCategoryEmpty ? (
              <ListEmptyState category={activeCategory} mode="category" />
            ) : filteredSites.length > 0 ? (
              filteredSites.map((site) => <SavedSiteRow key={site.id} site={site} />)
            ) : (
              <ListEmptyState category={activeCategory} mode="search" />
            )}
          </div>

          <div className="py-4 text-center text-xs uppercase tracking-[0.06em] text-foreground">
            {isLoadingSites ? "Loading..." : `${filteredSites.length} Saves`}
          </div>
        </section>

        <footer className="mt-auto">
          <div className="flex items-center gap-4 pt-9 pb-0">
            <div className="h-px flex-1 bg-border" />
            <p className="text-xs uppercase tracking-[0.06em] text-foreground">Archive + story</p>
            <div className="h-px flex-1 bg-border" />
          </div>
        </footer>
      </div>
    </main>
  );
}
