"use client";
import { useState } from "react";
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
  Contact,
  NewContact,
} from "@/drizzle/schema/MasterData/masterData.schema";
import {
  createContact,
  deleteContact,
  updateContact,
} from "@/app/actions/contactActions";

interface SupplierFormDialogProps {
  supplier?: Contact;
  isEdit?: boolean;
}

export function SupplierFormDialog({
  supplier,
  isEdit = false,
}: SupplierFormDialogProps) {
  const initialFormData: NewContact = supplier || {
    name: "",
    address: "",
    phone: "",
    type: "supplier",
  };

  const [formData, setFormData] = useState<NewContact>(initialFormData);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field: keyof NewContact) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEdit && supplier) {
        await updateContact({
          ...formData,
          contact_id: supplier.contact_id,
          type: "supplier",
        });
      } else {
        await createContact(formData);
        setFormData(initialFormData);
      }
      setIsOpen(false);
      window.location.href = "/master/supplier";
    } catch (error) {
      console.error("Error saving supplier:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this supplier?") &&
      supplier
    ) {
      try {
        await deleteContact(supplier.contact_id);
        setIsOpen(false);
        window.location.href = "/master/supplier";
      } catch (error) {
        console.error("Error deleting supplier:", error);
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
          <Button variant="secondary">Add New Supplier</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Supplier" : "Add New Supplier"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update or delete the supplier here."
              : "Create a new supplier here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <CustomFormInput
              title="Supplier Name"
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
            />
            <CustomFormInput
              title="Address"
              type="text"
              value={formData.address}
              onChange={handleChange("address")}
            />
            <CustomFormInput
              title="Phone"
              type="text"
              value={formData.phone}
              onChange={handleChange("phone")}
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
            <Button type="submit">
              {isEdit ? "Update Supplier" : "Create Supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
