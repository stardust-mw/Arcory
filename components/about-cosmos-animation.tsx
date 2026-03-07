import { cn } from "@/lib/utils";

export function AboutCosmosAnimation({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-[340px] w-full overflow-hidden rounded-none bg-black", className)}>
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        poster="/black-hole-poster.jpg"
        playsInline
        preload="none"
      >
        <source src="/black-hole.web.mp4" type="video/mp4" />
        <source src="/black-hole.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
