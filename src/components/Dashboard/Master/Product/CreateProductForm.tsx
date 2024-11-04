"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CustomFormInput } from "@/components/FormComponent/CustomFormInput";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import {
  Attribute,
  Category,
  Unit,
} from "@/drizzle/schema/MasterData/masterData.schema";
import { createProduct } from "@/app/actions/productActions";

interface FormData {
  name: string;
  image: File | null;
  category_id: string;
  qty_min: string;
  qty_max: string;
  attribute_1_id: string;
  attribute_2_id: string;
  attribute_3_id: string;
  unit_base_id: string;
  unit_sub_id: string;
  convertion_factor: string;
  product_code: string;
}

const initialFormData = {
  name: "",
  category_id: "",
  attribute_1_id: "",
  attribute_2_id: "",
  attribute_3_id: "",
  qty_min: "",
  qty_max: "",
  unit_base_id: "",
  unit_sub_id: "",
  convertion_factor: "",
  product_code: "",
  image: null as File | null,
};

interface CreateProductFormProps {
  category: Category[];
  attribute: Attribute[];
  unit: Unit[];
}

export default function CreateProductForm({
  category,
  attribute,
  unit,
}: CreateProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    image: null,
    category_id: "",
    qty_min: "",
    qty_max: "",
    unit_base_id: "",
    unit_sub_id: "",
    attribute_1_id: "",
    attribute_2_id: "",
    attribute_3_id: "",
    convertion_factor: "1",
    product_code: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string) => (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        if (key === "image" && value instanceof File) {
          formDataToSend.append("file", value);
        } else {
          formDataToSend.append(key, value.toString());
        }
      }
    });

    try {
      const result = await createProduct(formDataToSend);
      if (result.status === "201") {
        window.location.href = "/master/product";
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setError("An error occurred while creating the product.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData(initialFormData);

    // If you're using a file input, you might need to clear it manually
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Create New Product
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please fill in the required fields.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-5">
            <CustomFormInput
              title="Name"
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              className="sm:col-span-6"
            />

            <CustomFormInput
              title="Category"
              type="select"
              value={formData.category_id}
              onChange={handleChange("category_id")}
              className="sm:col-span-4"
              options={category.map((cat) => ({
                value: cat.category_id.toString(),
                label: cat.name,
              }))}
            />
            <CustomFormInput
              title="Attribute 1"
              type="select"
              value={formData.attribute_1_id}
              onChange={handleChange("attribute_1_id")}
              className="sm:col-span-4"
              options={attribute.map((attr) => ({
                value: attr.attribute_id.toString(),
                label: attr.name,
              }))}
            />
            <CustomFormInput
              title="Attribute 2"
              type="select"
              value={formData.attribute_2_id}
              onChange={handleChange("attribute_2_id")}
              className="sm:col-span-4"
              options={attribute.map((attr) => ({
                value: attr.attribute_id.toString(),
                label: attr.name,
              }))}
            />
            <CustomFormInput
              title="Attribute 3"
              type="select"
              value={formData.attribute_3_id}
              onChange={handleChange("attribute_3_id")}
              className="sm:col-span-4"
              options={attribute.map((attr) => ({
                value: attr.attribute_id.toString(),
                label: attr.name,
              }))}
            />

            <CustomFormInput
              title="Qty Min"
              type="number"
              value={formData.qty_min}
              onChange={handleChange("qty_min")}
              className="sm:col-span-4"
            />

            <CustomFormInput
              title="Qty Max"
              type="number"
              value={formData.qty_max}
              onChange={handleChange("qty_max")}
              className="sm:col-span-4"
            />

            <CustomFormInput
              title="Unit Base"
              type="select"
              value={formData.unit_base_id}
              onChange={handleChange("unit_base_id")}
              className="sm:col-span-4"
              options={unit.map((un) => ({
                value: un.unit_id.toString(),
                label: un.name,
              }))}
            />

            <CustomFormInput
              title="Unit Sub"
              type="select"
              value={formData.unit_sub_id}
              onChange={handleChange("unit_sub_id")}
              className="sm:col-span-4"
              options={unit.map((un) => ({
                value: un.unit_id.toString(),
                label: un.name,
              }))}
            />

            <CustomFormInput
              title="Convertion Factor"
              type="number"
              value={formData.convertion_factor}
              onChange={handleChange("convertion_factor")}
              className="sm:col-span-4"
            />

            <CustomFormInput
              title="Product Code"
              type="text"
              value={formData.product_code}
              onChange={handleChange("product_code")}
              className="sm:col-span-4"
            />

            <div className="col-span-full">
              <label
                htmlFor="image"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Product Image
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      width={200}
                      height={200}
                      className="mx-auto h-48 w-auto object-cover"
                    />
                  ) : (
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                  )}
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 hover:text-emerald-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => {}}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : "Create"}
        </button>
      </div>
    </form>
  );
}
