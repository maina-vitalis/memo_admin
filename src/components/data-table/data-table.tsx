"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type TableOptions,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function isActionsColumn(columnId: string) {
  return columnId === "actions";
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  loadingRowCount?: number;
  emptyMessage?: string;
  className?: string;
  containerClassName?: string;
  meta?: TableOptions<TData>["meta"];
  getRowClassName?: (row: Row<TData>) => string | undefined;
  tableOptions?: Partial<
    Omit<TableOptions<TData>, "data" | "columns" | "getCoreRowModel">
  >;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  loadingRowCount = 4,
  emptyMessage = "No results.",
  className,
  containerClassName,
  meta,
  getRowClassName,
  tableOptions,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta,
    ...tableOptions,
  });

  const columnCount = columns.length;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card",
        containerClassName,
      )}
    >
      <Table className={className}>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "h-11 px-4 text-muted-foreground",
                    isActionsColumn(header.column.id) && "text-right",
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnCount }).map((__, cellIndex) => (
                  <TableCell key={cellIndex} className="px-4 py-3">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className={getRowClassName?.(row)}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "px-4 py-3",
                      isActionsColumn(cell.column.id) && "text-right",
                    )}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="h-24 px-4 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
