






"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Edit } from "lucide-react";

const initialCategories = [
  { id: 1, name: "Development", allocated: 50000, spent: 30000 , entities: [] },
  { id: 2, name: "Testing", allocated: 20000, spent: 10000 , entities: [] },
  { id: 3, name: "Marketing", allocated: 30000, spent: 15000 , entities: [] },
  { id: 4, name: "Operations", allocated: 20000, spent: 8000, entities: [] },
];

export default function FundCategories({ mainAccount, setMainAccount }) {
  const [categories, setCategories] = useState(initialCategories);
const [sheetOpen, setSheetOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState(null);
const [addEntityOpen, setAddEntityOpen] = useState(false);
const [newEntityName, setNewEntityName] = useState("");
const [newEntityAmount, setNewEntityAmount] = useState("");
const [editEntityOpen, setEditEntityOpen] = useState(false);
const [editEntity, setEditEntity] = useState(null);
const [editEntityName, setEditEntityName] = useState("");

useEffect(() => {
  const stored = localStorage.getItem('fundCategories');
  if (stored) {
    setCategories(JSON.parse(stored));
  } else {
    setCategories(initialCategories.map(c => ({...c, entities: []})));
  }
}, []);

useEffect(() => {
  localStorage.setItem('fundCategories', JSON.stringify(categories));
}, [categories]);
useEffect(() => {
  if (editEntity) {
    setEditEntityName(editEntity.name);
  }
}, [editEntity]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatAlloc, setNewCatAlloc] = useState("");

  const handleCreateCategory = () => {
    const allocNum = Number(newCatAlloc);
    if (!newCatName || !allocNum || allocNum <= 0 || allocNum > mainAccount) {
      return alert("Invalid category name or allocation amount.");
    }
    const newCat = { id: Date.now(), name: newCatName, allocated: allocNum, spent: 0, entities: [] };
    setCategories(prev => [...prev, newCat]);
    setMainAccount(prev => prev - allocNum);
    setNewCatName("");
    setNewCatAlloc("");
    setCreateDialogOpen(false);
  };

  const handleOpenCategory = (cat) => {
  setSelectedCategory(cat);
  setSheetOpen(true);
};

const handleAddEntity = () => {
  const amt = Number(newEntityAmount);
  const remaining = selectedCategory.allocated - selectedCategory.spent;
  if (!newEntityName || amt <= 0 || amt > remaining) {
    return alert("Invalid entity name or amount.");
  }
  const newEnt = {id: Date.now(), name: newEntityName, amount: amt};
  setCategories(prev => prev.map(c => c.id === selectedCategory.id ? {...c, spent: c.spent + amt, entities: [...(c.entities || []), newEnt]} : c));
  setNewEntityName("");
  setNewEntityAmount("");
  setAddEntityOpen(false);
};

const handleDeleteEntity = (entityId) => {
  if (!confirm("Are you sure?")) return;
  const ent = selectedCategory.entities.find(e => e.id === entityId);
  setCategories(prev => prev.map(c => c.id === selectedCategory.id ? {...c, spent: c.spent - ent.amount, entities: c.entities.filter(e => e.id !== entityId)} : c));
};

const handleSaveEdit = () => {
  setCategories(prev => prev.map(c => c.id === selectedCategory.id ? {...c, entities: c.entities.map(e => e.id === editEntity.id ? {...e, name: editEntityName} : e)} : c));
  setEditEntityOpen(false);
};

const handleDeleteCategory = (id) => {
    const cat = categories.find(c => c.id === id);
    if (cat.spent > 0) return alert("Cannot delete category with spent funds.");
    setMainAccount(prev => prev + cat.allocated);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header + Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Fund Categories</h2>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" /> New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>Allocate funds from the main account.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-1">
                <Label className="text-gray-700 text-sm">Category Name</Label>
                <Input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="e.g., Research" />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-700 text-sm">Allocated Amount</Label>
                <Input type="number" min="1" value={newCatAlloc} onChange={(e) => setNewCatAlloc(e.target.value)} placeholder="e.g., 10000" />
              </div>
            </div>
            <DialogFooter className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleCreateCategory}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => {
          const progress = cat.allocated ? (cat.spent / cat.allocated) * 100 : 0;
          const remaining = cat.allocated - cat.spent;

          return (
            <div key={cat.id} className="bg-white shadow-md rounded-lg border border-gray-200 p-4 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleOpenCategory(cat)}>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{cat.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Allocated: ₹{cat.allocated.toLocaleString()} | Spent: ₹{cat.spent.toLocaleString()} | Remaining: ₹{remaining.toLocaleString()}
                </p>
                <Progress value={progress} className="h-2 mt-2 bg-gray-200" />
              </div>
              <div className="flex justify-end mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                  className="text-gray-600 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
  <SheetContent side="right" className="w-[400px] sm:w-[540px]">
    <SheetHeader>
      <SheetTitle>{selectedCategory?.name} Entities</SheetTitle>
      <SheetDescription>Manage fund entities for this category.</SheetDescription>
    </SheetHeader>
    <div className="space-y-4 mt-4">
      <Dialog open={addEntityOpen} onOpenChange={setAddEntityOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Entity
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Entity</DialogTitle>
            <DialogDescription>Allocate funds from category remaining.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label className="text-gray-700 text-sm">Entity Name</Label>
              <Input value={newEntityName} onChange={(e) => setNewEntityName(e.target.value)} placeholder="e.g., Figma Software" />
            </div>
            <div className="space-y-1">
              <Label className="text-gray-700 text-sm">Amount</Label>
              <Input type="number" min="1" value={newEntityAmount} onChange={(e) => setNewEntityAmount(e.target.value)} placeholder="e.g., 5000" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setAddEntityOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleAddEntity}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
        {selectedCategory?.entities?.map(ent => (
          <div key={ent.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
            <div>
              <p className="font-medium">{ent.name}</p>
              <p className="text-sm text-gray-600">₹{ent.amount.toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => {setEditEntity(ent); setEditEntityOpen(true);}}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteEntity(ent.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )) || <p>No entities yet.</p>}
      </div>
    </div>

    <Dialog open={editEntityOpen} onOpenChange={setEditEntityOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Entity Name</DialogTitle>
          <DialogDescription>You cannot edit the allocated amount.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label className="text-gray-700 text-sm">Entity Name</Label>
            <Input value={editEntityName} onChange={(e) => setEditEntityName(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => setEditEntityOpen(false)}>Cancel</Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleSaveEdit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </SheetContent>
</Sheet>
    </div>
  );
}
