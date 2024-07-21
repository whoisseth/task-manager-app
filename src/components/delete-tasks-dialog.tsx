"use client";
import { deleteTask } from "@/actions/taskActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Task } from "@/db/schema";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface DeleteTasksDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tasks: Row<Task>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteTaskDialog({
  tasks,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteTasksDialogProps) {
  const [isDeletePending, startDeleteTransition] = useTransition();

  const handleDeleteTask = async () => {
    startDeleteTransition(async () => {
      try {
        await deleteTask(tasks.map((task) => task.id));
        toast.success("Task has been deleted Successfully");
        props.onOpenChange?.(false);
        onSuccess?.();
      } catch (error) {
        toast.error("There was an error deleting your task.");
      }
    });
  };

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            <span className="hidden sm:flex">Delete</span> ({tasks.length})
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{tasks.length}</span>
            {tasks.length === 1 ? " task" : " tasks"} from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={handleDeleteTask}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
