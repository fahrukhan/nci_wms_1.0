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
import { Attribute } from "@/drizzle/schema/MasterData/attributes.schema";
import {
  createAttribute,
  deleteAttribute,
  updateAttribute,
} from "@/app/actions/attributeActions";
import {
  fromNewAttributeDTO,
  NewAttributeDTO,
  toAttributeDTO,
} from "@/types/Master/AttributeDto";

interface AttributeFormDialogProps {
  attribute?: Attribute;
  isEdit?: boolean;
  onAttributeAdded?: () => void;
  onAttributeUpdated?: () => void;
  onAttributeDeleted?: () => void;
}

export function AttributeFormDialog({
  attribute,
  isEdit = false,
}: AttributeFormDialogProps) {
  const initialFormData: NewAttributeDTO = attribute
    ? toAttributeDTO(attribute)
    : {
        name: "",
        type: "text",
        list: "",
        listItems: [],
      };

  const [formData, setFormData] = useState<NewAttributeDTO>(initialFormData);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleChange = (field: keyof NewAttributeDTO) => (value: string) => {
    setFormData((prev) => {
      if (field === "type" && value === "list") {
        return {
          ...prev,
          [field]: value,
          listItems: prev.list ? prev.list.split(",").filter(Boolean) : [],
        };
      } else if (field === "list") {
        return {
          ...prev,
          [field]: value,
          listItems: value.split(",").filter(Boolean),
        };
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const submitData = fromNewAttributeDTO(formData);

      if (isEdit && attribute) {
        await updateAttribute({
          ...formData,
          attribute_id: attribute.attribute_id,
        });
      } else {
        await createAttribute(submitData);
        setFormData({ name: "", type: "text", list: "", listItems: [] });
      }
      setIsOpen(false);
      window.location.href = "/master/attribute";
    } catch (error) {
      console.error("Error saving attribute:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this attribute?") &&
      attribute
    ) {
      try {
        await deleteAttribute(attribute.attribute_id);
        setIsOpen(false);
        window.location.href = "/master/attribute";
      } catch (error) {
        console.error("Error deleting attribute:", error);
      }
    }
  };

  const handleListItemChange = (index: number) => (value: string) => {
    setFormData((prev) => {
      const newListItems = [...prev.listItems];
      newListItems[index] = value;
      return {
        ...prev,
        listItems: newListItems,
        list: newListItems.join(","),
      };
    });
  };

  const addListItem = () => {
    setFormData((prev) => ({
      ...prev,
      listItems: [...prev.listItems, ""],
      list: [...prev.listItems, ""].join(","),
    }));
  };

  const removeListItem = (index: number) => {
    setFormData((prev) => {
      const newListItems = prev.listItems.filter((_, i) => i !== index);
      return {
        ...prev,
        listItems: newListItems,
        list: newListItems.join(","),
      };
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon">
            <Settings color="#BCBCBC" size={20} />
          </Button>
        ) : (
          <Button variant="secondary">Add New Attribute</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Attribute" : "Add New Attribute"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update or delete the attribute here."
              : "Create a new attribute here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <CustomFormInput
              title="Attribute Name"
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
            />
            <CustomFormInput
              title="Attribute Type"
              type="select"
              disabled={isEdit}
              value={formData.type}
              onChange={handleChange("type")}
              options={[
                { value: "text", label: "Text" },
                { value: "number", label: "Number" },
                { value: "date", label: "Date" },
                { value: "list", label: "List" },
              ]}
            />
            {formData.type === "list" ? (
              <div className="flex flex-col">
                <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-left">
                  List Items
                </h3>
                {formData.listItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CustomFormInput
                      title=""
                      type="text"
                      value={item}
                      onChange={handleListItemChange(index)}
                      className="w-[310px]"
                    />
                    <Button
                      type="button"
                      variant={"ghost"}
                      onClick={() => removeListItem(index)}
                      className="max-w-fit w-20 mt-1"
                    >
                      <span className="text-sm font-medium text-red-400">
                        Remove
                      </span>
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={addListItem}
                  className="mt-2 text-black bg-[#EBEEF2] border-[#EBEEF2] px-4 py-2"
                >
                  Add Item
                </Button>
              </div>
            ) : (
              <div />
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
            <Button type="submit">
              {isEdit ? "Update Attribtue" : "Create Attribute"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
