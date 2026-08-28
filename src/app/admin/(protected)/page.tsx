import { redirect } from "next/navigation";

// The old /admin dashboard now redirects to the property selector
// Individual property dashboards are at /admin/piero and /admin/cielo
export default function AdminProtectedRoot() {
  redirect("/admin");
}
