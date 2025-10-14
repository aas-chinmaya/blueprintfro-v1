
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBudgetRequests,
  createBudgetRequest,
  updateBudgetRequest,
  deleteBudgetRequest,
  updateBudgetRequestStatus,
} from "@/features/budget/budgetRequestSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function BudgetRequests({ projectId }) {
  const dispatch = useDispatch();
  const { requests, loading } = useSelector((state) => state.budgetRequest);

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState({ type: null, open: false });
  const [currentData, setCurrentData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requestedAmount: 0,
    currency: "INR",
    requestType: "General",
    note: "",
    remarks: "", // Added dedicated field for status remarks
  });
  const { currentUser } = useCurrentUser();

  const requestsPerPage = 5;

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    dispatch(fetchBudgetRequests());
  }, [dispatch]);

  /* -------------------- MODAL HELPERS -------------------- */
  const openModal = (type, data = null) => {
    setCurrentData(data);
    setFormData(
      data
        ? { ...data, note: "", remarks: "" }
        : {
            title: "",
            description: "",
            requestedAmount: 0,
            currency: "INR",
            requestType: "General",
            note: "",
            remarks: "",
          }
    );
    setModal({ type, open: true });
  };
  const closeModal = () => setModal({ type: null, open: false });
  const handleFormChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // Reset remarks when opening view modal for status changes
  useEffect(() => {
    if (modal.type === "view" && modal.open && currentData?.status === "created") {
      setFormData((prev) => ({ ...prev, remarks: "" }));
    }
  }, [modal.type, modal.open, currentData?.status]);

  /* -------------------- CRUD ACTIONS -------------------- */
  const handleCreate = async () => {
    if (!projectId) return alert("Project ID is missing!");
    const payload = {
      projectId,
      title: formData.title,
      description: formData.description,
      requestType: formData.requestType,
      requestedAmount: formData.requestedAmount,
      currency: formData.currency,
    };
    await dispatch(createBudgetRequest(payload));
    closeModal();
  };

  const handleUpdate = async () => {
    if (!currentData) return;
    const payload = {
      requestId: currentData.requestId,
      data: {
        title: formData.title,
        description: formData.description,
        requestedAmount: formData.requestedAmount,
        currency: formData.currency,
        requestType: formData.requestType,
        remarks: formData.note || "Updated",
      },
    };
    await dispatch(updateBudgetRequest(payload));
    closeModal();
  };

  const handleStatusChange = async (status) => {
    if (!currentData) return;
    await dispatch(
      updateBudgetRequestStatus({
        requestId: currentData.requestId,
        status,
        remarks: formData.remarks || "",
        userId: currentUser?.id,
      })
    );
    closeModal();
  };

  const handleDelete = async (requestId) => {
    if (confirm("Are you sure you want to delete this request?")) {
      await dispatch(deleteBudgetRequest(requestId));
    }
  };

  /* -------------------- FILTER & PAGINATION -------------------- */
  const filteredRequests = Array.isArray(requests)
    ? statusFilter === "All"
      ? requests
      : requests.filter((req) => req.status === statusFilter.toLowerCase())
    : [];

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  /* -------------------- STATUS BADGE STYLE -------------------- */
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      case "revision":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="min-h-screen p-4">
      {/* FILTER & CREATE */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48 border-gray-300 focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="revision">Revision</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow-sm transition-all"
          onClick={() => openModal("create")}
        >
          + New Request
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">
            Loading requests...
          </div>
        ) : currentRequests.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gray-100 border-b border-gray-200">
                    <TableHead className="px-6 py-4">Request ID</TableHead>
                    <TableHead className="px-6 py-4">Type</TableHead>
                    <TableHead className="px-6 py-4">Amount</TableHead>
                    <TableHead className="px-6 py-4">Status</TableHead>
                    <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRequests.map((req) => (
                    <TableRow
                      key={req.requestId}
                      className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer"
                      onClick={() => openModal("view", req)}
                    >
                      <TableCell className="font-mono text-sm px-6 py-4">{req.requestId}</TableCell>
                      <TableCell className="px-6 py-4 capitalize">{req.requestType}</TableCell>
                      <TableCell className="px-6 py-4 font-medium">
                        {req.currency === "INR" ? "₹" : "$"}
                        {req.requestedAmount.toLocaleString()} {req.currency}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(req.status)}`}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="flex justify-end gap-2 px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="ghost" onClick={() => openModal("edit", req)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(req.requestId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
              <Button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({filteredRequests.length} total)
              </span>
              <Button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-gray-600">
            No budget requests found.
          </div>
        )}
      </div>

      {/* MODAL */}
      <Dialog open={modal.open} onOpenChange={closeModal}>
        <DialogContent className="max-w-lg rounded-lg shadow-lg bg-white">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {modal.type === "create" && "Create New Budget Request"}
              {modal.type === "edit" && "Edit Budget Request"}
              {modal.type === "view" && "Budget Request Details"}
            </DialogTitle>
          </DialogHeader>

          {/* FORM */}
          {(modal.type === "create" || modal.type === "edit") && (
            <div className="space-y-5 mt-6">
              <div>
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => handleFormChange("title", e.target.value)} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => handleFormChange("description", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount</Label>
                  <Input type="number" value={formData.requestedAmount} onChange={(e) => handleFormChange("requestedAmount", Number(e.target.value))} />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select value={formData.currency} onValueChange={(v) => handleFormChange("currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Request Type</Label>
                <Select value={formData.requestType} onValueChange={(v) => handleFormChange("requestType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                    <SelectItem value="Refund">Refund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {modal.type === "edit" && (
                <div>
                  <Label>Note (for update)</Label>
                  <Textarea value={formData.note} onChange={(e) => handleFormChange("note", e.target.value)} />
                </div>
              )}
            </div>
          )}

          {/* VIEW */}
          {modal.type === "view" && currentData && (
            <div className="space-y-4 mt-6 text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Request ID:</strong> {currentData.requestId}</p>
                <p><strong>Status:</strong> <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusStyle(currentData.status)}`}>{currentData.status.charAt(0).toUpperCase() + currentData.status.slice(1)}</span></p>
              </div>
              <p><strong>Title:</strong> {currentData.title}</p>
              <p><strong>Description:</strong> {currentData.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Type:</strong> {currentData.requestType}</p>
                <p><strong>Amount:</strong> {currentData.currency === "INR" ? "₹" : "$"}{currentData.requestedAmount.toLocaleString()} {currentData.currency}</p>
              </div>

              {currentData.status === "created" && (
                <div className="mt-4">
                  <Label htmlFor="status-remarks">Remarks (optional)</Label>
                  <Textarea
                    id="status-remarks"
                    placeholder="Enter remarks for the status update (optional)"
                    value={formData.remarks || ""}
                    onChange={(e) => handleFormChange("remarks", e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}

              {currentData.status === "created" && (
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange("approved")}>Approve</Button>
                  <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleStatusChange("rejected")}>Reject</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleStatusChange("revision")}>Request Revision</Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="border-t pt-4 mt-6 flex justify-end gap-3">
            {modal.type === "create" && <Button className="bg-blue-600 text-white" onClick={handleCreate}>Create Request</Button>}
            {modal.type === "edit" && <Button className="bg-blue-600 text-white" onClick={handleUpdate}>Update Request</Button>}
            <Button variant="outline" onClick={closeModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}