

"use client";

import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadSingleDocument } from "@/features/documentSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X, Edit2, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // or your preferred toast library

// Forbidden file types
const forbiddenTypes = ["exe", "bat", "sh", "js", "msi", "com", "dll"];

export default function UploadDocument({ projectId, onSuccess }) {
  const dispatch = useDispatch();
  const { uploading, error } = useSelector((state) => state.documents);
  
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState("");
  const [description, setDescription] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  
  const fileInputRef = useRef(null);

  // Handle single file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    validateAndSetFile(selectedFile);
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    validateAndSetFile(droppedFile);
  };

  // Validate and set file
  const validateAndSetFile = (selectedFile) => {
    const ext = selectedFile.name.split(".").pop().toLowerCase();
    const isForbiddenType = forbiddenTypes.includes(ext);
    const isTooLarge = selectedFile.size > 10 * 1024 * 1024; // 10MB

    if (isForbiddenType) {
      toast.error("File type not allowed", {
        description: "Please select a supported file type"
      });
      return;
    }

    if (isTooLarge) {
      toast.error("File too large", {
        description: "Maximum file size is 10MB"
      });
      return;
    }

    setFile(selectedFile);
    setDocName(selectedFile.name.split('.')[0]); // Use name without extension
    setIsEditingName(false);
    setDescription("");
    setProgress(0);
    setUploadStatus(null);
  };

  // Remove file
  const handleRemoveFile = () => {
    setFile(null);
    setDocName("");
    setDescription("");
    setIsEditingName(false);
    setProgress(0);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Toggle filename editing
  const toggleEditName = () => {
    if (!isEditingName && file) {
      setIsEditingName(true);
    }
  };

  // Save filename edit
  const saveEditName = () => {
    if (docName.trim() && file) {
      setIsEditingName(false);
    } else if (file) {
      setDocName(file.name.split('.')[0]);
      setIsEditingName(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle form submit - CORRECTED to match backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!docName.trim()) {
      toast.error("Document name is required");
      return;
    }

    // Create payload matching backend expectations
    const payload = {
      name: docName.trim(),
      description: description.trim(),
      file, // File object - this is what multer expects
      projectId
    };

    try {
      setUploadStatus('uploading');
      setProgress(0);
      
      // Show initial progress
      setTimeout(() => {
        setProgress(10); // Initial progress
      }, 100);

      const result = await dispatch(uploadSingleDocument(payload)).unwrap();
      
      // Simulate progress completion
      setProgress(100);
      setUploadStatus('success');
      toast.success("Document uploaded successfully!");
      
      // Reset form after success
      setTimeout(() => {
        handleRemoveFile();
        setUploadStatus(null);
        setProgress(0);
        
        if (onSuccess) {
          onSuccess(result);
        }
      }, 1500);
      
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus('error');
      setProgress(0);
      toast.error(err?.message || "Upload failed");
      
      setTimeout(() => {
        setUploadStatus(null);
      }, 3000);
    }
  };

  const isUploading = uploading || uploadStatus === 'uploading';
  const fileExtension = file ? file.name.split(".").pop().toUpperCase() : "";
  const fileSize = file ? formatFileSize(file.size) : "";

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-sm">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center w-14 h-14 mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mb-4 border border-white/20">
          <Upload className="w-7 h-7 text-blue-600" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">Upload Document</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Add a document to your project
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <form className="space-y-6 p-6" onSubmit={handleSubmit}>
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* File Selection Area */}
          {!file && (
            <div className="space-y-4">
              <div
                className={cn(
                  "relative p-8 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group bg-white/50 backdrop-blur-sm",
                  dragActive 
                    ? "border-blue-400 bg-blue-50/80 shadow-lg" 
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-25/50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full shadow-md group-hover:shadow-lg transition-shadow">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your file here</h3>
                  <p className="text-sm text-gray-500 mb-6">or click to browse</p>
                  
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all px-6 py-2.5"
                    disabled={isUploading}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-center text-gray-500 bg-gray-50/50 rounded-xl py-3">
                <p>📄 PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, Images, TXT</p>
                <p className="text-blue-600 font-medium">Max 10MB</p>
              </div>
            </div>
          )}

          {/* File Preview & Form */}
          {file && (
            <div className="space-y-5">
              {/* File Preview Card */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      {isEditingName ? (
                        <Input
                          value={docName}
                          onChange={(e) => setDocName(e.target.value)}
                          onBlur={saveEditName}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditName();
                            if (e.key === "Escape") {
                              setDocName(file.name.split('.')[0]);
                              setIsEditingName(false);
                            }
                          }}
                          className="text-lg font-semibold text-gray-900 bg-transparent border-0 border-b border-blue-200 focus:border-blue-500 text-center py-0"
                          autoFocus
                          placeholder="Document name..."
                          disabled={isUploading}
                        />
                      ) : (
                        <div 
                          className="cursor-pointer group text-center" 
                          onClick={toggleEditName}
                        >
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-lg font-semibold text-gray-900">
                              {docName || file.name.split('.')[0]}
                            </span>
                            {!isUploading && (
                              <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-center items-center gap-4 text-sm text-gray-500 bg-gray-50 rounded-full py-1 px-3">
                        <span className="flex items-center gap-1">
                          📄 {fileExtension}
                        </span>
                        <span className="flex items-center gap-1">
                          💾 {fileSize}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2"
                      onClick={handleRemoveFile}
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Description Field */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <span>Description</span> 
                  <span className="text-blue-500">*</span>
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                  placeholder="Describe this document..."
                  rows={3}
                  className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 text-gray-900 placeholder-gray-400"
                  required
                  disabled={isUploading}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="text-blue-500 font-medium">Required</span>
                  <span className={cn(
                    "font-medium", 
                    description.length > 160 && "text-red-500"
                  )}>
                    {description.length}/200
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      {uploadStatus === 'success' ? 'Finalizing...' : 'Uploading...'}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-blue-700" 
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className={cn(
                    "flex-1 shadow-lg hover:shadow-xl transition-all px-6 py-2.5",
                    isUploading 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  )}
                  disabled={isUploading || !description.trim() || !docName.trim()}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {progress > 0 ? `Uploading ${Math.round(progress)}%` : 'Uploading...'}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 px-6 py-2.5"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadStatus === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Upload completed successfully!</span>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
