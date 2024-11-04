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
import { CustomFormInput } from "@/components/FormComponent/CustomFormInput";
import { NewLocation } from "@/drizzle/schema/MasterData/locations.schema";
import { createLocation } from "@/app/actions/locationActions";

export function LocationAddDialog() {
  const initialFormData: NewLocation = {
    name: "",
    warehouse_id: 0,
    location_id: 0,
    parent_id: 0,
    path: "",
    pathName: "",
  };

  const [formData, setFormData] = useState<NewLocation>(initialFormData);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof NewLocation) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "warehouse_id" ||
        field === "location_id" ||
        field === "parent_id"
          ? value === ""
            ? undefined
            : parseInt(value, 10)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createLocation({
        ...formData,
      });
      setFormData(initialFormData);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating location:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add New Location</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
          <DialogDescription>
            Create a new location here. Click save when you`re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <CustomFormInput
              title="Location Name"
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              className="col-span-12"
            />
            <CustomFormInput
              title="Warehouse ID"
              type="number"
              value={formData.warehouse_id.toString()}
              onChange={handleChange("warehouse_id")}
              className="col-span-12"
            />
            <CustomFormInput
              title="Location ID"
              type="number"
              value={formData.location_id?.toString() ?? ""}
              onChange={handleChange("location_id")}
              className="col-span-12"
            />
            <CustomFormInput
              title="Parent ID"
              type="number"
              value={formData.parent_id?.toString() ?? ""}
              onChange={handleChange("parent_id")}
              className="col-span-12"
            />
            <CustomFormInput
              title="Path"
              type="text"
              value={formData.path ?? ""}
              onChange={handleChange("path")}
              className="col-span-12"
            />
            <CustomFormInput
              title="Path Name"
              type="text"
              value={formData.pathName ?? ""}
              onChange={handleChange("pathName")}
              className="col-span-12"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
