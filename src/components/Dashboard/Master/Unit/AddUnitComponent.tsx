"use client";
import { createUnit } from "@/app/actions/unitActions";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddUnitComponentProps {
  onUnitAdded?: () => void;
}

export function AddUnitComponent({ onUnitAdded }: AddUnitComponentProps) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = async () => {
    try {
      await createUnit({ name, symbol });
      setName("");
      setSymbol("");
      setIsOpen(false);
      window.location.href = "/master/unit";
    } catch (error) {
      console.error("Error creating unit:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>Add New Unit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Unit</DialogTitle>
          <DialogDescription>
            Create new unit for your WMS here. Click save when you`re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="symbol" className="text-right">
              Symbol
            </Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreate}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
