"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TrendingUp, TrendingDown, FilePenLine, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Expense } from "./schema";
import { Task } from "@/db/schema";
import { Switch } from "@/components/ui/switch";
import { useState, useTransition } from "react";
import { toggleTask } from "@/actions/taskActions";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { EditTaskDialog } from "@/components/edit-task-dialog";
import { DeleteTaskDialog } from "@/components/delete-tasks-dialog";

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize">{row.getValue("title")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const rawDescription = row.getValue("description");

      // Check if Description is coming from data
      const isDescriptionTrue =
        typeof rawDescription === "string" && rawDescription.trim();

      return (
        <div className="flex space-x-2">
          <span
            className={cn("max-w-[400px] truncate font-medium capitalize", {
              "font-normal text-muted-foreground": !isDescriptionTrue,
            })}
          >
            {/* {isDescriptionTrue ? rawDescription : "-"} */}
            {isDescriptionTrue ? rawDescription : "no description"}
          </span>
        </div>
      );
    },
    // enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "completed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completed" />
    ),
    cell: ({ row }) => {
      const [isToggleTaskPending, setToggleTaskTransition] = useTransition();

      async function handleToggleTask() {
        setToggleTaskTransition(async () => {
          try {
            const currentCompletedStatus = row.getValue("completed");
            await toggleTask(row.original.id);

            if (currentCompletedStatus) {
              toast.success("Task marked as not completed.");
            } else {
              toast.success("Task marked as completed.");
            }
          } catch (error) {
            toast.error(
              `There was an error - ${error} updating the task status.`,
            );
            console.error(error);
          }
        });
      }

      return (
        <div className="flex w-[100px] items-center">
          <span>
            {isToggleTaskPending ? (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Switch
                checked={row.getValue("completed")}
                onCheckedChange={handleToggleTask}
              />
            )}
          </span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },

  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate");

      // let formattedDate = "-";
      let formattedDate = "Not set";
      let isValidDate = false;

      // Check if dueDate is a valid string or number
      if (dueDate) {
        // Handle date conversion more robustly
        const dateValue = new Date(row.getValue("dueDate"));

        // Check if the date is valid
        isValidDate = !isNaN(dateValue.getTime());
        if (isValidDate) {
          formattedDate = dateValue.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        } else {
          formattedDate = "Not set";
        }
      }

      return (
        <div className="flex w-[100px] items-center">
          <span
            className={cn({
              "font-normal text-muted-foreground": !isValidDate,
            })}
          >
            {formattedDate}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showEditTaskDialog, setShowEditTaskDialog] = useState(false);
      const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false);

      return (
        <div className="flex justify-center gap-2">
          <EditTaskDialog
            task={row.original}
            open={showEditTaskDialog}
            onOpenChange={setShowEditTaskDialog}
          />
          <Button
            size={"sm"}
            variant="outline"
            onClick={() => setShowEditTaskDialog(true)}
          >
            <FilePenLine className="mr-2 size-4" />
            Edit
          </Button>

          <DeleteTaskDialog
            open={showDeleteTaskDialog}
            onOpenChange={setShowDeleteTaskDialog}
            showTrigger={false}
            onSuccess={() => row.toggleSelected(false)}
            tasks={[row.original]}
          />
          <Button
            size={"sm"}
            variant="destructive"
            onClick={() => setShowDeleteTaskDialog(true)}
          >
            <Trash className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      );
    },
  },
];
