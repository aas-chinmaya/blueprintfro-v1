



// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchBudgetRequestsByProject,
//   createBudgetRequest,
//   updateBudgetRequest,
//   deleteBudgetRequest,
//   updateBudgetRequestStatus,
// } from "@/features/budget/budgetRequestSlice";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {Edit, Trash2 } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useCurrentUser } from "@/hooks/useCurrentUser";

// export default function BudgetRequestsTable({ projectId }) {
//   const dispatch = useDispatch();
//   const { projectRequests, loading } = useSelector((state) => state.budgetRequest);
//   const { currentUser } = useCurrentUser();

//   const [modal, setModal] = useState({ type: null, open: false });
//   const [currentData, setCurrentData] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     requestedAmount: 0,
//     currency: "INR",
//     requestType: "General",
//     remarks: "",
//   });

//   useEffect(() => {
//     if (projectId) {
//       dispatch(fetchBudgetRequestsByProject(projectId));
//     }
//   }, [dispatch, projectId]);

//   const openModal = (type, data = null) => {
//     setCurrentData(data);
//     setFormData(
//       data
//         ? { ...data, remarks: "" }
//         : { title: "", description: "", requestedAmount: 0, currency: "INR", requestType: "General", remarks: "" }
//     );
//     setModal({ type, open: true });
//   };

//   const closeModal = () => setModal({ type: null, open: false });

//   const handleFormChange = (field, value) =>
//     setFormData((prev) => ({ ...prev, [field]: value }));

//   const handleCreate = async () => {
//     if (!projectId) return alert("Project ID is missing!");
//     await dispatch(createBudgetRequest({ projectId, ...formData }));
//     closeModal();
//   };

//   const handleUpdate = async () => {
//     await dispatch(updateBudgetRequest({
//       requestId: currentData.requestId,
//       data: { ...formData, remarks: formData.remarks || "" },
//     }));
//     closeModal();
//   };

//   const handleStatusChange = async (status) => {
//     await dispatch(updateBudgetRequestStatus({
//       requestId: currentData.requestId,
//       status,
//       remarks: formData.remarks || "",
//       userId: currentUser?.id,
//     }));
//     closeModal();
//   };

//   const handleDelete = async () => {
//     await dispatch(deleteBudgetRequest(currentData.requestId));
//     closeModal();
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "approved": return "success";
//       case "rejected": return "destructive";
//       case "revision": return "secondary";
//       default: return "default";
//     }
//   };

//   const formatCurrency = (amount) =>
//     new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);

//   return (
//     <div className="w-full space-y-4">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">Request Received</h2>
//         <Button onClick={() => openModal("create")} className="bg-blue-600 hover:bg-blue-700 text-white">
//           + New Request
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-md border w-full shadow-sm">
//         <Table className="w-full text-sm">
//           <TableHeader className="bg-gray-50">
//             <TableRow>
//               <TableHead className="w-[120px]">Request ID</TableHead>
              
//               <TableHead>Amount</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-center">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center text-muted-foreground">
//                   Loading requests...
//                 </TableCell>
//               </TableRow>
//             ) : projectRequests?.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center text-muted-foreground">
//                   No budget requests found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               projectRequests.slice().reverse().map((req) => (
//                 <TableRow key={req.requestId} hover onClick={() => openModal("view", req)}>
//                   <TableCell className="font-mono text-gray-700">{req.requestId}</TableCell>
                  
//                   <TableCell className="flex items-center gap-1 text-gray-800">
//                      {formatCurrency(req.requestedAmount)}
//                   </TableCell>
//                   <TableCell>{req.requestType || "N/A"}</TableCell>
//                   <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
//                   <TableCell>
//                     <Badge variant={getStatusColor(req.status)} className="capitalize">
//                       {req.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="flex gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
//                     <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50" onClick={() => openModal("edit", req)}>
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                     <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => openModal("delete", req)}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* MODAL */}
//       <Dialog open={modal.open} onOpenChange={closeModal}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle>
//               {modal.type === "create" && "Create Budget Request"}
//               {modal.type === "edit" && "Edit Budget Request"}
//               {modal.type === "view" && "Request Details"}
//               {modal.type === "delete" && "Delete Confirmation"}
//             </DialogTitle>
//           </DialogHeader>

