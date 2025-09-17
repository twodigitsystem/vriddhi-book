import { Skeleton } from "@/components/ui/skeleton";

interface DataTableSkeletonProps {
  columnCount: number;
  rowCount?: number;
}

export function DataTableSkeleton({ columnCount, rowCount = 10 }: DataTableSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-8 w-[150px]" />
      </div>
      <div className="rounded-md border">
        <div className="grid grid-cols-1 divide-y">
          <div
            className="grid items-center p-4"
            style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
          >
            {Array.from({ length: columnCount }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
          {Array.from({ length: rowCount }).map((_, i) => (
            <div
              key={i}
              className="grid items-center p-4"
              style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
            >
              {Array.from({ length: columnCount }).map((_, j) => (
                <Skeleton key={j} className="h-6 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
