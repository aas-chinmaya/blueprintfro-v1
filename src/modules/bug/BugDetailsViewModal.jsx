






"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatDateUTC } from "@/utils/formatDate";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import { resolveBug, clearErrors, fetchBugByEmployeeId } from "@/features/bugSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Bug, Calendar, User, Clock, AlertCircle, FileText, CheckCircle, Clock as ClockIcon, ExternalLinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BugDetailsViewModal = ({ isOpen, onOpenChange, bug }) => {
  const { currentUser } = useCurrentUser();
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector((state) => state.bugs.loading?.bugResolve);
  const error = useSelector((state) => state.bugs.error?.bugResolve);
  const [delayReason, setDelayReason] = useState(bug?.delayReason || "");
  const [resolutionNote, setResolutionNote] = useState("");

  useEffect(() => {
    if (isOpen && bug) {
      setDelayReason(bug?.delayReason || "");
      setResolutionNote("");
    }

    return () => {
      if (error) {
        dispatch(clearErrors());
      }
    };
  }, [dispatch, isOpen, bug, error]);

  const handleResolveBug = () => {
    if (!bug) return;

    if (!resolutionNote.trim()) {
      toast.error("Please provide a resolution note.");
      return;
    }


const today = formatDateUTC(new Date().toISOString());
const deadline = formatDateUTC(bug.deadline);

const isPastDeadline = new Date(today) > new Date(deadline);

if (isPastDeadline && !delayReason.trim()) {
  toast.error("Please provide a reason for the delay.");
  return;
}
    const payload = {
      bugId: bug.bug_id,
      resolutionNote,
      ...(isPastDeadline && { delayReason }),
    };

    dispatch(resolveBug(payload)).then((result) => {
      if (result.error) {
        toast.error(`Failed to resolve bug: ${result.error.message}`);
      } else {
        toast.success("Bug resolved successfully!");
        onOpenChange(false);
      }
    });
 
    
    
  };

  if (!bug) {
    return null;
  }

  const isAssignedToCurrentUser = currentUser?.id === bug?.assignedTo;
  const isResolved = bug.status.toLowerCase() === "resolved";
  


// Format both dates and then compare
const isOverdue = bug.deadline && 
  new Date(formatDateUTC(new Date().toISOString())) > new Date(formatDateUTC(bug.deadline));



  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full h-[100vh] sm:max-w-4xl sm:max-h-[90vh] md:max-w-5xl bg-white shadow-lg border-gray-200 rounded-lg text-black overflow-y-auto">
        <DialogHeader className="px-4 py-3 sm:px-6 sm:py-4  sticky top-0 ">
          <DialogTitle className="text-gray-800 text-lg font-bold flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Bug Details
          </DialogTitle>
          
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-2 px-4 sm:px-6">
          {/* Bug ID */}
          <div className="flex flex-col">
            <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Bug ID
            </Label>
            <p className="text-xs text-black p-2">{bug.bug_id}</p>
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Status
            </Label>
            <p className="text-xs text-black p-2">{bug.status || "N/A"}</p>
          </div>

          {/* Priority */}
          <div className="flex flex-col">
            <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Priority
            </Label>
            <p className="text-xs text-black p-2">{bug.priority || "N/A"}</p>
          </div>

          {/* Deadline */}
          {bug.deadline && (
            <div className="flex flex-col">
              <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Deadline
              </Label>
              <p className="text-xs text-black p-2">
                {
                  formatDateUTC(bug.deadline) || "N/A"
                }
              </p>
            </div>
          )}

          {/* Assigned To */}
          {bug?.assignedToDetails?.memberName && (
            <div className="flex flex-col">
              <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                <User className="h-3 w-3" />
                Assigned To
              </Label>
              <p className="text-xs text-black p-2">{bug.assignedToDetails.memberName}</p>
            </div>
          )}

          {/* Project Id */}
          {bug.projectId && (
            <div className="flex flex-col">
              <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Project Id
              </Label>
              <p className="text-xs text-black p-2">{bug.projectId}</p>
            </div>
          )}

          {/* Created At */}
          {bug.createdAt && (
            <div className="flex flex-col">
              <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                Created At
              </Label>
              <p className="text-xs text-black p-2">{formatDateUTC(bug.createdAt)}</p>
            </div>
          )}

          {/* Task Ref - Clickable */}
       
<div className="flex flex-col relative">
  <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
    <FileText className="h-3 w-3" />
    Task Ref
  </Label>

  <div className="inline-flex items-center gap-2">
    {/* Task ID chip */}
    <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs">
      {bug.taskRef}
    </span>

    {/* Redirect icon with tooltip */}
    <span className="relative group cursor-pointer text-blue-500">
      <ExternalLinkIcon className="w-4 h-4" /> {/* replace with your icon */}
      <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Click to view full task
      </span>
      <span
        onClick={() => router.push(`/task/${bug.taskRef}`)}
        className="absolute inset-0"
      />
    </span>
  </div>
</div>

          {/* Title - Larger Area */}
          <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
            <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Title
            </Label>
            <p className="text-sm text-black p-3 ">{bug.title}</p>
          </div>

          {/* Description - Larger Area */}
          {bug.description && (
            <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
              <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Description
              </Label>
              <p className="text-sm text-black p-3 rounded-md  border border-gray-200 whitespace-pre-wrap break-words">
                {bug.description}
              </p>
            </div>
          )}

          {/* Delay Reason - View or Input, Larger Area */}
          {(isOverdue && !isResolved && isAssignedToCurrentUser) || bug.delayReason ? (
            <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
              <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Delay Reason
              </Label>
              {isResolved || bug.delayReason ? (
                <p className="text-sm text-black p-3 rounded-md  border border-gray-200">
                  {bug.delayReason || "N/A"}
                </p>
              ) : (
                <Textarea
                  className="text-sm text-black p-3 rounded-md border border-gray-200 min-h-[4rem] max-h-40 resize-y focus:border-gray-500 focus:ring focus:ring-gray-200"
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  placeholder="Enter reason for delay"
                />
              )}
            </div>
          ) : null}

          {/* Resolution Note - Input if Resolving, View if Resolved, Larger Area */}
          {(!isResolved && isAssignedToCurrentUser) || bug.resolutionNote ? (
            <div className="sm:col-span-2 lg:col-span-3 flex flex-col">
              <Label className="text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Resolution Note
              </Label>
              {!isResolved && isAssignedToCurrentUser ? (
                <Textarea
                  className="text-sm text-black p-3 rounded-md border border-gray-200 min-h-[6rem] max-h-40 resize-y focus:border-gray-500 focus:ring focus:ring-gray-200"
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Enter resolution note"
                />
              ) : (
                <p className="text-sm text-black p-3 rounded-md  border border-gray-200">
                  {bug.resolutionNote}
                </p>
              )}
            </div>
          ) : null}

          {/* Error Message */}
          {error && (
            <div className="sm:col-span-2 lg:col-span-3 text-xs text-red-600 font-medium bg-red-50 border border-red-200 rounded p-3">
              {error}
            </div>
          )}
        </div>
        <DialogFooter className="px-4 sm:px-6 py-4 border-t border-gray-200">
          {!isResolved && isAssignedToCurrentUser && (
            <Button
              onClick={handleResolveBug}
              className="bg-black text-white hover:bg-gray-800 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Resolving...
                </>
              ) : (
                "Resolve Bug"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BugDetailsViewModal;