//           {/* CREATE & EDIT */}
//           {(modal.type === "create" || modal.type === "edit") && (
//             <div className="space-y-4 mt-4">
//               <div>
//                 <Label>Title</Label>
//                 <Input value={formData.title} onChange={(e) => handleFormChange("title", e.target.value)} />
//               </div>
//               <div>
//                 <Label>Description</Label>
//                 <Textarea value={formData.description} onChange={(e) => handleFormChange("description", e.target.value)} />
//               </div>
//               <div>
//                 <Label>Amount (INR)</Label>
//                 <Input type="number" value={formData.requestedAmount} onChange={(e) => handleFormChange("requestedAmount", Number(e.target.value))} />
//               </div>
//             </div>
//           )}

//           {/* VIEW */}
//           {modal.type === "view" && currentData && (
//             <div className="space-y-4 mt-4 text-sm text-gray-700 w-full">
//               <p><strong>ID:</strong> {currentData.requestId}</p>
//               <p><strong>Title:</strong> {currentData.title}</p>
//               <p><strong>Description:</strong> {currentData.description}</p>
//               <p><strong>Amount:</strong> {formatCurrency(currentData.requestedAmount)}</p>
//               <p><strong>Status:</strong> <Badge variant={getStatusColor(currentData.status)}>{currentData.status}</Badge></p>

//               {/* Remarks only during approval */}
//               {currentData.status === "created" && (
//                 <div className="space-y-2 mt-4">
//                   <Label>Remarks (optional, max 100 chars)</Label>
//                   <Textarea
//                   placeholder="Add remarks for your decision..."
//                     maxLength={500}
//                     value={formData.remarks}
//                     onChange={(e) => handleFormChange("remarks", e.target.value)}
//                   />
//                   <div className="flex gap-3 mt-2">
//                     <Button onClick={() => handleStatusChange("approved")} className="bg-green-600 text-white hover:bg-green-700">Approve</Button>
//                     <Button onClick={() => handleStatusChange("rejected")} className="bg-red-600 text-white hover:bg-red-700">Reject</Button>
//                     <Button onClick={() => handleStatusChange("revision")} className="bg-blue-600 text-white hover:bg-blue-700">Request Revision</Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* DELETE */}
//           {modal.type === "delete" && (
//             <div className="mt-4">
//               <DialogDescription>Are you sure you want to delete this request? This action cannot be undone.</DialogDescription>
//             </div>
//           )}

//           <DialogFooter className="mt-6 flex gap-2">
//             {modal.type === "create" && <Button onClick={handleCreate} className="bg-blue-600 text-white hover:bg-blue-700">Create Request</Button>}
//             {modal.type === "edit" && <Button onClick={handleUpdate} className="bg-blue-600 text-white hover:bg-blue-700">Update Request</Button>}
//             {modal.type === "delete" && (
//               <>
//                 <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">Yes, Delete</Button>
//                 <Button variant="outline" onClick={closeModal}>No, Cancel</Button>
//               </>
//             )}
//             {(modal.type === "create" || modal.type === "edit" || modal.type === "view") && <Button variant="outline" onClick={closeModal}>Close</Button>}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchBudgetRequestsByProject,
//   createBudgetRequest,
//   updateBudgetRequest,
//   deleteBudgetRequest,
//   updateBudgetRequestStatus,
// } from "@/features/budget/budgetRequestSlice";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Edit, Trash2 } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useCurrentUser } from "@/hooks/useCurrentUser";

// export default function BudgetRequestsTable({ projectId }) {
//   const dispatch = useDispatch();
//   const { projectRequests, loading } = useSelector((state) => state.budgetRequest);
//   const { currentUser } = useCurrentUser();

//   const [modal, setModal] = useState({ type: null, open: false });
//   const [currentData, setCurrentData] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     requestedAmount: 0,
//     currency: "INR",
//     requestType: "General",
//     remarks: "",
//   });

//   useEffect(() => {
//     if (projectId) dispatch(fetchBudgetRequestsByProject(projectId));
//   }, [dispatch, projectId]);

//   const openModal = (type, data = null) => {
//     setCurrentData(data);
//     setFormData(
//       data
//         ? { ...data, remarks: "" }
//         : { title: "", description: "", requestedAmount: 0, currency: "INR", requestType: "General", remarks: "" }
//     );
//     setModal({ type, open: true });
//   };

//   const closeModal = () => setModal({ type: null, open: false });

//   const handleFormChange = (field, value) =>
//     setFormData((prev) => ({ ...prev, [field]: value }));

//   const handleCreate = async () => {
//     if (!projectId) return alert("Project ID is missing!");
//     await dispatch(createBudgetRequest({ projectId, ...formData }));
//     closeModal();
//   };

