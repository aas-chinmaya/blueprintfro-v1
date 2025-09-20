



"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchDocuments, 
  deleteSingleDocument, 
  downloadDocument,
  clearError 
} from "@/features/documentSlice";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UploadDocument from "./UploadDocument";
import { format } from "date-fns";
import { Loader2, Download, Trash2, AlertCircle, FileText, Upload, X } from "lucide-react";
import { toast } from "sonner"; // or your preferred toast library

// File type badges - Updated to work with filePath
const getFileTypeBadge = (filePath) => {
  const filename = filePath?.split('/').pop(); // Extract filename from path
  const ext = filename?.split(".").pop()?.toLowerCase();
  
  const types = {
    pdf: { variant: "default", text: "PDF", color: "bg-red-500" },
    docx: { variant: "secondary", text: "Word", color: "bg-blue-500" },
    doc: { variant: "secondary", text: "Word", color: "bg-blue-500" },
    xlsx: { variant: "outline", text: "Excel", color: "bg-green-500" },
    xls: { variant: "outline", text: "Excel", color: "bg-green-500" },
    pptx: { variant: "destructive", text: "PowerPoint", color: "bg-orange-500" },
    ppt: { variant: "destructive", text: "PowerPoint", color: "bg-orange-500" },
    jpg: { variant: "secondary", text: "Image", color: "bg-purple-500" },
    jpeg: { variant: "secondary", text: "Image", color: "bg-purple-500" },
    png: { variant: "secondary", text: "Image", color: "bg-purple-500" },
    gif: { variant: "secondary", text: "Image", color: "bg-purple-500" },
    txt: { variant: "ghost", text: "Text", color: "bg-gray-500" },
    zip: { variant: "outline", text: "Archive", color: "bg-yellow-500" },
    default: { variant: "secondary", text: "File", color: "bg-gray-500" },
  };
  
  return types[ext] || types.default;
};

// Calculate file size from filePath (basic implementation)
const getFileSize = (filePath) => {
  // This is a simple implementation. In a real app, you'd get this from your API
  const filename = filePath?.split('/').pop();
  if (!filename) return null;
  

  return null; // Return null for now, or implement size calculation
};

