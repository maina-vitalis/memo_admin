import { FileText, Image as ImageIcon, Paperclip } from "lucide-react";

import { formatFileSize } from "@/features/tenant-admin/memos/lib/memo-content";
import type { MemoAttachment } from "@/features/tenant-admin/memos/types/memo";

type MemoAttachmentsListProps = {
  attachments: MemoAttachment[];
};

function AttachmentIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) {
    return <ImageIcon className="size-4 text-primary" aria-hidden />;
  }

  if (mimeType === "application/pdf") {
    return <FileText className="size-4 text-primary" aria-hidden />;
  }

  return <Paperclip className="size-4 text-primary" aria-hidden />;
}

export function MemoAttachmentsList({ attachments }: MemoAttachmentsListProps) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-foreground">Attachments</h4>
      <ul className="mt-2 space-y-2">
        {attachments.map((attachment) => (
          <li key={attachment.id}>
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm transition-colors hover:bg-muted/60"
            >
              <AttachmentIcon mimeType={attachment.mimeType} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">
                  {attachment.fileName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(attachment.sizeBytes)}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
