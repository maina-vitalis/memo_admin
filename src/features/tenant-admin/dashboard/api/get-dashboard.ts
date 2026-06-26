import {
  tenantApi,
  tenantApiConfig,
  withMockDelay,
} from "@/features/tenant-admin/shared/api/client";
import type { DashboardSummary } from "@/features/tenant-admin/dashboard/types/dashboard";

const MOCK_DASHBOARD: DashboardSummary = {
  institution: {
    id: "kabete",
    name: "Kabete National Polytechnic",
    shortcode: "KNP",
    subdomain: "kabete.nostalqic.com",
  },
  kpis: [
    {
      id: "students",
      label: "Students",
      value: "12,500",
      hint: "Enrolled learners",
    },
    {
      id: "staff",
      label: "Staff",
      value: "48",
      hint: "Active staff accounts",
    },
    {
      id: "departments",
      label: "Departments",
      value: "12",
      hint: "Academic units",
    },
    {
      id: "active-memos",
      label: "Active memos",
      value: "8",
      hint: "Published this term",
    },
  ],
  seatUsage: {
    active: 450,
    quota: 500,
  },
  recentMemos: [
    {
      id: "memo-1",
      title: "End-of-term examination timetable",
      department: "Academic Affairs",
      sentAt: "12 Mar 2026",
      readRate: 92,
      status: "published",
    },
    {
      id: "memo-2",
      title: "Workshop safety briefing",
      department: "Automotive Engineering",
      sentAt: "10 Mar 2026",
      readRate: 78,
      status: "published",
    },
    {
      id: "memo-3",
      title: "Fee payment deadline reminder",
      department: "Finance",
      sentAt: "8 Mar 2026",
      readRate: 85,
      status: "published",
    },
    {
      id: "memo-4",
      title: "Staff development seminar",
      department: "Human Resources",
      sentAt: "5 Mar 2026",
      readRate: 64,
      status: "scheduled",
    },
    {
      id: "memo-5",
      title: "ICT maintenance window",
      department: "ICT Services",
      sentAt: "1 Mar 2026",
      readRate: 71,
      status: "published",
    },
  ],
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (tenantApiConfig.useMock) {
    return withMockDelay(MOCK_DASHBOARD);
  }

  return tenantApi<DashboardSummary>("/admin/dashboard");
}
