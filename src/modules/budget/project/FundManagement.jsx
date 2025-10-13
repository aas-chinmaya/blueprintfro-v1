"use client";

import React, { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ✅ Dummy initial data
const initialCategories = [
  { id: 1, name: "Marketing", allocated: 40000, spent: 25000 },
  { id: 2, name: "Operations", allocated: 60000, spent: 40000 },
  { id: 3, name: "Development", allocated: 50000, spent: 20000 },
];

export default function FundManagement() {
  const [categories, setCategories] = useState(initialCategories);
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [fundAction, setFundAction] = useState("add");
  const [mainAccount, setMainAccount] = useState(200000);

  // ✅ Compute totals
  const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const remaining = mainAccount - totalSpent;

  // ✅ Persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("budget_categories", JSON.stringify(categories));
      localStorage.setItem("budget_main_account", mainAccount.toString());
    }
  }, [categories, mainAccount]);

  // ✅ Handle fund actions
  const handleFundAction = () => {
    const amount = Number(fundAmount);
    if (!amount || amount <= 0) return;

    if (fundAction === "add") {
      setMainAccount((prev) => prev + amount);
    } else {
      if (amount > mainAccount) return;
      setMainAccount((prev) => prev - amount);
    }

    setFundAmount("");
    setFundDialogOpen(false);
  };

  return (
    <div className="lg:w-1/4">
      <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Fund Management
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Overview of your budget and allocations
              </CardDescription>
            </div>

            {/* Dialog Trigger */}
            <Dialog open={fundDialogOpen} onOpenChange={setFundDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                  Edit Funds
                </Button>
              </DialogTrigger>

              {/* Dialog Content */}
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>
                    {fundAction === "add" ? "Add Funds" : "Reduce Funds"}
                  </DialogTitle>
                  <DialogDescription>
                    {fundAction === "add"
                      ? "Add funds to the main account."
                      : "Reduce funds from the main account."}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fundAmount">Amount</Label>
                    <Input
                      id="fundAmount"
                      type="number"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      placeholder="e.g., 10000"
                      className="border-gray-300 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={fundAction === "add" ? "default" : "outline"}
                      onClick={() => setFundAction("add")}
                      className={fundAction === "add" ? "bg-blue-600 text-white" : "border-gray-300"}
                    >
                      Add
                    </Button>
                    <Button
                      variant={fundAction === "reduce" ? "default" : "outline"}
                      onClick={() => setFundAction("reduce")}
                      className={fundAction === "reduce" ? "bg-blue-600 text-white" : "border-gray-300"}
                    >
                      Reduce
                    </Button>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setFundDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleFundAction} className="bg-blue-600 hover:bg-blue-700">
                    {fundAction === "add" ? "Add Funds" : "Reduce Funds"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="space-y-6 pt-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Main Account</p>
            <p className="text-xl font-bold flex items-center text-blue-600">
         
              ₹{mainAccount.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Total Allocated</p>
            <p className="text-xl font-bold flex items-center text-green-600">
          
              ₹{totalAllocated.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Total Spent</p>
            <p className="text-xl font-bold flex items-center text-red-600">
           
              ₹{totalSpent.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Remaining</p>
            <p className="text-xl font-bold flex items-center text-purple-600">
          
              ₹{remaining.toLocaleString()}
            </p>
            <Progress
              value={(totalSpent / (totalAllocated || 1)) * 100}
              className="mt-2 h-2 bg-gray-200"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
