"use client";
import { Button } from "@/components/ui/button";

import { Settings } from "lucide-react";
import Link from "next/link";

interface ProductFormButtonProps {
  isEdit?: boolean;
}

export function ProductFormButton({ isEdit = false }: ProductFormButtonProps) {
  {
    return (
      <Link href={"/master/product/create"}>
        {isEdit ? (
          <Button variant="ghost" size="icon">
            <Settings color="#BCBCBC" size={20} />
          </Button>
        ) : (
          <Button variant="secondary">Add New Product</Button>
        )}
      </Link>
    );
  }
}
