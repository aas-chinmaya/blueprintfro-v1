
// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export function CreateCategoryDialog({
//   open,
//   onOpenChange,
//   accountId,
//   onCreateCategory,
//   availableFunds,
// }) {
//   const [name, setName] = useState("");
//   const [allocatedAmount, setAllocatedAmount] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const amount = parseFloat(allocatedAmount);
//     if (name.trim() && amount > 0 && amount <= availableFunds) {
//       onCreateCategory(name, amount);
//       setName("");
//       setAllocatedAmount("");
//       onOpenChange(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Create New Category</DialogTitle>
//             <DialogDescription>
//               Create a new category and allocate funds from the main account.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="categoryName">Category Name</Label>
//               <Input
//                 id="categoryName"
//                 placeholder="e.g., Development, Marketing"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="allocated">Allocated Amount</Label>
//               <Input
//                 id="allocated"
//                 type="number"
//                 placeholder="0.00"
//                 value={allocatedAmount}
//                 onChange={(e) => setAllocatedAmount(e.target.value)}
//                 required
//                 min="0.01"
//                 step="0.01"
//                 max={availableFunds}
//               />
//               <p className="text-xs text-muted-foreground">
//                 Available: ${availableFunds.toFixed(2)}
//               </p>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button type="submit">Create Category</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
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

export function CreateCategoryDialog({
  open,
  onOpenChange,
  accountId,
  onCreateCategory,
  availableFunds,
}) {
  const [name, setName] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState("");

  const suggestedCategories = [
    "Analysis",
    "Design",
    "Development",
    "Test & QA",
    "Deployment & Infra",
    "Maintenance & Support",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(allocatedAmount);
    if (name.trim() && amount > 0 && amount <= availableFunds) {
      onCreateCategory(name, amount);
      setName("");
      setAllocatedAmount("");
      onOpenChange(false);
    }
  };

  const handleSuggestedClick = (category) => {
    setName(category);
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
              <div className="flex flex-wrap gap-2 mt-1">
                {suggestedCategories.map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedClick(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
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
