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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddEntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string | null;
  categoryName: string;
  categoryRemaining: number;
  onAddEntity: (categoryId: string, name: string, amount: number, payee: string, method: string) => void;
}

export function AddEntityDialog({
  open,
  onOpenChange,
  categoryId,
  categoryName,
  categoryRemaining,
  onAddEntity,
}: AddEntityDialogProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [payee, setPayee] = useState("");
  const [method, setMethod] = useState("UPI");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (categoryId && name.trim() && amountNum > 0 && amountNum <= categoryRemaining && payee.trim()) {
      onAddEntity(categoryId, name, amountNum, payee, method);
      setName("");
      setAmount("");
      setPayee("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Entity to {categoryName}</DialogTitle>
            <DialogDescription>
              Add a new spending entity to this category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="entityName">Entity Name</Label>
              <Input
                id="entityName"
                placeholder="e.g., API Development, Ad Campaign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="entityAmount">Amount</Label>
              <Input
                id="entityAmount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
                max={categoryRemaining}
              />
              <p className="text-xs text-muted-foreground">
                Remaining in category: ${categoryRemaining.toFixed(2)}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payee">Payee</Label>
              <Input
                id="payee"
                placeholder="e.g., Vendor, Freelancer"
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Net Banking">Net Banking</SelectItem>
                  <SelectItem value="Wallet">Wallet</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Entity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