//   const handleUpdate = async () => {
//     await dispatch(updateBudgetRequest({
//       requestId: currentData.requestId,
//       data: { ...formData, remarks: formData.remarks || "" },
//     }));
//     closeModal();
//   };

//   const handleStatusChange = async (status) => {
//     await dispatch(updateBudgetRequestStatus({
//       requestId: currentData.requestId,
//       status,
//       remarks: formData.remarks || "",
//       userId: currentUser?.id,
//     }));
//     closeModal();
//   };

//   const handleDelete = async () => {
//     await dispatch(deleteBudgetRequest(currentData.requestId));
//     closeModal();
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "approved": return "success";
//       case "rejected": return "destructive";
//       case "revision": return "secondary";
//       default: return "default";
//     }
//   };

//   const formatCurrency = (amount) =>
//     new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);

//   return (
//     <div className="w-full space-y-4">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">Request Received</h2>
//         <Button onClick={() => openModal("create")} className="bg-blue-600 hover:bg-blue-700 text-white">
//           + New Request
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-md border w-full shadow-sm">
//         <Table className="w-full text-sm">
//           <TableHeader className="bg-gray-50">
//             <TableRow>
//               <TableHead className="w-[120px]">Request ID</TableHead>
//               <TableHead>Amount</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-center">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center text-muted-foreground">
//                   Loading requests...
//                 </TableCell>
//               </TableRow>
//             ) : projectRequests?.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center text-muted-foreground">
//                   No budget requests found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               projectRequests.slice().reverse().map((req) => (
//                 <TableRow key={req.requestId} hover onClick={() => openModal("view", req)}>
//                   <TableCell className="font-mono text-gray-700">{req.requestId}</TableCell>
//                   <TableCell className="flex items-center gap-1 text-gray-800">{formatCurrency(req.requestedAmount)}</TableCell>
//                   <TableCell>{req.requestType || "N/A"}</TableCell>
//                   <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
//                   <TableCell>
//                     <Badge variant={getStatusColor(req.status)} className="capitalize">
//                       {req.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="flex gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
//                     <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50" onClick={() => openModal("edit", req)}>
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                     <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => openModal("delete", req)}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* MODAL */}
//       <Dialog open={modal.open} onOpenChange={closeModal} >
//         <DialogContent className="w-[80vw] w-full h-[90vh] overflow-auto p-6">
//           <DialogHeader>
//             <DialogTitle>
//               {modal.type === "create" && "Create Budget Request"}
//               {modal.type === "edit" && "Edit Budget Request"}
//               {modal.type === "view" && "Request Details"}
//               {modal.type === "delete" && "Delete Confirmation"}
//             </DialogTitle>
//           </DialogHeader>

//           {/* CREATE & EDIT */}
//           {(modal.type === "create" || modal.type === "edit") && (
//             <div className="space-y-4 mt-4">
//               <div>
//                 <Label>Title</Label>
//                 <Input value={formData.title} onChange={(e) => handleFormChange("title", e.target.value)} />
//               </div>
//               <div>
//                 <Label>Description</Label>
//                 <Textarea value={formData.description} maxLength={500} onChange={(e) => handleFormChange("description", e.target.value)} />
//               </div>
//               <div>
//                 <Label>Amount (INR)</Label>
//                 <Input type="number" value={formData.requestedAmount} onChange={(e) => handleFormChange("requestedAmount", Number(e.target.value))} />
//               </div>
//             </div>
//           )}

//           {/* VIEW */}
//           {modal.type === "view" && currentData && (
//             <div className="mt-4 flex flex-col lg:flex-row gap-6">
//               {/* Left side: main info */}
//               <div className="flex-1 space-y-2 text-gray-700">
//                 <p><strong>ID:</strong> {currentData.requestId}</p>
//                 <p><strong>Title:</strong> {currentData.title}</p>
//                 <p><strong>Description:</strong> {currentData.description}</p>
//                 <p><strong>Amount:</strong> {formatCurrency(currentData.requestedAmount)}</p>
//                 <p><strong>Status:</strong> <Badge variant={getStatusColor(currentData.status)}>{currentData.status}</Badge></p>

