"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { incomeType, categories } from "./data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
// import { DataTableViewOptions } from "@/components/ui/data-table-view-options";

import { useState } from "react";
import { DataTableViewOptions } from "./data-table-view-options";
import { TrashIcon } from "lucide-react";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { DeleteTaskDialog } from "@/components/delete-tasks-dialog";
import { Task } from "@/db/schema";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Filter labels..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("title")?.setFilterValue(event.target.value);
          }}
          className="w-[150px] lg:w-[250px]"
        />
      </div>

      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <DeleteTaskDialog
            tasks={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original as Task)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        ) : null}

        <AddTaskDialog />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
