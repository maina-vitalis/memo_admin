export type MemoDetail = {
  id: string;
  subject: string;
  body: string;
  priority: "low" | "normal" | "high" | "urgent";
  category: "general" | "academic" | "administrative" | "emergency" | "event";
  status: "published" | "draft" | "archived";
  targetType: "broadcast" | "department" | "role" | "individual";
  department: string;
  senderName: string;
  sentAt: string;
  expiresAt: string | null;
  recipients: {
    total: number;
    read: number;
    readRate: number;
  };
};

export type MemoLedgerRow = {
  id: string;
  title: string;
  category: MemoDetail["category"];
  priority: MemoDetail["priority"];
  department: string;
  sentAt: string;
  status: MemoDetail["status"];
  recipients: number;
  readRate: number;
};

export type MemoLedgerResponse = {
  items: MemoLedgerRow[];
  total: number;
  page: number;
  pageSize: number;
};
