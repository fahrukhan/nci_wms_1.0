import { fetchMenus, fetchRoles } from "@/app/actions/roleActions";
import { RolesTable } from "@/components/Dashboard/User-Management/Role/RoleTable";

export default async function Page() {
  const rolesWithMenus = await fetchRoles();
  const allMenus = await fetchMenus();

  return (
    <section className="table-wrapper">
      <RolesTable rolesData={rolesWithMenus} allMenus={allMenus} />
    </section>
  );
}
