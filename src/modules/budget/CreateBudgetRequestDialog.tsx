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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateBudgetRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRequest: (
    title: string,
    description: string,
    requestedAmount: number,
    currency: 'INR' | 'USD',
    requestedBy: string
  ) => void;
}

export function CreateBudgetRequestDialog({
  open,
  onOpenChange,
  onCreateRequest,
}: CreateBudgetRequestDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [currency, setCurrency] = useState<'INR' | 'USD'>('USD');
  const [requestedBy, setRequestedBy] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(requestedAmount);
    if (title.trim() && amount > 0 && requestedBy.trim()) {
      onCreateRequest(title, description, amount, currency, requestedBy);
      setTitle("");
      setDescription("");
      setRequestedAmount("");
      setRequestedBy("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Budget Request</DialogTitle>
            <DialogDescription>
              Submit a new budget request for approval.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Q4 Marketing Budget"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide details about this budget request..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Requested Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={(val) => setCurrency(val as 'INR' | 'USD')}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="requestedBy">Requested By</Label>
              <Input
                id="requestedBy"
                placeholder="Your name or department"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
