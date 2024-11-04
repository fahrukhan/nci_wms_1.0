"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Eye, EyeOff } from "lucide-react";
import { CustomFormInput } from "@/components/FormComponent/CustomFormInput";
import { NewUser, User } from "@/drizzle/schema/UserManagement/users.schema";
import {
  createUsers,
  deleteUsers,
  updateUsers,
} from "@/app/actions/userActions";
import { RoleDTO } from "@/types/Dashboard/User-Management/userManagement";
import { getWarehouses } from "@/app/actions/locationActions";
import { Warehouse } from "@/drizzle/schema/MasterData/warehouses.schema";

interface UserWithWarehouses extends User {
  warehouse_ids?: number[];
}

interface UserDTO {
  id: string;
  email: string;
  password: string;
  phone: string;
  username: string;
  role_id: number;
  warehouse_ids: number[];
}

interface UserFormDialogProps {
  user?: UserWithWarehouses;
  isEdit?: boolean;
  roleData: RoleDTO[];
}

export function UserFormDialog({
  user,
  isEdit = false,
  roleData,
}: UserFormDialogProps) {
  const router = useRouter();
  const initialFormData: UserDTO = user
    ? {
        id: user.id.toString(),
        email: user.email,
        password: "", // We don't set the password here for security reasons
        role_id: user.role_id,
        phone: user.phone || "",
        username: user.username,
        warehouse_ids: user.warehouse_ids || [],
      }
    : {
        id: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        role_id: 0,
        warehouse_ids: [],
      };

  const [formData, setFormData] = useState<UserDTO>(initialFormData);
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  useEffect(() => {
    if (isOpen) {
      getWarehouseData();
    }
  }, [isOpen]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getWarehouseData = async () => {
    try {
      const fetchedWarehouses = await getWarehouses();
      setWarehouses(fetchedWarehouses);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const handleChange =
    (field: keyof UserDTO) => (value: string | number | number[]) => {
      setFormData((prev) => ({
        ...prev,
        [field]:
          field === "role_id"
            ? value
              ? parseInt(value as string, 10)
              : 0
            : field === "warehouse_ids"
            ? value
            : value,
      }));
    };

  const handleWarehouseChange = (warehouseId: number) => {
    setFormData((prev) => ({
      ...prev,
      warehouse_ids: prev.warehouse_ids.includes(warehouseId)
        ? prev.warehouse_ids.filter((id) => id !== warehouseId)
        : [...prev.warehouse_ids, warehouseId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEdit && user) {
        await updateUsers({
          ...formData,
          id: user.id.toString(),
        });
      } else {
        await createUsers({
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          username: formData.username,
          role_id: formData.role_id,
          warehouse_ids: formData.warehouse_ids,
        });
      }
      setIsOpen(false);
      router.push("/user-management/users");
      router.refresh();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?") && user) {
      try {
        await deleteUsers(user.id.toString());
        setIsOpen(false);
        router.push("/user-management/users");
        router.refresh();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon">
            <Settings color="#BCBCBC" size={20} />
          </Button>
        ) : (
          <Button variant="secondary">Add New User</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update or delete the user here."
              : "Create a new user here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <CustomFormInput
              title="Email"
              type="text"
              value={formData.email}
              onChange={handleChange("email")}
              className="col-span-12"
            />
            <CustomFormInput
              title="Username"
              type="text"
              value={formData.username}
              onChange={handleChange("username")}
              className="col-span-12"
            />
            <div className="relative">
              <CustomFormInput
                title="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange("password")}
                className="col-span-12 pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <CustomFormInput
              title="Phone"
              type="text"
              value={formData.phone}
              onChange={handleChange("phone")}
              className="col-span-12"
            />
            <CustomFormInput
              title="Role"
              type="select"
              value={formData.role_id.toString()}
              onChange={handleChange("role_id")}
              options={roleData.map((role) => ({
                value: role.role_id.toString(),
                label: role.role_name,
              }))}
              className="col-span-12"
            />
          </div>
          <div className="col-span-12">
            <label className="block text-sm font-medium text-gray-700">
              Warehouses
            </label>
            <div className="mt-1 space-y-2">
              {warehouses.map((warehouse) => (
                <div key={warehouse.warehouse_id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`warehouse-${warehouse.warehouse_id}`}
                    checked={formData.warehouse_ids.includes(
                      warehouse.warehouse_id
                    )}
                    onChange={() =>
                      handleWarehouseChange(warehouse.warehouse_id)
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`warehouse-${warehouse.warehouse_id}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {warehouse.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            {isEdit && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
            <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
