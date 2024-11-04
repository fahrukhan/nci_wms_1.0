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
  Category,
  NewCategory,
} from "@/drizzle/schema/MasterData/categories.schema";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/app/actions/categoryActions";

interface CategoryFormDialogProps {
  category?: Category;
  isEdit?: boolean;
  onCategoryAdded?: () => void;
  onCategoryUpdated?: () => void;
  onCategoryDeleted?: () => void;
}

export function CategoryFormDialog({
  category,
  isEdit = false,
}: CategoryFormDialogProps) {
  const initialFormData: NewCategory = category || {
    name: "",
  };

  const [formData, setFormData] = useState<NewCategory>(initialFormData);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof NewCategory) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEdit && category) {
        await updateCategory({
          ...formData,
          category_id: category.category_id,
        });
      } else {
        await createCategory(formData);
        setFormData({ name: "" });
      }
      setIsOpen(false);
      window.location.href = "/master/category";
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this category?") &&
      category
    ) {
      try {
        await deleteCategory(category.category_id);
        setIsOpen(false);
        window.location.href = "/master/category";
      } catch (error) {
        console.error("Error deleting category:", error);
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
          <Button variant="secondary">Add New Category</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update or delete the category here."
              : "Create a new category here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <CustomFormInput
              title="Category Name"
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
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
