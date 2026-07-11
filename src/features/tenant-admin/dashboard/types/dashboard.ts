export type DashboardKpi = {
  id: string;
  label: string;
  value: string;
  hint: string;
};

export type SeatUsage = {
  active: number;
  quota: number;
};

export type RecentMemo = {
  id: string;
  title: string;
  department: string;
  sentAt: string;
  readRate: number;
  status: "published" | "draft" | "scheduled" | "archived";
};

export type DashboardSummary = {
  institution: {
    id: string;
    name: string;
    shortcode: string;
    subdomain: string;
  };
  kpis: DashboardKpi[];
  seatUsage: SeatUsage;
  recentMemos: RecentMemo[];
};
