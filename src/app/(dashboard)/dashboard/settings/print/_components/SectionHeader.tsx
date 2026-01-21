import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export function SectionHeader({ title, className }: SectionHeaderProps) {
  return (
    <h3 className={cn(
      "text-base font-semibold text-foreground border-b border-border pb-2 mb-4",
      className
    )}>
      {title}
    </h3>
  );
}
