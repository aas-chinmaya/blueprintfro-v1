import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components./ui/label";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCategory: (name: string, allocatedAmount: number) => void;
  availableFunds: number;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onCreateCategory,
  availableFunds,
}: CreateCategoryDialogProps) {
  const [name, setName] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(allocatedAmount);
    if (name.trim() && amount > 0 && amount <= availableFunds) {
      onCreateCategory(name, amount);
      setName("");
      setAllocatedAmount("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Create a new category and allocate funds from the main account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                placeholder="e.g., Development, Marketing"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="allocated">Allocated Amount</Label>
              <Input
                id="allocated"
                type="number"
                placeholder="0.00"
                value={allocatedAmount}
                onChange={(e) => setAllocatedAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
                max={availableFunds}
              />
              <p className="text-xs text-muted-foreground">
                Available: ${availableFunds.toFixed(2)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Category</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
