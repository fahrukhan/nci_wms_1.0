"use client";
import { ChevronLeftIcon } from "lucide-react";

export default function ReturnPageIcon({ title }: { title: String }) {
  const handleClick = (e: any) => {
    e.preventDefault();
    history.back();
  };

  return (
    <a href="#" onClick={handleClick}>
      <div className="flex pb-4">
        <ChevronLeftIcon /> {title}
      </div>
    </a>
  );
}
