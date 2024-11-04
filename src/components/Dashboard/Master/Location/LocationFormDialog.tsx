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
import { Settings } from "lucide-react";
import { CustomFormInput } from "@/components/FormComponent/CustomFormInput";
import {
  createLocation,
  deleteLocation,
  updateLocation,
  fetchLocationsByWarehouse,
} from "@/app/actions/locationActions";
import { Warehouse } from "@/drizzle/schema/MasterData/warehouses.schema";
import { LocationDTO } from "@/types/Master/LocationDto";

interface LocationFormDialogProps {
  location?: LocationDTO;
  warehouses: Warehouse[];
  isEdit?: boolean;
}
export function LocationFormDialog({
  location,
  warehouses,

  isEdit = false,
}: LocationFormDialogProps) {
  const initialFormData: LocationDTO = location || {
    name: "",
    warehouse_id: 0,
    warehouse_name: "",
    location_id: 0,
    parent_id: 0,
    path: "",
    pathName: "",
  };

  const [formData, setFormData] = useState<LocationDTO>(initialFormData);
  const [isOpen, setIsOpen] = useState(false);
  const [parentLocations, setParentLocations] = useState<LocationDTO[]>([]);

  useEffect(() => {
    if (formData.warehouse_id && !isEdit) {
      fetchLocationsByWarehouse(formData.warehouse_id)
        .then(setParentLocations)
        .catch((error: any) =>
          console.error("Error fetching parent locations:", error)
        );
    }
  }, [formData.warehouse_id, isEdit]);

  const handleChange = (field: keyof LocationDTO) => (value: string) => {
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
      if (isEdit && location) {
        await updateLocation({
          ...formData,
          location_id: location.location_id,
        });
      } else {
        await createLocation({
          name: formData.name,
          warehouse_id: formData.warehouse_id,
          parent_id: formData.parent_id,
        });
        setFormData(initialFormData);
      }
      setIsOpen(false);
      window.location.href = "/master/location";
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this location?") &&
      location
    ) {
      try {
        await deleteLocation(location.location_id);
        setIsOpen(false);
        window.location.href = "/master/location";
      } catch (error: any) {
        alert(`Error deleting location: ${error.message}`);
        console.error("Error deleting location:", error);
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
          <Button variant="secondary">Add New Location</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Location" : "Add New Location"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update or delete the location here."
              : "Create a new location here. Click save when you're done."}
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
            {isEdit ? (
              <>
                <CustomFormInput
                  title="Warehouse"
                  type="text"
                  disabled={true}
                  value={formData.warehouse_name}
                  onChange={() => {}} // Empty function for disabled input
                  className="col-span-12"
                />
                <CustomFormInput
                  title="Path"
                  type="text"
                  disabled={true}
                  value={formData.pathName ?? ""}
                  onChange={() => {}} // Empty function for disabled input
                  className="col-span-12"
                />
              </>
            ) : (
              <>
                <CustomFormInput
                  title="Warehouse"
                  type="select"
                  value={formData.warehouse_id?.toString() ?? ""}
                  onChange={handleChange("warehouse_id")}
                  options={warehouses.map((warehouse) => ({
                    value: warehouse.warehouse_id.toString(),
                    label: warehouse.name,
                  }))}
                />
                <CustomFormInput
                  title="Parent Location"
                  type="select"
                  value={formData.parent_id?.toString() ?? ""}
                  onChange={handleChange("parent_id")}
                  options={parentLocations.map((loc) => ({
                    value: loc.location_id.toString(),
                    label: `${loc.location_id} - ${loc.name}`,
                  }))}
                />
              </>
            )}
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
