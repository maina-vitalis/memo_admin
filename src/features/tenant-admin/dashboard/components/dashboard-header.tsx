import { PageHeader } from "@/components/page-header";
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
  if (isLoading) {
    return (
      <PageHeader
        title=""
        isLoading
      />
    );
  }

  return (
    <PageHeader
      title={institutionName ?? "Institution dashboard"}
      description={
        shortcode ? `${shortcode} · Overview` : "Overview of your institution"
      }
    />
  );
}
