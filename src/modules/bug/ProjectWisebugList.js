
"use client";

import { format } from "date-fns";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchBugByProjectId,
  downloadBugsByProjectId,
  downloadBugsByMemberId,
  selectEmployeeProjectBugs,
  fetchEmployeeProjectBugs,
  clearProjectBugs,
} from "@/features/bugSlice";
import { getTeamMembersByProjectId } from "@/features/teamSlice";
import { Eye, X, CalendarIcon, Filter, Download, Plus, Bug, Edit } from "lucide-react";
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
import { formatDateTimeIST } from "@/utils/formatDate";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import BugDetailsViewModal from "./BugDetailsViewModal";
import BugEditModal from "./BugEditModal";

const ProjectWiseBugList = ({ projectId, project, teamLeadId }) => {
 
  
  const { currentUser, isTeamLead } = useCurrentUser(teamLeadId);
  const dispatch = useDispatch();
  const router = useRouter();
  
  // State management
  const [showLoader, setShowLoader] = useState(true);

  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);
 
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
  const bugsPerPage = 10;


const [showEditModal, setShowEditModal] = useState(false);
const [selectedBugForEdit, setSelectedBugForEdit] = useState(null);
const handleEditBug = (bug) => {
  setSelectedBugForEdit(bug);
  setShowEditModal(true);
};

  // Redux selectors
  const bugsByProjectId = useSelector((state) => state.bugs.bugsByProjectId);
  const bugsByEmployeeId = useSelector((state) => state.bugs.bugsByEmployeeId);
  const loading = useSelector((state) => state.bugs.loading);
  const error = useSelector((state) => state.bugs.error);
  const teamMembersByProjectId = useSelector((state) => state.team.teamMembersByProjectId);
  const teamStatus = useSelector((state) => state.team.status);

  const employeeId = currentUser?.id;
  const employeeProjectBugs = useSelector((state) => {
    try {
      return selectEmployeeProjectBugs(state, projectId, employeeId);
    } catch (error) {
      // console.warn('Selector error (fallback to empty array):', error);
      return [];
    }
  });

  // Fetch bugs and team members
  useEffect(() => {
    if (projectId ) {
      dispatch(fetchBugByProjectId(projectId));
      dispatch(getTeamMembersByProjectId(projectId));
    }
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => {
      clearTimeout(timer);
      // dispatch(clearProjectBugs());
    };
  }, [dispatch,viewMode, projectId]);

  // Fetch employee project bugs for "my" view
  useEffect(() => {
    if (viewMode === "my" && projectId && employeeId) {
      dispatch(fetchEmployeeProjectBugs({ projectId, employeeId }));
    }
  }, [dispatch, viewMode, projectId, employeeId]);

  // Choose bugs based on role and view mode
  const isCpc = currentUser?.role === "cpc";
  const showAllViewOption = isCpc || isTeamLead;
  const showCreateButton = isCpc || isTeamLead;
  const showAssignedFilter = showAllViewOption && viewMode === "all";
  
  useEffect(() => {
    if (!showAllViewOption) {
      setViewMode("my");
    }
  }, [showAllViewOption]);


