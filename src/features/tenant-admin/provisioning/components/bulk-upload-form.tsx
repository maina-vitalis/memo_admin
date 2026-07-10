"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import { useBulkUploadStudents } from "@/features/tenant-admin/provisioning/api/use-bulk-upload-students";
import type { BulkUploadResult } from "@/features/tenant-admin/provisioning/types/bulk-upload";
import { downloadRosterTemplate } from "@/features/tenant-admin/provisioning/utils/export-roster-template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ACCEPTED_EXTENSIONS = ".xlsx,.xls";

export function BulkUploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<BulkUploadResult | null>(null);
  const uploadMutation = useBulkUploadStudents();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedFile) return;

    try {
      const uploadResult = await uploadMutation.mutateAsync(selectedFile);
      setResult(uploadResult);

      if (uploadResult.createdCount > 0) {
        toast.success(
          `Created ${uploadResult.createdCount} trainee account${uploadResult.createdCount === 1 ? "" : "s"}. Students log in with their school code, admission number, and admission number as the initial password.`,
        );
      } else {
        toast.error("No accounts were created — check the row-by-row results below.");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload file";
      toast.error(message);
    }
  }

  function handleDownloadTemplate() {
    try {
      downloadRosterTemplate();
      toast.success("Template downloaded. Fill it in and upload when ready.");
    } catch {
      toast.error("Could not download the template. Please try again.");
    }
  }

  function handleReset() {
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const issueRows =
    result?.rows.filter((row) => row.status !== "created") ?? [];

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Upload roster</CardTitle>
          <CardDescription>
            Upload an Excel file (.xlsx or .xls) with one row per trainee.
            Every row needs <strong>First Name</strong>,{" "}
            <strong>Last Name</strong>, and an <strong>Admission Number</strong>.
          </CardDescription>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              All provisioned accounts are trainees. Assign other roles later
              from the directory.
            </li>
            <li>
              <strong>Email</strong> is optional in the template and stored for
              future use — credentials are not emailed during bulk upload.
            </li>
            <li>
              Initial password equals the admission number. Students must reset
              it on first login.
            </li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">
            Phone Number and Department columns are optional.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 rounded-lg border border-dashed bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Need the roster format?
              </p>
              <p className="text-sm text-muted-foreground">
                Download the Excel template, share it with your registry team,
                then upload the completed file below.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadTemplate}
              disabled={uploadMutation.isPending}
              className="shrink-0"
            >
              <DownloadIcon className="h-4 w-4" />
              Download Excel template
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roster-file">Roster file</Label>
            <Input
              id="roster-file"
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS}
              disabled={uploadMutation.isPending}
              onChange={(event) =>
                setSelectedFile(event.target.files?.[0] ?? null)
              }
            />
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{result.totalRows} total rows</Badge>
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                  {result.createdCount} created
                </Badge>
                <Badge variant="outline">{result.skippedCount} skipped</Badge>
                <Badge variant="destructive">{result.failedCount} failed</Badge>
              </div>

              {issueRows.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Admission Number</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {issueRows.map((row) => (
                        <TableRow key={row.row}>
                          <TableCell>{row.row}</TableCell>
                          <TableCell>{row.identifier ?? "—"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                row.status === "failed"
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {row.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-normal">
                            {row.reason}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Every row was created successfully.
                </p>
              )}
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4 border-t sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Fix failed rows in the spreadsheet and re-upload — created and
            skipped rows won&apos;t be duplicated.
          </p>

          <div className="flex gap-3 sm:ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/directory")}
              disabled={uploadMutation.isPending}
            >
              {result ? "Back to directory" : "Cancel"}
            </Button>
            {result ? (
              <Button type="button" onClick={handleReset}>
                Upload another file
              </Button>
            ) : (
              <Button type="submit" disabled={!selectedFile || uploadMutation.isPending}>
                {uploadMutation.isPending ? (
                  <>
                    <Spinner />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