//                 {/* Remarks for approval */}
//                 {currentData.status === "created" && (
//                   <div className="space-y-2 mt-4">
//                     <Label>Remarks (optional, max 500 chars)</Label>
//                     <Textarea
//                       placeholder="Add remarks for your decision..."
//                       maxLength={500}
//                       value={formData.remarks}
//                       onChange={(e) => handleFormChange("remarks", e.target.value)}
//                     />
//                     <div className="flex flex-wrap gap-3 mt-2">
//                       <Button onClick={() => handleStatusChange("approved")} className="bg-green-600 text-white hover:bg-green-700">Approve</Button>
//                       <Button onClick={() => handleStatusChange("rejected")} className="bg-red-600 text-white hover:bg-red-700">Reject</Button>
//                       <Button onClick={() => handleStatusChange("revision")} className="bg-blue-600 text-white hover:bg-blue-700">Request Revision</Button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Right side: action history */}
//               <div className="w-full lg:w-1/3 bg-gray-50 p-4 rounded-md space-y-2 overflow-y-auto max-h-[60vh]">
//                 <h3 className="font-semibold text-gray-800 mb-2">Action History</h3>
//                 {currentData.actionHistory?.length > 0 ? (
//                   currentData.actionHistory.map((act, idx) => (
//                     <div key={idx} className="p-2 border rounded-md bg-white">
//                       <p><strong>Action:</strong> {act.action}</p>
//                       <p><strong>By:</strong> {act.by}</p>
//                       <p><strong>Remarks:</strong> {act.remarks}</p>
//                       <p className="text-xs text-gray-500">{new Date(act.at).toLocaleString()}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-500">No actions yet.</p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* DELETE */}
//           {modal.type === "delete" && (
//             <div className="mt-4">
//               <DialogDescription>Are you sure you want to delete this request? This action cannot be undone.</DialogDescription>
//             </div>
//           )}

