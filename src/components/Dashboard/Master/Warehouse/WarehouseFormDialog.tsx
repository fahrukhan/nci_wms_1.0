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
  NewWarehouse,
  Warehouse,
} from "@/drizzle/schema/MasterData/warehouses.schema";
import {
  createWarehouse,
  deleteWarehouse,
  updateWarehouse,
} from "@/app/actions/warehouseActions";

interface WarehouseFormDialogProps {
  warehouse?: Warehouse;
  isEdit?: boolean;
}

export function WarehouseFormDialog({
  warehouse,
  isEdit = false,
}: WarehouseFormDialogProps) {
  const initialFormData: NewWarehouse = warehouse || {
    name: "",
    address: "",
    phone: "",
    company_id: 1,
  };

  const [formData, setFormData] = useState<NewWarehouse>(initialFormData);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof NewWarehouse) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEdit && warehouse) {
        await updateWarehouse({
          ...formData,
          id: warehouse.warehouse_id.toString(),
        });
      } else {
        await createWarehouse(formData);
        setFormData({ name: "", address: "", phone: "", company_id: 1 });
      }
      setIsOpen(false);
      window.location.href = "/master/warehouse";
    } catch (error) {
      console.error("Error saving warehouse:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this warehouse?") &&
      warehouse
    ) {
      try {
        await deleteWarehouse(warehouse.warehouse_id.toString());
        setIsOpen(false);
        window.location.href = "/master/warehouse";
      } catch (error) {
        console.error("Error deleting warehouse:", error);
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
          <Button variant="secondary">Add New Warehouse</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Warehouse" : "Add New Warehouse"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update or delete the warehouse here."
              : "Create a new warehouse here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <CustomFormInput
              title="Warehouse Name"
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              className="col-span-12"
            />
            <CustomFormInput
              title="Address"
              type="text"
              value={formData.address}
              onChange={handleChange("address")}
              className="col-span-12"
            />
            <CustomFormInput
              title="Phone"
              type="text"
              value={formData.phone}
              onChange={handleChange("phone")}
              className="col-span-12"
            />
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
