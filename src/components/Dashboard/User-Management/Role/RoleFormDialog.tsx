"use client";
import { useState } from "react";
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
import { Settings } from "lucide-react";
import { CustomFormInput } from "@/components/FormComponent/CustomFormInput";
import {
  createRoles,
  deleteRoles,
  updateRoles,
} from "@/app/actions/roleActions";
import { CheckboxFormInput } from "@/components/FormComponent/CheckboxFormInput";
import { capitalizeFirstLetter } from "@/lib/utils/capitalize";
import {
  MenuDTO,
  RoleCreateDTO,
  RoleDTO,
  RoleUpdateDTO,
} from "@/types/Dashboard/User-Management/userManagement";

interface RoleFormDialogProps {
  role?: RoleDTO;
  isEdit?: boolean;
  allMenus: MenuDTO[];
}

export const RoleFormDialog: React.FC<RoleFormDialogProps> = ({
  role,
  isEdit = false,
  allMenus,
}) => {
  const [formData, setFormData] = useState<RoleCreateDTO | RoleUpdateDTO>(
    role
      ? {
          role_id: role.role_id,
          role_name: role.role_name,
          menu_ids: role.menu_ids,
        }
      : { role_name: "", menu_ids: "" }
  );

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDialogOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setFormData(
        isEdit && role
          ? {
              role_id: role.role_id,
              role_name: role.role_name,
              menu_ids: role.menu_ids,
            }
          : {
              role_name: "",
              menu_ids: "",
            }
      );
    }
  };

  const handleChange =
    (field: keyof (RoleCreateDTO | RoleUpdateDTO)) =>
    (value: string | string[]) => {
      setFormData((prev) => ({
        ...prev,
        [field]:
          field === "menu_ids" && Array.isArray(value)
            ? value.join(",")
            : value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEdit && "role_id" in formData) {
        await updateRoles(formData as RoleUpdateDTO);
      } else {
        await createRoles(formData as RoleCreateDTO);
      }
      setIsOpen(false);
      window.location.href = "/user-management/roles";
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this role?") && role) {
      try {
        await deleteRoles(role.role_id.toString());
        setIsOpen(false);
        window.location.href = "/user-management/roles";
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  const groupMenusByParent = (menus: MenuDTO[]) => {
    return menus.reduce((acc, menu) => {
      if (!acc[menu.parent]) {
        acc[menu.parent] = [];
      }
      acc[menu.parent].push(menu);
      return acc;
    }, {} as Record<string, MenuDTO[]>);
  };

  const handleSelectAll = () => {
    setFormData((prev) => {
      const allMenuIds = allMenus.map((menu) => menu.menu_id.toString());
      const currentMenuIds = prev.menu_ids.split(",").filter(Boolean);

      return {
        ...prev,
        menu_ids:
          currentMenuIds.length === allMenus.length ? "" : allMenuIds.join(","),
      };
    });
  };

  const groupedMenus = groupMenusByParent(allMenus);

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon">
            <Settings color="#BCBCBC" size={20} />
          </Button>
        ) : (
          <Button variant="secondary">Add New Role</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Role" : "Add New Role"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update or delete the role here."
              : "Create a new role here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <CustomFormInput
              title="Name"
              type="text"
              value={formData.role_name}
              onChange={(value: string | string[]) =>
                handleChange("role_name")(
                  typeof value === "string" ? value : value.join(",")
                )
              }
              className="col-span-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(groupedMenus).map((parent) => (
                <div key={parent}>
                  <h3 className="text-base text-gray-400 font-medium">
                    {capitalizeFirstLetter(parent)}
                  </h3>
                  <CheckboxFormInput
                    options={groupedMenus[parent].map((menu) => ({
                      value: menu.menu_id.toString(),
                      label: capitalizeFirstLetter(menu.menu_name),
                    }))}
                    value={formData.menu_ids.split(",").filter(Boolean)}
                    onChange={(newMenuIds) =>
                      handleChange("menu_ids")(newMenuIds)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="flex">
            <div className="flex justify-between items-center">
              <Button type="button" variant="link" onClick={handleSelectAll}>
                Select All
              </Button>
              <div>
                {isEdit && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    className="mr-2"
                  >
                    Delete
                  </Button>
                )}
                <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