export default function DocumentManager({ project, projectId }) {
  const dispatch = useDispatch();
  const { 
    items: documents, 
    loading, 
    deleting, 
    error,
    downloading 
  } = useSelector((state) => state.documents);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, docId: null, docName: null });

  // Fetch documents on mount
  useEffect(() => {
    if (projectId) {
      dispatch(fetchDocuments(projectId));
    }
  }, [dispatch, projectId]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handle document deletion confirmation
  const confirmDeleteDocument = (docId, docName) => {
    setDeleteDialog({ open: true, docId, docName });
  };

  // Handle confirmed document deletion
  const handleDeleteDocument = async () => {
    if (!deleteDialog.docId || !deleteDialog.docName) return;

    try {
      await dispatch(deleteSingleDocument(deleteDialog.docId)).unwrap();
      toast.success(`"${deleteDialog.docName}" deleted successfully`);
    } catch (err) {
      console.error("Failed to delete document:", err);
      toast.error("Failed to delete document");
    } finally {
      setDeleteDialog({ open: false, docId: null, docName: null });
    }
  };

  // Handle document download
  const handleDownloadDocument = async (doc) => {
    try {
      // Extract filename from filePath for download
      const filename = doc.filePath?.split('/').pop() || `document_${doc.documentId}`;
      await dispatch(downloadDocument({ 
        docId: doc._id, 
        fileName: filename 
      })).unwrap();
      toast.success("Download started");
    } catch (err) {
      console.error("Failed to download document:", err);
      toast.error("Failed to download document");
    }
  };

  // Handle upload success - refresh documents
  const handleUploadSuccess = () => {
    dispatch(fetchDocuments(projectId));
    toast.success("Document uploaded successfully");
  };

  // Sort by uploadedAt desc (matches backend field)
  const sortedDocuments = [...documents].sort((a, b) => 
    new Date(b.uploadedAt || b.createdAt) - new Date(a.uploadedAt || a.createdAt)
  );

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading && sortedDocuments.length === 0) {
    return (
      <div className="w-full min-h-screen bg-white p-8">
        <Card className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="bg-blue-600 text-white rounded-t-xl p-4">
            <div className="flex justify-between items-center">
              <div className="animate-pulse">
                <div className="h-6 bg-blue-400 rounded w-32 mb-2"></div>
                <div className="h-4 bg-blue-300 rounded w-24"></div>
              </div>
              <div className="h-10 w-20 bg-blue-400 rounded animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <LoadingSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white ">
      <Card className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl p-4">
          <div className="flex justify-between items-center">
            <div>
            
             
            </div>
            <Button 
              onClick={() => setIsUploadOpen(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 border border-white/20 shadow-lg hover:shadow-xl transition-all"
              disabled={deleting}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(clearError())}
                className="ml-auto h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          {loading && sortedDocuments.length > 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 mr-2 animate-spin text-blue-600" />
              <span className="text-gray-600">Updating...</span>
            </div>
          ) : sortedDocuments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents yet</h3>
              <p className="text-gray-600 mb-6">
                Get started by uploading your first document to {project?.projectName}
              </p>
              <Button 
                onClick={() => setIsUploadOpen(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload First Document
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {sortedDocuments.map((doc) => {
                const fileType = getFileTypeBadge(doc.filePath);
                const filename = doc.filePath?.split('/').pop() || doc.name;
                const formattedDate = format(new Date(doc.uploadedAt || doc.createdAt), "MMM dd, yyyy 'at' HH:mm");
                
                return (
                  <div 
                    key={doc._id} 
                    className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start gap-4">
                      {/* Document Info */}
                      <div className="flex-1 min-w-0">
                        {/* Document Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 
                              className="text-base font-semibold text-gray-900 truncate pr-2 mb-1"
                              title={doc.name}
                            >
                              {doc.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2" title={doc.description}>
                              {doc.description || 'No description provided'}
                            </p>
                          </div>
                          
                          {/* File Type Badge */}
                          <Badge 
                            variant={fileType.variant} 
                            className="flex-shrink-0 text-xs font-medium"
                            style={{ backgroundColor: fileType.color + '20', color: fileType.color }}
                          >
                            {fileType.text}
                          </Badge>
                        </div>

                        {/* Document Metadata */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            📅 {formattedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            📄 {filename}
                          </span>
                          {getFileSize(doc.filePath) && (
                            <span className="flex items-center gap-1">
                              💾 {getFileSize(doc.filePath)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            🆔 {doc.documentId}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                              disabled={deleting || downloading}
                            >
                              <span className="sr-only">Document actions</span>
                              ⋮
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={() => handleDownloadDocument(doc)}
                              className="flex items-center gap-2 cursor-pointer focus:bg-blue-50"
                              disabled={downloading}
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                              {downloading && (
                                <Loader2 className="w-4 h-4 ml-auto animate-spin text-blue-600" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => confirmDeleteDocument(doc._id, doc.name)}
                              className="flex items-center gap-2 text-red-600 cursor-pointer focus:bg-red-50"
                              disabled={deleting}
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                              {deleting && (
                                <Loader2 className="w-4 h-4 ml-auto animate-spin text-red-600" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-md rounded-lg p-0 max-h-[90vh] overflow-hidden">
          <DialogHeader className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Document
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Add a new document to {project?.projectName}
            </p>
          </DialogHeader>
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <UploadDocument 
              projectId={projectId} 
              project={project}
              onSuccess={handleUploadSuccess}
              onCancel={() => setIsUploadOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={() => setDeleteDialog({ open: false, docId: null, docName: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Delete Document
            </DialogTitle>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete "<strong>{deleteDialog.docName}</strong>"? 
              This action cannot be undone.
            </p>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, docId: null, docName: null })}
              className="flex-1"
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteDocument}
              className="flex-1"
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Document
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}