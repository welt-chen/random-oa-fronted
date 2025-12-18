import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  className?: string;
  size?: number;
  text?: string;
}

export function Loading({ className, size = 24, text }: LoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-muted-foreground",
        className
      )}
    >
      <Loader2 className="animate-spin text-blue-600" size={size} />
      {text && <span className="text-sm">{text}</span>}
    </div>
  );
}
