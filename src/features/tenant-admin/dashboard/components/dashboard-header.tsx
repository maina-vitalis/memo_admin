import { Skeleton } from "@/components/ui/skeleton";

type DashboardHeaderProps = {
  institutionName?: string;
  shortcode?: string;
  isLoading?: boolean;
};

export function DashboardHeader({
  institutionName,
  shortcode,
  isLoading,
}: DashboardHeaderProps) {
  return (
    <div>
      {isLoading ? (
        <>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-40" />
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-foreground">
            {institutionName ?? "Institution dashboard"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {shortcode ? `${shortcode} · Overview` : "Overview of your institution"}
          </p>
        </>
      )}
    </div>
  );
}
