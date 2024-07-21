import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { DataTable } from "./data-table-components/data-table";
import { columns } from "./data-table-components/columns";

import { getTaskData } from "@/actions/taskActions";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const data = await getTaskData();

  return (
    <div className="pb-2 pt-3">
      <DataTable data={data} columns={columns} />
    </div>
  );
}
