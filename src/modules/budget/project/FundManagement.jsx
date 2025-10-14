


"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// ✅ Dummy initial data
const initialCategories = [
  { id: 1, name: "Marketing", allocated: 40000, spent: 25000 },
  { id: 2, name: "Operations", allocated: 60000, spent: 40000 },
  { id: 3, name: "Development", allocated: 50000, spent: 20000 },
];

// ✅ Dummy transactions - enhanced like UPI
const initialTransactions = [
  { id: 1, type: "Add Fund", amount: 50000, date: "Oct 14, 2025", time: "01:13 PM", status: "Success", method: "UPI", payee: "Bank Transfer" },
  { id: 2, type: "Allocate", amount: 40000, date: "Oct 13, 2025", time: "03:45 PM", status: "Success", method: "Wallet", payee: "Self" },
  { id: 3, type: "Spend", amount: 30000, date: "Oct 12, 2025", time: "10:15 AM", status: "Success", method: "Card", payee: "Vendor" },
  { id: 4, type: "Spend", amount: 20000, date: "Oct 11, 2025", time: "02:30 PM", status: "Failed", method: "UPI", payee: "Freelancer" },
  { id: 5, type: "Add Fund", amount: 10000, date: "Oct 10, 2025", time: "09:00 AM", status: "Success", method: "Net Banking", payee: "Savings" },
];

export default function FundManagement() {
  const [categories, setCategories] = useState(initialCategories);
  const [mainAccount, setMainAccount] = useState(200000);
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [selectedFilter, setSelectedFilter] = useState("All");

  // ✅ Compute totals
  const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const remaining = mainAccount - totalSpent;
  const utilization = totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(0) : 0;

  // ✅ Persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("budget_categories", JSON.stringify(categories));
      localStorage.setItem("budget_main_account", mainAccount.toString());
      localStorage.setItem("budget_transactions", JSON.stringify(transactions));
    }
  }, [categories, mainAccount, transactions]);

  // ✅ Handle Add Fund
  const handleAddFund = () => {
    const amount = Number(fundAmount);
    if (!amount || amount <= 0) return;

    setMainAccount((prev) => prev + amount);
    setTransactions([{ 
      id: Date.now(), 
      type: "Add Fund", 
      amount, 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      status: "Success",
      method: "UPI",
      payee: "Bank Transfer"
    }, ...transactions]);

    setFundAmount("");
    setFundDialogOpen(false);
  };

  const filteredTransactions = transactions.filter(t => selectedFilter === "All" || t.type === selectedFilter);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-2 space-y-3">
   

      {/* Big Card with Utilization */}
      <Card className="bg-white border-0 rounded-xl shadow-sm p-3">
        <CardContent className="space-y-3">
          <div className="text-center">
            <p className="text-xs text-gray-600">Utilization Ratio</p>
            <Progress value={utilization} className="h-2 bg-gray-200" />
            <p className="text-sm font-semibold text-gray-800">{utilization}%</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center bg-blue-50 p-2 rounded-lg">
              <p className="text-blue-600">Available</p>
              <p className="font-medium text-blue-800">₹{remaining.toLocaleString()}</p>
            </div>
            <div className="text-center bg-green-50 p-2 rounded-lg">
              <p className="text-green-600">Allocated</p>
              <p className="font-medium text-green-800">₹{totalAllocated.toLocaleString()}</p>
            </div>
            <div className="text-center bg-red-50 p-2 rounded-lg">
              <p className="text-red-600">Pending</p>
              <p className="font-medium text-red-800">₹{(totalAllocated - totalSpent).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <Select value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
        <SelectTrigger className="text-xs border-gray-200 rounded-lg h-8 bg-white text-gray-800">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          <SelectItem value="Add Fund">Add Fund</SelectItem>
          <SelectItem value="Spend">Spend</SelectItem>
          <SelectItem value="Allocate">Allocate</SelectItem>
        </SelectContent>
      </Select>

      {/* Transaction History */}
      <div className="space-y-1 flex-1">
        <h2 className="text-xs font-medium text-gray-600 px-2">Transaction History</h2>
        <div className="space-y-1">
          {filteredTransactions.map((t) => (
            <Card key={t.id} className="bg-white border-0 rounded-xl shadow-sm p-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white">
                    <span className="text-xs">{t.type === "Add Fund" ? "↓" : "↑"}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{t.type === "Add Fund" ? "Credited from" : "Debited to"} {t.payee}</p>
                    <p className="text-xs text-gray-500">{t.date} {t.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${t.status === "Success" ? (t.type === "Add Fund" ? "text-green-600" : "text-red-600") : "text-red-600"}`}>
                    {t.type === "Add Fund" ? "+" : "-"}₹{t.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{t.status}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Fund Button */}
      <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm py-2" onClick={() => setFundDialogOpen(true)}>
        Add Fund
      </Button>

     

      {/* Add Fund Dialog */}
      <Dialog open={fundDialogOpen} onOpenChange={setFundDialogOpen}>
        <DialogContent className="bg-white max-w-xs rounded-xl border-0">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-gray-800">Add Funds</DialogTitle>
            <DialogDescription className="text-xs text-gray-600">Add funds to the main account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">Amount</Label>
              <Input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="e.g., 10000"
                className="text-sm rounded-lg border-gray-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-xs rounded-lg border-gray-300 text-gray-600" onClick={() => setFundDialogOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-xs rounded-lg" onClick={handleAddFund}>Add Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}