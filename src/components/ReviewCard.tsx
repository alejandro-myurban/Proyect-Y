import { cn } from "@/lib/utils";

interface ReviewCardProps {
  img?: string;
  name: string;
  username: string;
  body: string;
}

export function ReviewCard({ img, name, username, body }: ReviewCardProps) {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-300",
        // Dark theme styles with brand accents
        "border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 group"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="relative">
          <img 
            className="rounded-full border border-primary/20" 
            width="40" 
            height="40" 
            alt={name} 
            src={img || `https://avatar.vercel.sh/${name}`} 
          />
          <div className="absolute -bottom-1 -right-1 size-3 bg-primary rounded-full border-2 border-[#0a0a0c]" />
        </div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-bold text-white group-hover:text-primary transition-colors">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-3 text-sm text-white/70 leading-relaxed italic">
        &ldquo;{body}&rdquo;
      </blockquote>
    </figure>
  );
}