const bugs = useMemo(() => {
  if (isCpc || (isTeamLead && viewMode === "all")) {
    return bugsByProjectId || [];
  } else if (viewMode === "my") {
    return employeeProjectBugs || [];
  } else {
    return bugsByProjectId || [];
  }
}, [isCpc, isTeamLead, viewMode, bugsByProjectId, employeeProjectBugs]);


  // Handlers
  const handleViewBug = (bug) => {
    setSelectedBug(bug);
    setShowViewModal(true);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  // Memoized computed values
  const assignedMembers = useMemo(() => {
    if (!Array.isArray(bugs)) return [];
    return Array.from(new Set(bugs.map((b) => b?.assignedToDetails?.memberName).filter(Boolean)));
  }, [bugs]);

  const assignedMembersMap = useMemo(() => {
    if (!Array.isArray(bugs)) return {};
    return bugs.reduce((map, bug) => {
      if (bug.assignedToDetails?.memberName && bug.assignedTo) {
        map[bug.assignedToDetails.memberName] = bug.assignedTo;
      }
      return map;
    }, {});
  }, [bugs]);

  // Filtered and sorted bugs
  const filteredBugs = useMemo(() => {
    let filtered = Array.isArray(bugs) ? [...bugs] : [];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (bug) =>
          bug.title?.toLowerCase().includes(query) ||
          bug.bug_id?.toLowerCase().includes(query) ||
          bug?.assignedToDetails?.memberName?.toLowerCase().includes(query)
      );
    }

    // Filters
    if (priorityFilter !== "all") filtered = filtered.filter((bug) => bug.priority === priorityFilter);
    if (statusFilter !== "all") filtered = filtered.filter((bug) => bug.status === statusFilter);
    
        if (assignedToFilter !== "all") filtered = filtered.filter((bug) => bug?.assignedToDetails?.memberName === assignedToFilter);

    
    if (dateFrom || dateTo) {
      filtered = filtered.filter((bug) => {
        if (!bug.createdAt) return false;
        const bugDate = new Date(bug.createdAt);
        return (!dateFrom || bugDate >= dateFrom) && (!dateTo || bugDate <= dateTo);
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
  }, [bugs, searchQuery, priorityFilter, statusFilter, assignedToFilter, dateFrom, dateTo, sortConfig]);

  // Filter handlers
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
    if (showAssignedFilter) {
      setAssignedToFilter(tempAssignedToFilter);
    }
    setDateFrom(tempDateFrom);
    setDateTo(tempDateTo);
    setShowFilterDialog(false);
    setCurrentPage(1);
  };

  // Download handler
  const handleDownloadReport = async () => {
    const filterObj = {
      search: searchQuery || undefined,
      priority: priorityFilter !== "all" ? priorityFilter : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      assignedTo: assignedToFilter !== "all" ? assignedMembersMap[assignedToFilter] : undefined,
      dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
      dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
    };
    
    try {
      if (assignedToFilter !== "all" && assignedMembersMap[assignedToFilter]) {
        await dispatch(downloadBugsByMemberId({ 
          projectId, 
          memberId: assignedMembersMap[assignedToFilter] 
        })).unwrap();
      } else {
        await dispatch(downloadBugsByProjectId(projectId)).unwrap();
      }
      toast.success("Bug report downloaded successfully!");
    } catch (err) {
      toast.error(err || "Failed to download report.");
    }
  };

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredBugs.length / bugsPerPage));
  const paginatedBugs = filteredBugs.slice(
    (currentPage - 1) * bugsPerPage,
    currentPage * bugsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  // Loading state
  if (loading.bugsByProjectId || teamStatus === 'loading' || showLoader) {
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
              placeholder="Search bugs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg text-black text-sm sm:text-base"
            />
            {showAllViewOption && (
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-full sm:w-40 bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg text-black text-sm sm:text-base">
                  <SelectValue placeholder="View Mode" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg border-gray-200 rounded-lg text-black">
                  <SelectItem value="my">My Bugs</SelectItem>
                  <SelectItem value="all">All Bugs</SelectItem>
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
            {showAllViewOption && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    className="w-10 h-10 sm:w-auto sm:px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                    onClick={handleDownloadReport}
                    disabled={loading.bugDownload || loading.memberBugDownload}
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline sm:ml-2">Download</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-none">Download report</TooltipContent>
              </Tooltip>
            )}

          
          
          </div>
        </div>

        {/* Filter Dialog */}
        <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
          <DialogContent className="sm:max-w-md bg-white shadow-lg border-gray-200 rounded-lg text-black">
            <DialogHeader>
              <DialogTitle>Filter Bugs</DialogTitle>
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
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              {showAssignedFilter && (
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
              )}
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
                  { label: "Bug ID", key: "bug_id" },
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
                    {sortConfig.key === col.key && (sortConfig.direction === "asc" ? " " : " ")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBugs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-6 text-xs sm:text-base">
                    No bugs found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBugs.map((bug, index) => (
                  <TableRow key={bug._id} className="hover:bg-gray-50">
                    <TableCell className="px-2 py-2 text-xs sm:text-base text-black">
                      {(currentPage - 1) * bugsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="px-2 py-2 text-xs sm:text-base text-black">{bug.bug_id}</TableCell>
                    <TableCell className="px-2 py-2 text-xs sm:text-base text-black">{bug.title}</TableCell>
                    
                    <TableCell className="px-2 py-2 text-xs sm:text-base text-black">
                  


                     {bug?.assignedToDetails?.memberName || "N/A"}
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      <span
                        className={cn(
                          "px-2 py-1 inline-flex text-xs font-medium rounded-full",
                          bug.priority === "Low" ? "bg-green-100 text-green-800" :
                          bug.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                          bug.priority === "High" ? "bg-red-100 text-red-800" : "bg-gray-100 text-black"
                        )}
                      >
                        {bug.priority || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="px-2 py-2 text-xs sm:text-base text-black">
                      {formatDateTimeIST(bug.deadline) || "N/A"}
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      <span
                        className={cn(
                          "px-2 py-1 inline-flex text-xs font-medium rounded-full",
                          bug.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          bug.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                          bug.status === "Resolved" ? "bg-purple-100 text-purple-800" :
                          bug.status === "Completed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-black"
                        )}
                      >
                        {bug.status || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewBug(bug)}
                              className="text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded-full"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-black text-white border-none">View Bug</TooltipContent>
                        </Tooltip>
                       
                         {(currentUser?.role === "cpc"|| currentUser?.position === "Team Lead"|| isTeamLead ) && (
                         <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditBug(bug)}
                              className="text-blue-600 hover:text-blue-800 hover:bg-gray-100 rounded-full"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-black text-white border-none">View Bug</TooltipContent>
                        </Tooltip>
                         )
                        }
                       
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
            Showing {Math.min((currentPage - 1) * bugsPerPage + 1, filteredBugs.length)}-
            {Math.min(currentPage * bugsPerPage, filteredBugs.length)} of {filteredBugs.length} bugs
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

    
<BugDetailsViewModal
  isOpen={showViewModal}
  onOpenChange={setShowViewModal}
  bug={selectedBug}
/>
    <BugEditModal
  isOpen={showEditModal}
  onOpenChange={setShowEditModal}
  bug={selectedBugForEdit}
  
/>


 

      </div>
    </TooltipProvider>
  );
};

export default ProjectWiseBugList;