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
  Location,
  NewLocation,
} from "@/drizzle/schema/MasterData/locations.schema";
import { deleteLocation, updateLocation } from "@/app/actions/locationActions";

interface LocationEditDialogProps {
  location: Location;
}

export function LocationEditDialog({ location }: LocationEditDialogProps) {
  const [formData, setFormData] = useState<NewLocation>(location);
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
      await updateLocation({
        ...formData,
        location_id: location.location_id,
        parent_id: formData.parent_id ?? null,
        path: formData.path ?? "",
        pathName: formData.pathName ?? "",
      });
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await deleteLocation(location.location_id);
        setIsOpen(false);
        router.refresh();
      } catch (error) {
        console.error("Error deleting location:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings color="#BCBCBC" size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogDescription>
            Update or delete the location here.
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
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
