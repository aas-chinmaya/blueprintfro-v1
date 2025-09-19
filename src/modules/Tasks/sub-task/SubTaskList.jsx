"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDispatch, useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle2,
  Edit,
  Eye,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Lock,
  ListTodo,
  RotateCw,
} from "lucide-react";
import CreateSubtaskModal from "@/modules/Tasks/sub-task/CreateSubTaskModal";
import EditSubtaskModal from "@/modules/Tasks/sub-task/EditSubTaskModal";
import DeleteSubtaskModal from "@/modules/Tasks/sub-task/DeleteSubTaskModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchSubTasksByTaskId,
  updateSubTaskStatus,
} from "@/features/subTaskSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDateUTC } from "@/utils/formatDate";

const SubTaskList = ({ task, taskId, projectId,isTaskClosed }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { subtasks, loading, error } = useSelector((state) => state.subTask);

  

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const subtasksPerPage = 5;
  const safeSubtasks = Array.isArray(subtasks) ? subtasks : [];
  const totalPages = Math.ceil(safeSubtasks.length / subtasksPerPage);
  const indexOfLastSubtask = currentPage * subtasksPerPage;
  const indexOfFirstSubtask = indexOfLastSubtask - subtasksPerPage;
  const currentSubtasks = safeSubtasks.slice(
    indexOfFirstSubtask,
    indexOfLastSubtask
  );
  // Fetch subtasks on mount and when taskId changes
  useEffect(() => {
    if (taskId) {
      dispatch(fetchSubTasksByTaskId(taskId));
    }
  }, [dispatch,subtasks?.length, taskId]);



  // Modal states
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);

  // Calculate progress
  const completedSubtasks = safeSubtasks.filter(
    (st) => st.status === "Completed"
  ).length;
  const progress =
    safeSubtasks.length > 0
      ? (completedSubtasks / safeSubtasks.length) * 100
      : 0;

  // Get next status in cycle: Pending -> In Progress -> Completed -> Pending
  const getNextStatus = (current) => {
    if (current === "Pending") return "In Progress";
    if (current === "In Progress") return "Completed";
    if (current === "Completed") return "Pending";
    return "Pending"; // Fallback
  };

  // Get tooltip text for the toggle action
  const getToggleTooltip = (current) => {
    if (current === "Pending") return "Start Progress";
    if (current === "In Progress") return "Mark as Completed";
    if (current === "Completed") return "Reopen Subtask";
    return "Toggle Status"; // Fallback
  };

  // Handle status toggle
  const handleToggleStatus = async (subtask) => {
    if (isTaskClosed) return;
    const nextStatus = getNextStatus(subtask?.status);
    try {
      await dispatch(
        updateSubTaskStatus({
          taskId,
          subtaskId: subtask.subtask_id,
          status: nextStatus,
        })
      );
      toast.success(`Subtask status updated to ${nextStatus}`);
    } catch (err) {
      toast.error("Failed to update subtask status");
    }
  };

  // Handlers
  const handleView = (subtask) => {
    setSelectedSubtask(subtask);
    setOpenView(true);
  };

  const handleEdit = (subtask) => {
    if (isTaskClosed) return;
    setSelectedSubtask(subtask);
    setOpenEdit(true);
  };

  const handleDelete = (subtask) => {
    if (isTaskClosed) return;
    setSelectedSubtask(subtask);
    setOpenDelete(true);
    // Adjust page if deleting the last subtask on the current page
    if (currentSubtasks.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getStatusVariant = (status) => {
    if (status === "Completed") return "success";
    if (status === "In Progress") return "warning";
    return "secondary"; // For Pending
  };

 

  return (
    <section>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base sm:text-lg font-semibold flex items-center">
          <ListTodo className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
          Subtasks
        </h3>
        {!isTaskClosed ? (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
            onClick={() => setOpenAdd(true)}
            disabled={isTaskClosed}
          >
            <Plus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Add
          </Button>
        ) : (
          <Badge
            variant="secondary"
            className="flex items-center text-xs sm:text-sm"
          >
            <Lock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Read-Only
          </Badge>
        )}
      </div>
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-xs sm:text-sm">
            Progress: {progress.toFixed(0)}%
          </span>
          <Badge
            variant={progress === 100 ? "success" : "default"}
            className="text-xs sm:text-sm"
          >
            {completedSubtasks}/{safeSubtasks.length} Completed
          </Badge>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200" />
      </div>
      {loading && (
        <div className="text-center text-sm text-gray-500">
          Loading subtasks...
        </div>
      )}
    
      {!loading && !error && safeSubtasks.length === 0 && (
        <div className="text-center text-sm text-gray-500">
          No subtasks available
        </div>
      )}
      {!loading && !error && safeSubtasks.length > 0 && (
        <ul className="space-y-2">
          {currentSubtasks.map((st) => (
            <li
              key={st.subtask_id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 sm:p-3 border rounded-lg bg-muted/50 transition-all hover:shadow-md"
            >
              <div className="flex-1 flex items-center">
                <CheckCircle2
                  className={`mr-2 h-3 w-3 sm:h-4 sm:w-4 ${
                    st.status === "Completed"
                      ? "text-green-500"
                      : st.status === "In Progress"
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                />
                <span className="font-medium text-xs sm:text-sm">
                  {st.title}
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Badge
                  variant={getStatusVariant(st.status)}
                  className="text-xs sm:text-sm"
                >
                  {st.status}
                </Badge>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(st)}
                      className="h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View</TooltipContent>
                </Tooltip>
                {!isTaskClosed && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(st)}
                          disabled={isTaskClosed}
                          className="h-7 w-7 sm:h-8 sm:w-8"
                        >
                          <RotateCw className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getToggleTooltip(st.status)}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(st)}
                          disabled={isTaskClosed}
                          className="h-7 w-7 sm:h-8 sm:w-8"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(st)}
                          disabled={isTaskClosed}
                          className="h-7 w-7 sm:h-8 sm:w-8"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <span className="text-xs sm:text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      )}

      {/* View Subtask Modal */}
      {selectedSubtask && (
        <Dialog open={openView} onOpenChange={setOpenView}>
          <DialogContent className="flex flex-col justify-between max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Eye className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                View Subtask
              </DialogTitle>
            </DialogHeader>

            {/* Main Content */}
            <div className="space-y-3 overflow-y-auto">
              <div>
                <span className="font-medium text-xs sm:text-sm">Title:</span>
                <p className="mt-1 text-xs sm:text-sm">
                  {selectedSubtask.title}
                </p>
              </div>
              <div>
                <span className="font-medium text-xs sm:text-sm">
                  Description:
                </span>
                <p className="mt-1 text-xs sm:text-sm">
                  {selectedSubtask.description || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-xs sm:text-sm">
                  Priority:
                </span>
                <p className="mt-1 text-xs sm:text-sm">
                  {selectedSubtask.priority}
                </p>
              </div>
              <div>
                <span className="font-medium text-xs sm:text-sm">
                  Deadline:
                </span>
                <p className="mt-1 text-xs sm:text-sm">
                  {formatDateUTC(selectedSubtask.deadline) || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-xs sm:text-sm">Status:</span>
                <Badge
                  variant={getStatusVariant(selectedSubtask.status)}
                  className="ml-2 text-xs sm:text-sm"
                >
                  {selectedSubtask.status}
                </Badge>
              </div>
            </div>

            {/* Button at the bottom */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() =>
                  router.push(`/task/${taskId}/${selectedSubtask?.subtask_id}`)
                }
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs sm:text-sm"
              >
                View Full Details
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create, Edit, Delete Modals */}
      <CreateSubtaskModal
        open={openAdd}
        setOpen={setOpenAdd}
        taskDetails={task}
        taskId={taskId}
        projectId={projectId}
      />
      {selectedSubtask && (
        <EditSubtaskModal
          open={openEdit}
          setOpen={setOpenEdit}
          subtask={selectedSubtask}
          taskId={taskId}
          isTaskClosed={isTaskClosed}
          projectId={projectId}
        />
      )}
      {selectedSubtask && (
        <DeleteSubtaskModal
          open={openDelete}
          setOpen={setOpenDelete}
          subtask={selectedSubtask}
          taskId={taskId}
          isTaskClosed={isTaskClosed}
        />
      )}
    </section>
  );
};

export default SubTaskList;