//           <DialogFooter className="mt-6 flex flex-wrap gap-2">
//             {modal.type === "create" && <Button onClick={handleCreate} className="bg-blue-600 text-white hover:bg-blue-700">Create Request</Button>}
//             {modal.type === "edit" && <Button onClick={handleUpdate} className="bg-blue-600 text-white hover:bg-blue-700">Update Request</Button>}
//             {modal.type === "delete" && (
//               <>
//                 <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">Yes, Delete</Button>
//                 <Button variant="outline" onClick={closeModal}>No, Cancel</Button>
//               </>
//             )}
//             {(modal.type === "create" || modal.type === "edit" || modal.type === "view") && <Button variant="outline" onClick={closeModal}>Close</Button>}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }







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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function BudgetRequestsTable({ projectId }) {
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
    remarks: "",
  });

  useEffect(() => {
    if (projectId) dispatch(fetchBudgetRequestsByProject(projectId));
  }, [dispatch, projectId]);

  const openModal = (type, data = null) => {
    setCurrentData(data);
    setFormData(
      data
        ? { ...data, remarks: "" }
        : { title: "", description: "", requestedAmount: 0, currency: "INR", requestType: "General", remarks: "" }
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
      data: { ...formData, remarks: formData.remarks || "" },
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
      case "approved": return "success";
      case "rejected": return "destructive";
      case "revision": return "secondary";
      default: return "default";
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Request Received</h2>
        <Button onClick={() => openModal("create")} className="bg-blue-600 hover:bg-blue-700 text-white">
          + New Request
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border w-full shadow-sm">
        <Table className="w-full text-sm">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[120px]">Request ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Loading requests...
                </TableCell>
              </TableRow>
            ) : projectRequests?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No budget requests found.
                </TableCell>
              </TableRow>
            ) : (
              projectRequests.slice().reverse().map((req) => (
                <TableRow key={req.requestId} hover onClick={() => openModal("view", req)}>
                  <TableCell className="font-mono text-gray-700">{req.requestId}</TableCell>
                  <TableCell className="flex items-center gap-1 text-gray-800">{formatCurrency(req.requestedAmount)}</TableCell>
                  <TableCell>{req.requestType || "N/A"}</TableCell>
                  <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(req.status)} className="capitalize">
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50" onClick={() => openModal("edit", req)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => openModal("delete", req)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL */}
      <Dialog open={modal.open} onOpenChange={closeModal}>
        <DialogContent
          className={
            modal.type === "view"
              ? "w-full h-[95vh] p-6 pb-10 overflow-auto"
              : "w-[80vw] max-w-md p-6 pb-6 overflow-auto"
          }
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              {modal.type === "create" && "Create Budget Request"}
              {modal.type === "edit" && "Edit Budget Request"}
              {modal.type === "view" && "Budget Request Details"}
              {modal.type === "delete" && "Delete Confirmation"}
            </DialogTitle>
          </DialogHeader>

          {/* CREATE & EDIT */}
          {(modal.type === "create" || modal.type === "edit") && (
            <div className="mt-4 space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => handleFormChange("title", e.target.value)} />
              </div>
              <div>
                <Label>Description (max 500 words)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => {
                    const words = e.target.value.split(/\s+/).filter(Boolean);
                    if (words.length <= 500) handleFormChange("description", e.target.value);
                  }}
                  className="min-h-[100px] resize-y"
                  placeholder="Enter description..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.split(/\s+/).filter(Boolean).length} / 500 words
                </p>
              </div>
              <div>
                <Label>Amount (INR)</Label>
                <Input type="number" value={formData.requestedAmount} onChange={(e) => handleFormChange("requestedAmount", Number(e.target.value))} />
              </div>
            </div>
          )}

          {/* VIEW */}
          {modal.type === "view" && currentData && (
            <div className="mt-6 flex flex-col lg:flex-row gap-8">
              {/* Left: main info */}
              <div className="flex-1 space-y-4 text-gray-800">
                <p className="text-sm text-gray-500">Request ID</p>
                <p className="text-lg font-mono text-gray-700">{currentData.requestId}</p>

                <p className="text-sm text-gray-500">Title</p>
                <p className="text-lg font-semibold text-gray-800">{currentData.title}</p>

                <p className="text-sm text-gray-500">Description</p>
                <p className="text-base text-gray-700">{currentData.description}</p>

                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-lg font-semibold text-gray-800">{formatCurrency(currentData.requestedAmount)}</p>

                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={getStatusColor(currentData.status)} className="capitalize">{currentData.status}</Badge>

                {/* Remarks for approval */}
                {currentData.status === "created" && (
                  <div className="mt-4 space-y-3">
                    <Label>Remarks (optional, max 500 words)</Label>
                    <Textarea
                      placeholder="Add remarks..."
                      value={formData.remarks}
                      onChange={(e) => {
                        const words = e.target.value.split(/\s+/).filter(Boolean);
                        if (words.length <= 500) handleFormChange("remarks", e.target.value);
                      }}
                      className="min-h-[120px] resize-y mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.remarks.split(/\s+/).filter(Boolean).length} / 500 words
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <Button onClick={() => handleStatusChange("approved")} className="bg-green-600 text-white hover:bg-green-700">Approve</Button>
                      <Button onClick={() => handleStatusChange("rejected")} className="bg-red-600 text-white hover:bg-red-700">Reject</Button>
                      <Button onClick={() => handleStatusChange("revision")} className="bg-blue-600 text-white hover:bg-blue-700">Request Revision</Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: action history */}
              <div className="w-full lg:w-1/3 bg-gray-50 p-4 rounded-md space-y-2 overflow-y-auto max-h-[70vh]">
                <h3 className="font-semibold text-gray-800 mb-3">Action History</h3>
                {currentData.actionHistory?.length > 0 ? (
                  currentData.actionHistory.map((act, idx) => (
                    <div key={idx} className="p-3 border rounded-md bg-white">
                      <p className="text-sm text-gray-500"><strong>Action:</strong> {act.action}</p>
                      <p className="text-sm text-gray-500"><strong>By:</strong> {act.by}</p>
                      <p className="text-sm text-gray-500"><strong>Remarks:</strong> {act.remarks}</p>
                      <p className="text-xs text-gray-400">{new Date(act.at).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No actions yet.</p>
                )}
              </div>
            </div>
          )}

          {/* DELETE */}
          {modal.type === "delete" && (
            <div className="mt-4">
              <DialogDescription>Are you sure you want to delete this request? This action cannot be undone.</DialogDescription>
            </div>
          )}

          <DialogFooter className="mt-6 flex flex-wrap gap-2">
            {modal.type === "create" && <Button onClick={handleCreate} className="bg-blue-600 text-white hover:bg-blue-700">Create Request</Button>}
            {modal.type === "edit" && <Button onClick={handleUpdate} className="bg-blue-600 text-white hover:bg-blue-700">Update Request</Button>}
            {modal.type === "delete" && (
              <>
                <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">Yes, Delete</Button>
                <Button variant="outline" onClick={closeModal}>No, Cancel</Button>
              </>
            )}
            {(modal.type === "create" || modal.type === "edit" || modal.type === "view") && <Button variant="outline" onClick={closeModal}>Close</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


