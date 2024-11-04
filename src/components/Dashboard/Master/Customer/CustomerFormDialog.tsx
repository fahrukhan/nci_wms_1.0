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
  Contact,
  NewContact,
} from "@/drizzle/schema/MasterData/contacts.schema";
import {
  createContact,
  updateContact,
  deleteContact,
} from "@/app/actions/contactActions";

interface CustomerFormDialogProps {
  contact?: Contact;
  isEdit?: boolean;
  isSupplier?: boolean;
  onCustomerAdded?: () => void;
  onCustomerUpdated?: () => void;
  onCustomerDeleted?: () => void;
}

export function CustomerFormDialog({
  contact,
  isEdit = false,
  isSupplier,
}: CustomerFormDialogProps) {
  const initialFormData: NewContact = contact || {
    name: "",
    address: "",
    phone: "",
    type: isSupplier ? "supplier" : "customer",
  };

  const [formData, setFormData] = useState<NewContact>(initialFormData);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof NewContact) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEdit && contact) {
        await updateContact({
          ...formData,
          contact_id: contact.contact_id,
          type: isSupplier ? "supplier" : "customer",
        });
      } else {
        await createContact({
          ...formData,
          type: isSupplier ? "supplier" : "customer",
        });
        setFormData({
          name: "",
          address: "",
          phone: "",
          type: isSupplier ? "supplier" : "customer",
        });
      }
      setIsOpen(false);
      window.location.href = "/master/customer";
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete this ${
          isSupplier ? "supplier" : "customer"
        }?`
      ) &&
      contact
    ) {
      try {
        await deleteContact(contact.contact_id);
        setIsOpen(false);
        window.location.href = "/master/customer";
      } catch (error) {
        console.error("Error:", error);
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
          <Button variant="secondary">Add New Contact</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Contact" : "Add New Contact"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update or delete the contact here."
              : "Create a new contact here. Click save when you’re done."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <CustomFormInput
              title="Name"
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              className="col-span-3"
            />
            <CustomFormInput
              title="Address"
              type="text"
              value={formData.address}
              onChange={handleChange("address")}
              className="col-span-3"
            />
            <CustomFormInput
              title="Phone"
              type="text"
              value={formData.phone}
              onChange={handleChange("phone")}
              className="col-span-3"
            />
            {/* {isEdit ? (
              <div />
            ) : (
              <CustomFormInput
                title="Type"
                type="select"
                value={formData.type ?? "customer"}
                onChange={handleChange("type")}
                options={[
                  { value: "supplier", label: "Supplier" },
                  { value: "customer", label: "Customer" },
                ]}
                className="col-span-3"
              />
            )} */}
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
