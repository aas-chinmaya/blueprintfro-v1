

"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBudgetRequestsByProject,
  createBudgetRequest,
  updateBudgetRequest,
  deleteBudgetRequest,
  updateBudgetRequestStatus,
} from "@/features/budget/budgetRequestSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, IndianRupee, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function BudgetRequestsPanel({ projectId }) {
  const dispatch = useDispatch();
  const { projectRequests, loading } = useSelector((state) => state.budgetRequest);
  const { currentUser } = useCurrentUser();

  const [modal, setModal] = useState({ type: null, open: false });
  const [currentData, setCurrentData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requestedAmount: 0,
    currency: "INR",
    requestType: "General",
    note: "",
    remarks: "",
  });

  useEffect(() => {
    if (projectId) {
      dispatch(fetchBudgetRequestsByProject(projectId));
    }
  }, [dispatch, projectId]);

  const openModal = (type, data = null) => {
    setCurrentData(data);
    setFormData(
      data
        ? { ...data, note: "", remarks: "" }
        : { title: "", description: "", requestedAmount: 0, currency: "INR", requestType: "General", note: "", remarks: "" }
    );
    setModal({ type, open: true });
  };

  const closeModal = () => setModal({ type: null, open: false });

  const handleFormChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleCreate = async () => {
    if (!projectId) return alert("Project ID is missing!");
    await dispatch(createBudgetRequest({ projectId, ...formData }));
    closeModal();
  };

  const handleUpdate = async () => {
    await dispatch(updateBudgetRequest({
      requestId: currentData.requestId,
      data: { ...formData, remarks: formData.note || "Updated" },
    }));
    closeModal();
  };

  const handleStatusChange = async (status) => {
    await dispatch(updateBudgetRequestStatus({
      requestId: currentData.requestId,
      status,
      remarks: formData.remarks || "",
      userId: currentUser?.id,
    }));
    closeModal();
  };

  const handleDelete = async () => {
    await dispatch(deleteBudgetRequest(currentData.requestId));
    closeModal();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved": return "outline";
      case "rejected": return "destructive";
      case "revision": return "secondary";
      default: return "default";
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);

  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Budget Requests</CardTitle>
          <Button onClick={() => openModal("create")} className="bg-blue-600 hover:bg-blue-700 text-white">
            + New Request
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-sm text-center text-gray-500 py-8">Loading requests...</p>
        ) : projectRequests?.length === 0 ? (
          <p className="text-sm text-center text-gray-500 py-8">No budget requests found.</p>
        ) : (
          <div className="space-y-4">
            {projectRequests.map((req) => (
              <div key={req.requestId} className="p-4 rounded-lg border bg-card hover:shadow-sm transition cursor-pointer"
                   onClick={() => openModal("view", req)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-1">{req.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{req.description || "No description"}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" /> {formatCurrency(req.requestedAmount)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                      <span>Type: {req.requestType || "N/A"}</span>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(req.status)}>
                    {req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}
                  </Badge>
                </div>

                <div className="flex justify-end gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="ghost" onClick={() => openModal("edit", req)}><Edit className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => openModal("delete", req)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* MODAL */}
      <Dialog open={modal.open} onOpenChange={closeModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {modal.type === "create" && "Create Budget Request"}
              {modal.type === "edit" && "Edit Budget Request"}
              {modal.type === "view" && "Request Details"}
              {modal.type === "delete" && "Delete Confirmation"}
            </DialogTitle>
          </DialogHeader>

          {/* CREATE & EDIT FORM */}
          {(modal.type === "create" || modal.type === "edit") && (
            <div className="space-y-4 mt-4">
              <div>
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => handleFormChange("title", e.target.value)} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => handleFormChange("description", e.target.value)} />
              </div>
              <div>
                <Label>Amount (INR)</Label>
                <Input type="number" value={formData.requestedAmount} onChange={(e) => handleFormChange("requestedAmount", Number(e.target.value))} />
              </div>
              {modal.type === "edit" && (
                <div>
                  <Label>Note</Label>
                  <Textarea value={formData.note} onChange={(e) => handleFormChange("note", e.target.value)} />
                </div>
              )}
            </div>
          )}

          {/* VIEW DETAILS */}
          {modal.type === "view" && currentData && (
            <div className="space-y-4 mt-4 text-sm text-gray-700">
              <p><strong>ID:</strong> {currentData.requestId}</p>
              <p><strong>Title:</strong> {currentData.title}</p>
              <p><strong>Description:</strong> {currentData.description}</p>
              <p><strong>Amount:</strong> {formatCurrency(currentData.requestedAmount)}</p>
              <p><strong>Status:</strong> <Badge variant={getStatusColor(currentData.status)}>{currentData.status}</Badge></p>

              {currentData.status === "created" && (
                <div className="flex gap-3 mt-4">
                  <Button onClick={() => handleStatusChange("approved")} className="bg-green-600 text-white">Approve</Button>
                  <Button onClick={() => handleStatusChange("rejected")} className="bg-red-600 text-white">Reject</Button>
                  <Button onClick={() => handleStatusChange("revision")} className="bg-blue-600 text-white">Request Revision</Button>
                </div>
              )}
            </div>
          )}

          {/* DELETE */}
          {modal.type === "delete" && (
            <div className="mt-4">
              <DialogDescription>Are you sure you want to delete this request? This action cannot be undone.</DialogDescription>
            </div>
          )}

          <DialogFooter className="mt-6">
            {modal.type === "create" && <Button onClick={handleCreate} className="bg-blue-600 text-white">Create Request</Button>}
            {modal.type === "edit" && <Button onClick={handleUpdate} className="bg-blue-600 text-white">Update Request</Button>}
            {modal.type === "delete" && (
              <>
                <Button onClick={handleDelete} className="bg-red-600 text-white">Yes, Delete</Button>
                <Button variant="outline" onClick={closeModal}>No, Cancel</Button>
              </>
            )}
            {(modal.type === "create" || modal.type === "edit" || modal.type === "view") && <Button variant="outline" onClick={closeModal}>Close</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
