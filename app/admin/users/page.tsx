import AdminUsersList from "@/src/components/AdminUsersList ";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminUsersList />
    </Suspense>
  );
}
