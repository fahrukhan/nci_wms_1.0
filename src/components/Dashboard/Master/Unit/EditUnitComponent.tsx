"use client";
import { updateUnit, deleteUnit } from "@/app/actions/unitActions";
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
import { Settings } from "lucide-react";

interface EditUnitComponentProps {
  unit: {
    unit_id: number;
    name: string;
    symbol: string;
  };
}

export function EditUnitComponent({ unit }: EditUnitComponentProps) {
  const [name, setName] = useState(unit.name);
  const [symbol, setSymbol] = useState(unit.symbol);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = async () => {
    try {
      await updateUnit({ id: unit.unit_id, name, symbol });
      setIsOpen(false);
      window.location.href = "/master/unit";
    } catch (error) {
      console.error("Error updating unit:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      try {
        await deleteUnit(unit.unit_id);
        setIsOpen(false);
        window.location.href = "/master/unit";
      } catch (error) {
        console.error("Error deleting unit:", error);
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
          <DialogTitle>Edit Unit</DialogTitle>
          <DialogDescription>
            Update or delete the unit here. Click save when you`re done.
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
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button type="submit" onClick={handleUpdate}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
