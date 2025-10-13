



"use client";

import React, { useState } from "react";
import { Plus, Eye, Trash2 } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {toast} from "sonner";
const initialCategories = [
  { id: 1, name: "Development", allocated: 50000, spent: 30000 },
  { id: 2, name: "Testing", allocated: 20000, spent: 10000 },
  { id: 3, name: "Marketing", allocated: 30000, spent: 15000 },
  { id: 4, name: "Operations", allocated: 20000, spent: 8000 },
];

const initialRequests = [
  { id: "REQ-001", team: "Frontend", category: "Development", amount: 5000, status: "Pending" },
  { id: "REQ-002", team: "QA", category: "Testing", amount: 3000, status: "Approved" },
  { id: "REQ-003", team: "Ads", category: "Marketing", amount: 4000, status: "Pending" },
  { id: "REQ-004", team: "Logistics", category: "Operations", amount: 2000, status: "Rejected" },
];

export default function CategoriesAndRequests() {
  const [categories, setCategories] = useState(initialCategories);
  const [requests, setRequests] = useState(initialRequests);
  const [mainAccount, setMainAccount] = useState(100000);
  const [activeTab, setActiveTab] = useState("categories");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [newCatName, setNewCatName] = useState("");
  const [newCatAlloc, setNewCatAlloc] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const [toast, setToast] = useState({ message: "", visible: false });
  const requestsPerPage = 5;

  // Simple toast notification handler
  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  };

  const handleCreateCategory = () => {
    const allocNum = Number(newCatAlloc);
    if (!newCatName || !allocNum || allocNum <= 0 || allocNum > mainAccount) {
      showToast("Invalid category name or allocation amount.");
      return;
    }
    const newCat = { id: Date.now(), name: newCatName, allocated: allocNum, spent: 0 };
    setCategories((prev) => [...prev, newCat]);
    setMainAccount((prev) => prev - allocNum);
    setNewCatName("");
    setNewCatAlloc("");
    setCreateDialogOpen(false);
    showToast("Category created successfully.");
  };

  const handleDeleteCategory = (id) => {
    const cat = categories.find((c) => c.id === id);
    if (cat.spent > 0) {
      showToast("Cannot delete category with spent funds.");
      return;
    }
    setMainAccount((prev) => prev + cat.allocated);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast("Category deleted successfully.");
  };

  const handleApproveRequest = (req) => {
    const cat = categories.find((c) => c.name === req.category);
    if (!cat) {
      showToast("Category not found.");
      return;
    }
    if (req.amount > mainAccount && req.amount > cat.allocated - cat.spent) {
      showToast("Insufficient funds in main account and category.");
      return;
    }
    // If category has insufficient funds, allocate from main account
    if (req.amount > cat.allocated - cat.spent) {
      const additionalFunds = req.amount - (cat.allocated - cat.spent);
      setCategories((prev) =>
        prev.map((c) => (c.name === req.category ? { ...c, allocated: c.allocated + additionalFunds, spent: c.spent + req.amount } : c))
      );
      setMainAccount((prev) => prev - additionalFunds);
    } else {
      setCategories((prev) =>
        prev.map((c) => (c.name === req.category ? { ...c, spent: c.spent + req.amount } : c))
      );
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "Approved" } : r))
    );
    setViewDialogOpen(false);
    showToast("Request approved successfully.");
  };

  const handleRejectRequest = (req) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "Rejected" } : r))
    );
    setViewDialogOpen(false);
    showToast("Request rejected successfully.");
  };

  const openViewDialog = (req) => {
    setViewData(req);
    setViewDialogOpen(true);
  };

  // Pagination logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(requests.length / requestsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="lg:w-2/3 relative">
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {toast.message}
        </div>
      )}
      <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2" role="tablist" aria-label="Budget Management Tabs">
              <Button
                role="tab"
                aria-selected={activeTab === "categories"}
                variant={activeTab === "categories" ? "default" : "ghost"}
                onClick={() => setActiveTab("categories")}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === "categories"
                    ? "bg-blue-600 text-white border-b-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Fund Categories
              </Button>
              <Button
                role="tab"
                aria-selected={activeTab === "requests"}
                variant={activeTab === "requests" ? "default" : "ghost"}
                onClick={() => setActiveTab("requests")}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === "requests"
                    ? "bg-blue-600 text-white border-b-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All Requests
              </Button>
            </div>
            {activeTab === "categories" && (
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> New Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogDescription>Add a new category by allocating funds from the main account.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Category Name</Label>
                      <Input
                        id="name"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g., Research"
                        className="border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allocated">Allocated Amount</Label>
                      <Input
                        id="allocated"
                        type="number"
                        min="1"
                        value={newCatAlloc}
                        onChange={(e) => setNewCatAlloc(e.target.value)}
                        placeholder="e.g., 10000"
                        className="border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCategory} className="bg-blue-600 hover:bg-blue-700">
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4 min-h-[400px]">
          {activeTab === "categories" && (
            <div className="space-y-4" role="tabpanel">
              {categories.length > 0 ? (
                categories.map((cat) => {
                  const progress = cat.allocated ? (cat.spent / cat.allocated) * 100 : 0;
                  const catRemaining = cat.allocated - cat.spent;
                  return (
                    <Card key={cat.id} className="bg-white border border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-gray-800">{cat.name}</CardTitle>
                        <CardDescription className="text-xs text-gray-600">
                          Allocated: ₹{cat.allocated.toLocaleString()} | Spent: ₹{cat.spent.toLocaleString()} | Remaining: ₹
                          {catRemaining.toLocaleString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Progress value={progress} className="h-2 mt-2 bg-gray-200" />
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className="text-gray-600 text-center">No categories available.</p>
              )}
            </div>
          )}
          {activeTab === "requests" && (
            <div className="space-y-4 min-h-[400px]" role="tabpanel">
              {currentRequests.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="text-gray-800">ID</TableHead>
                        <TableHead className="text-gray-800">Team</TableHead>
                        <TableHead className="text-gray-800">Category</TableHead>
                        <TableHead className="text-gray-800">Amount</TableHead>
                        <TableHead className="text-gray-800">Status</TableHead>
                        
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentRequests.map((req) => (
                        <TableRow key={req.id} className="hover:bg-gray-50 cursor-pointer border-b border-gray-200"  onClick={() => openViewDialog(req)}>
                          <TableCell className="text-gray-700">{req.id}</TableCell>
                          <TableCell className="text-gray-700">{req.team}</TableCell>
                          <TableCell className="text-gray-700">{req.category}</TableCell>
                          <TableCell className="text-gray-700">₹{req.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                req.status === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : req.status === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {req.status}
                            </span>
                          </TableCell>
                          
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-center space-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-gray-300"
                    >
                      Previous
                    </Button>
                    <span className="text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-gray-300"
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 text-center">No requests available.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>Details of the selected request.</DialogDescription>
          </DialogHeader>
          {viewData && (
            <div className="space-y-4">
              <div>
                <Label>ID</Label>
                <p className="text-gray-700">{viewData.id}</p>
              </div>
              <div>
                <Label>Team</Label>
                <p className="text-gray-700">{viewData.team}</p>
              </div>
              <div>
                <Label>Category</Label>
                <p className="text-gray-700">{viewData.category}</p>
              </div>
              <div>
                <Label>Amount</Label>
                <p className="text-gray-700">₹{viewData.amount.toLocaleString()}</p>
              </div>
              <div>
                <Label>Status</Label>
                <p
                  className={`text-sm ${
                    viewData.status === "Approved"
                      ? "text-green-600"
                      : viewData.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {viewData.status}
                </p>
              </div>
              {viewData.status === "Pending" && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApproveRequest(viewData)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleRejectRequest(viewData)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}





