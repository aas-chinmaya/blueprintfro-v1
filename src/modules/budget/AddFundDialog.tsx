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

interface AddFundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFund: (amount: number, method: string, source: string) => void;
}

export function AddFundDialog({ open, onOpenChange, onAddFund }: AddFundDialogProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");
  const [source, setSource] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (amountNum > 0 && source.trim()) {
      onAddFund(amountNum, method, source);
      setAmount("");
      setSource("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Funds to Main Account</DialogTitle>
            <DialogDescription>
              Add funds to your main account to increase available balance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger id="method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Net Banking">Net Banking</SelectItem>
                  <SelectItem value="Wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                placeholder="e.g., Client Payment, Investment"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Funds</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
