










"use client";

import { format } from "date-fns";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchTasksByProjectId,
  deleteTask,
  downloadTasksReport,
  selectTasksByProjectId,
  selectTaskStatus,
  selectEmployeeProjectTasks,
  fetchEmployeeProjectTasks,
} from "@/features/taskSlice";
import { Eye, Edit, Trash2, X, CalendarIcon, Filter, Download, Plus } from "lucide-react";
import { toast } from "sonner";
import Spinner from "@/components/loader/Spinner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatDateUTC } from "@/utils/formatDate";
import CreateTaskModal from "./CreateTaskModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";



const AllTaskListByProjectId = ({ projectId, project }) => {
  const { currentUser, isTeamLead } = useCurrentUser(project?.teamLeadId);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [viewMode, setViewMode] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tempPriorityFilter, setTempPriorityFilter] = useState("all");
  const [tempStatusFilter, setTempStatusFilter] = useState("all");
  const [tempAssignedToFilter, setTempAssignedToFilter] = useState("all");
  const [tempDateFrom, setTempDateFrom] = useState(null);
  const [tempDateTo, setTempDateTo] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedToFilter, setAssignedToFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;



  // Fetch tasks
  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasksByProjectId(projectId));
    }
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, [dispatch, projectId]);

  const employeeId = currentUser?.id;
  const tasksFromStore = useSelector((state) => selectTasksByProjectId(state, projectId));
  const status = useSelector(selectTaskStatus);
   const employeeProjectTasks = useSelector((state) => selectEmployeeProjectTasks(state, projectId, employeeId));

   useEffect(() => {
     if (viewMode === "my" && projectId && employeeId) {
       dispatch(fetchEmployeeProjectTasks({ projectId, employeeId }));
       
     }
   }, [dispatch, viewMode, projectId, employeeId]);










  const tasks = useMemo(() => {
  if (currentUser?.role === "cpc" || (isTeamLead && viewMode === "all")) {
    return tasksFromStore;
  } else if (viewMode === "my") {
    return employeeProjectTasks || [];
  } else {
    return tasksFromStore;
  }
}, [currentUser?.role, isTeamLead, viewMode, tasksFromStore, employeeProjectTasks]);


  const isCpc = currentUser?.role === "cpc";
  const showAllViewOption = isCpc || isTeamLead;
    const showAssignedFilter = showAllViewOption && viewMode === "all";






  const handleViewTask = (task_id) => router.push(`/task/${task_id}`);
  const handleEditTask = (task_id) => router.push(`/task/edit/${task_id}`);
  const handleDeleteTask = async () => {
    try {
      await dispatch(deleteTask(taskIdToDelete)).unwrap();
      toast.success("Task deleted successfully!");
      setCurrentPage(1); // Reset to first page after deletion
    } catch (err) {
      toast.error(err || "Failed to delete task.");
    }
    setShowDeleteModal(false);
    setTaskIdToDelete(null);
  };

  const openDeleteModal = (task_id) => {
    setTaskIdToDelete(task_id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setTaskIdToDelete(null);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1); // Reset to first page on sort
  };

  const assignedMembers = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    return Array.from(new Set(tasks.map((t) => t?.assignedToDetails?.memberName).filter(Boolean)));
  }, [tasks]);

  const assignedMembersMap = useMemo(() => {
    if (!Array.isArray(tasks)) return {};
    return tasks.reduce((map, task) => {
      if (task.assignedToDetails?.memberName && task.assignedTo) {
        map[task.assignedToDetails.memberName] = task.assignedTo;
      }
      return map;
    }, {});
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = Array.isArray(tasks) ? [...tasks] : [];


    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title?.toLowerCase().includes(query) ||
          task.task_id?.toLowerCase().includes(query) ||
          task?.assignedToDetails?.memberName?.toLowerCase().includes(query)
      );
    }

    // Filters
    if (priorityFilter !== "all") filtered = filtered.filter((task) => task.priority === priorityFilter);
    if (statusFilter !== "all") filtered = filtered.filter((task) => task.status === statusFilter);
    
    if (assignedToFilter !== "all") filtered = filtered.filter((task) => task?.assignedToDetails?.memberName === assignedToFilter);
    if (dateFrom || dateTo) {
      filtered = filtered.filter((task) => {
        if (!task.deadline) return false;
        const taskDate = new Date(task.deadline);
        return (!dateFrom || taskDate >= dateFrom) && (!dateTo || taskDate <= dateTo);
      });
    }

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = sortConfig.key.includes(".")
          ? sortConfig.key.split(".").reduce((obj, key) => obj?.[key], a)
          : a[sortConfig.key];
        let bValue = sortConfig.key.includes(".")
          ? sortConfig.key.split(".").reduce((obj, key) => obj?.[key], b)
          : b[sortConfig.key];

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        return aValue < bValue
          ? sortConfig.direction === "asc" ? -1 : 1
          : aValue > bValue
          ? sortConfig.direction === "asc" ? 1 : -1
          : 0;
      });
    }

    return filtered;
  }, [tasks, searchQuery, priorityFilter, statusFilter, assignedToFilter, dateFrom, dateTo, sortConfig]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setStatusFilter("all");
    setAssignedToFilter("all");
    setDateFrom(null);
    setDateTo(null);
    setTempPriorityFilter("all");
    setTempStatusFilter("all");
    setTempAssignedToFilter("all");
    setTempDateFrom(null);
    setTempDateTo(null);
    setSortConfig({ key: "", direction: "asc" });
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setPriorityFilter(tempPriorityFilter);
    setStatusFilter(tempStatusFilter);
    setAssignedToFilter(tempAssignedToFilter);
    setDateFrom(tempDateFrom);
    setDateTo(tempDateTo);
    setShowFilterDialog(false);
    setCurrentPage(1);
  };

  const handleDownloadReport = async () => {
    const filterObj = {
      search: searchQuery || undefined,
      priority: priorityFilter !== "all" ? priorityFilter : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      assignedTo: assignedToFilter !== "all" ? assignedMembersMap[assignedToFilter] : undefined,
      dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
      dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
    };
    const sortKey = sortConfig.key ? `${sortConfig.key}_${sortConfig.direction}` : undefined;
    try {
      await dispatch(downloadTasksReport({ projectId, assignedTo: filterObj.assignedTo, filterObj, sortKey })).unwrap();
      toast.success("Report downloaded successfully!");
    } catch (err) {
      toast.error(err || "Failed to download report.");
    }
  };

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / tasksPerPage));
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate pagination buttons (up to 8 pages)
  const getPaginationButtons = () => {
    const maxButtons = 8;
    const buttons = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(page);
    }

    return buttons;
  };

  if (status === "loading" || showLoader) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-white">
        <Spinner />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white text-black ">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg text-black text-sm sm:text-base"
            />
            {isTeamLead && (
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-full sm:w-40 bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg text-black text-sm sm:text-base">
                  <SelectValue placeholder="View Mode" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border-gray-200 rounded-lg text-black">
                  <SelectItem value="my">My Tasks</SelectItem>
                  <SelectItem value="all">All Tasks</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 sm:w-auto sm:px-4 bg-white text-black border-gray-300 hover:bg-gray-100 rounded-lg"
                  onClick={() => setShowFilterDialog(true)}
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline sm:ml-2">Filter</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white border-none">Open filter options</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 sm:w-auto sm:px-4 bg-white text-black border-gray-300 hover:bg-gray-100 rounded-lg"
                  onClick={handleResetFilters}
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline sm:ml-2">Reset</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white border-none">Reset all filters</TooltipContent>
            </Tooltip>
            {(currentUser?.role === "cpc" || isTeamLead) && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="icon"
                      className="w-10 h-10 sm:w-auto sm:px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                      onClick={handleDownloadReport}
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline sm:ml-2">Download</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black text-white border-none">Download report</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="icon"
                      className="w-10 h-10 sm:w-auto sm:px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                      onClick={() => setShowCreateTaskModal(true)}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline sm:ml-2">Create Task</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black text-white border-none">Create new task</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </div>

        {/* Filter Dialog */}
        <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
          <DialogContent className="sm:max-w-md bg-white shadow-lg border-gray-200 rounded-lg text-black">
            <DialogHeader>
              <DialogTitle>Filter Tasks</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Select value={tempPriorityFilter} onValueChange={setTempPriorityFilter}>
                <SelectTrigger className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg text-black text-sm sm:text-base">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border-gray-200 rounded-lg text-black">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tempStatusFilter} onValueChange={setTempStatusFilter}>
                <SelectTrigger className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg text-black text-sm sm:text-base">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border-gray-200 rounded-lg text-black">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
             {
              showAssignedFilter && (

              <Select value={tempAssignedToFilter} onValueChange={setTempAssignedToFilter}>
                <SelectTrigger className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg text-black text-sm sm:text-base">
                  <SelectValue placeholder="Assigned To" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border-gray-200 rounded-lg text-black">
                  <SelectItem value="all">All Assigned</SelectItem>
                  {assignedMembers.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              )
             }



              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between bg-white border-gray-300 hover:bg-gray-100 rounded-lg text-black text-sm sm:text-base",
                      !tempDateFrom && "text-gray-500"
                    )}
                  >
                    {tempDateFrom ? format(tempDateFrom, "PPP") : <span>From Date</span>}
                    <CalendarIcon className="ml-2 h-4 w-4 text-black" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white shadow-lg border-gray-200 rounded-lg">
                  <Calendar
                    mode="single"
                    selected={tempDateFrom}
                    onSelect={setTempDateFrom}
                    initialFocus
                    className="rounded-lg text-black"
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between bg-white border-gray-300 hover:bg-gray-100 rounded-lg text-black text-sm sm:text-base",
                      !tempDateTo && "text-gray-500"
                    )}
                  >
                    {tempDateTo ? format(tempDateTo, "PPP") : <span>To Date</span>}
                    <CalendarIcon className="ml-2 h-4 w-4 text-black" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white shadow-lg border-gray-200 rounded-lg">
                  <Calendar
                    mode="single"
                    selected={tempDateTo}
                    onSelect={setTempDateTo}
                    initialFocus
                    className="rounded-lg text-black"
                  />
                </PopoverContent>
              </Popover>
              <Button
                onClick={handleApplyFilters}
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm sm:text-base"
              >
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Table Container */}
        <div className="flex-1 overflow-auto rounded-lg border border-gray-200 shadow-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-600 hover:bg-blue-700">
                {[
                  { label: "SL. No", key: "" },
                  { label: "Task ID", key: "task_id" },
                  { label: "Title", key: "title" },
                  { label: "Assigned To", key: "assignedToDetails.memberName" },
                  { label: "Priority", key: "priority" },
                  { label: "Deadline", key: "deadline" },
                  { label: "Status", key: "status" },
                  { label: "Actions", key: "" },
                ].map((col, i) => (
                  <TableHead
                    key={i}
                    className="text-white font-semibold uppercase tracking-wider cursor-pointer px-2 py-2 text-xs sm:text-sm"
                    onClick={() => col.key && handleSort(col.key)}
                  >
                    {col.label}
                    {sortConfig.key === col.key && (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-6 text-xs sm:text-base">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTasks.map((task, index) => (
                  <TableRow key={task._id} className="hover:bg-gray-50">
                    <TableCell className="px-2 py-2 text-xs sm:text-base text-black">{(currentPage - 1) * tasksPerPage + index + 1}</TableCell>
                    <TableCell className="px-2 py-2 text-xs sm:text-base text-black">{task.task_id}</TableCell>
                    <TableCell className="px-2 py-2 text-xs sm:text-base text-black">{task.title}</TableCell>
                    <TableCell className="px-2 py-2 text-xs sm:text-base text-black">
                      {task?.assignedToDetails?.memberName || "N/A"}
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      <span
                        className={cn(
                          "px-2 py-1 inline-flex text-xs font-medium rounded-full",
                          task.priority === "Low" ? "bg-green-100 text-green-800" :
                          task.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                          task.priority === "High" ? "bg-red-100 text-red-800" : "bg-gray-100 text-black"
                        )}
                      >
                        {task.priority || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="px-2 py-2 text-xs sm:text-base text-black">
                      {formatDateUTC(task.deadline) || "N/A"}
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      <span
                        className={cn(
                          "px-2 py-1 inline-flex text-xs font-medium rounded-full",
                          task.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          task.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                          task.status === "Completed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-black"
                        )}
                      >
                        {task.status || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewTask(task.task_id)}
                              className="text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded-full"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-black text-white border-none">View Task</TooltipContent>
                        </Tooltip>
                        {(currentUser?.role === "cpc" || isTeamLead) && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditTask(task.task_id)}
                                  className="text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-black text-white border-none">Edit Task</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteModal(task.task_id)}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-black text-white border-none">Delete Task</TooltipContent>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs sm:text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * tasksPerPage + 1, filteredTasks.length)}-
            {Math.min(currentPage * tasksPerPage, filteredTasks.length)} of {filteredTasks.length} tasks
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white text-black border-gray-300 hover:bg-gray-100 rounded-lg text-xs sm:text-sm"
            >
              Previous
            </Button>
            {getPaginationButtons().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={cn(
                  "w-8 h-8 p-0",
                  currentPage === page
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100",
                  "rounded-lg text-xs sm:text-sm"
                )}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-white text-black border-gray-300 hover:bg-gray-100 rounded-lg text-xs sm:text-sm"
            >
              Next
            </Button>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (currentUser?.role === "cpc" || isTeamLead) && (
          <>
            <div className="fixed inset-0 bg-black/60 z-40" onClick={closeDeleteModal} />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base sm:text-xl font-bold text-black">Confirm Deletion</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeDeleteModal}
                    className="text-black hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
                <p className="text-xs sm:text-base text-black mb-6">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2 sm:gap-4">
                  <Button
                    variant="outline"
                    onClick={closeDeleteModal}
                    className="bg-white text-black border-gray-300 hover:bg-gray-100 rounded-lg text-xs sm:text-base"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteTask}
                    className="bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs sm:text-base"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Create Task Modal */}
        {(currentUser?.role === "cpc" || isTeamLead) && (
          <CreateTaskModal
            projectId={projectId}
            project={project}
            isOpen={showCreateTaskModal}
            onClose={() => setShowCreateTaskModal(false)}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default AllTaskListByProjectId;