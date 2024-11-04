import { fetchRoles } from "@/app/actions/roleActions";
import { fetchUsers } from "@/app/actions/userActions";
import { UsersTable } from "@/components/Dashboard/User-Management/User/UserTable";
import { getUserWarehouses } from "@/lib/utils/GetUserWarehouse";

export default async function Page() {
  const data = await fetchUsers();
  const roleData = await fetchRoles();
  return (
    <section className="table-wrapper">
      <UsersTable usersData={data} rolesData={roleData} />
    </section>
  );
}
