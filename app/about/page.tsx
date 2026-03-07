import Link from "next/link";

import { AboutCosmosAnimation } from "@/components/about-cosmos-animation";
import { AboutPortrait } from "@/components/about-portrait";
import { IdenticonAvatar } from "@/components/identicon-avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
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
            <Button
              asChild
              className="hover:bg-transparent focus-visible:bg-transparent active:bg-transparent"
              size="sm"
              type="button"
              variant="ghost"
            >
              <Link href="/about">About</Link>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <section className="mt-10 space-y-4">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">About</p>
          <AboutCosmosAnimation />
          <div className="pt-1">
            <div className="flex items-center justify-between border-b border-border/60 pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <p>Arcory // v0.1</p>
              <p>Human + AI</p>
            </div>

            <div className="mt-9 flex gap-4">
              <div aria-hidden className="h-[600px] w-px shrink-0 bg-border" />

              <div className="space-y-6">
                <div className="space-y-2 font-mono text-[16px] leading-7 tracking-[0.01em] text-foreground">
                  <p>Collect.</p>
                  <p>Explore.</p>
                  <p>Create.</p>
                </div>

                <div className="space-y-4 font-mono text-[13px] leading-7 text-foreground">
                  <div>
                      <p className="text-muted-foreground">&gt; collect</p>
                      <p>Place inspiration on one continuous timeline.</p>
                  </div>

                  <div>
                      <p className="text-muted-foreground">&gt; explore</p>
                      <p>Turn links into coordinates you can revisit.</p>
                  </div>

                  <div>
                      <p className="text-muted-foreground">&gt; create</p>
                      <p>Archive tools into sparks you can reignite.</p>
                  </div>
                </div>

                <div className="space-y-1.5 font-mono text-[13px] leading-7 text-foreground">
                  <p>Built with AI, tuned by human taste.</p>
                  <p>Arcory, from 0 to 1, is ignition, not arrival.</p>
                </div>

                <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-foreground">
                  Arcory is a living archive.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-[80px] space-y-4">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">GALLERY</p>
          <AboutPortrait className="w-full" />
        </section>

        <footer className="mt-auto pt-10">
          <div className="flex items-center gap-4 pt-0 pb-0">
            <div className="h-px flex-1 bg-border" />
            <p className="text-xs uppercase tracking-[0.06em] text-foreground">Archive + story</p>
            <div className="h-px flex-1 bg-border" />
          </div>
        </footer>
      </div>
    </main>
  );
}
