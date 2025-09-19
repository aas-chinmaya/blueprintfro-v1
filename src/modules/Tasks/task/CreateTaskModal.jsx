

// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createTask } from "@/features/taskSlice";
// import { fetchTeamByProjectId } from "@/features/teamSlice";
// import { Edit, User, Flag, CalendarIcon, Info, X, Loader } from "lucide-react";
// import { toast } from "sonner";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";

// const CreateTaskModal = ({ projectId, project, onClose, isOpen }) => {
//   const dispatch = useDispatch();
//   const { teamsByProject: teams, status } = useSelector((state) => state.team);
//   const taskStatus = useSelector((state) => state.task?.status);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     assignedTo: "",
//     assignedBy: "",
//     priority: "",
//     deadline: "",
//     projectId: projectId || "",
//     projectName: project?.data?.name || "",
//     teamId: "",
//     memberId: "",
//   });

//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [memberSearchQuery, setMemberSearchQuery] = useState("");
//   const [memberOpen, setMemberOpen] = useState(false);

//   useEffect(() => {
//     if (projectId) {
//       dispatch(fetchTeamByProjectId(projectId));
//     }
//   }, [dispatch, projectId]);

//   useEffect(() => {
//     if (selectedTeam) {
//       setFormData((prev) => ({
//         ...prev,
//         assignedBy: selectedTeam.teamLeadName || "",
//         projectId: selectedTeam.projectId || projectId,
//         projectName: selectedTeam.projectName || project?.data?.name || "",
//         teamId: selectedTeam.teamId || "",
//         assignedTo: "", // Reset assignedTo when team changes
//       }));
//       setMemberSearchQuery(""); // Reset search query
//     }
//   }, [selectedTeam, projectId, project]);

//   const teamOptions = useMemo(() => {
//     return teams.map((team) => ({
//       value: team.teamId,
//       label: team.teamName,
//     }));
//   }, [teams]);

//   const teamMemberOptions = useMemo(() => {
//     if (!selectedTeam?.teamMembers || !Array.isArray(selectedTeam.teamMembers)) {
//       return [];
//     }
//     const query = memberSearchQuery.toLowerCase();
//     return selectedTeam.teamMembers
//       .filter((member) => member.memberName.toLowerCase().includes(query))
//       .map((member) => ({
//         value: member.memberId,
//         label: member.memberName,
//         memberId: member.memberId,
//       }));
//   }, [selectedTeam, memberSearchQuery]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSelectChange = (name, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleMemberSelect = (value) => {
//     const member = teamMemberOptions.find((opt) => opt.value === value);
//     handleSelectChange("assignedTo", value);
//     handleSelectChange("memberId", member?.memberId || "");
//     // toast.success(`Selected ${member?.label || "member"}`);
//     setMemberOpen(false);
//   };

//   const validateForm = () => {
//     const requiredFields = ["title", "assignedTo", "assignedBy", "projectId", "teamId"];
//     const missingFields = requiredFields.filter((field) => !formData[field]);
//     if (missingFields.length > 0) {
//       toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       return;
//     }
//     try {
//       const taskData = {
//         ...formData,
//         projectId: selectedTeam.projectId || projectId,
//         projectName: selectedTeam.projectName || project?.data?.name || "N/A",
//         teamId: selectedTeam.teamId,
//         memberId: formData.assignedTo ,
//         // memberId: formData.assignedTo || selectedTeam.teamLeadId,
//         deadline: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
//       };
//       const result = await dispatch(createTask(taskData)).unwrap();
//       if (result) {
//         toast.success("Task assigned successfully!");
//         onClose();
//       }
//     } catch (err) {
//       toast.error(`Failed to assign task: ${err.message || "Unknown error"}`);
//     }
//   };

//   if (!isOpen) return null;

//   return (
  

//     <Dialog open={isOpen} onOpenChange={onClose}  >
//   <DialogContent className="w-full max-w-full h-[100vh] max-h-[100vh] sm:max-w-4xl sm:max-h-[90vh] md:max-w-7xl bg-white shadow-lg border border-gray-200 rounded-lg text-black p-0">
//     <DialogHeader className="bg-blue-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 sticky top-0 z-10">
//       <div className="flex justify-between items-center">
//         <DialogTitle className="text-lg sm:text-xl font-bold text-gray-800">
//           Assign Task
//         </DialogTitle>
//         <DialogClose asChild>
//           <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 rounded-full">
//             <X className="h-5 w-5" />
//           </Button>
//         </DialogClose>
//       </div>
//     </DialogHeader>

//     <form onSubmit={handleSubmit} className=" grid grid-cols-1 md:grid-cols-[30%_70%] gap-6 p-6 h-[calc(100vh-100px)] overflow-y-auto">
//       {/* Left Column (30%) */}
//       <div className="space-y-6">
//         {/* Task Title */}
//         <div>
//           <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//             <Edit className="h-4 w-4 text-blue-500 mr-2" />
//             Task Title
//           </label>
//           <Textarea
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="Enter task title"
//             className="w-full bg-white border border-gray-300 rounded-lg text-sm sm:text-base resize-y min-h-20 max-h-40 p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
//             required
//           />
//         </div>

//         {/* Priority */}
//         <div>
//           <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//             <Flag className="h-4 w-4 text-blue-500 mr-2" />
//             Priority
//           </label>
//           <Select
//             value={formData.priority}
//             onValueChange={(value) => handleSelectChange("priority", value)}
//           >
//             <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500">
//               <SelectValue placeholder="Select priority" />
//             </SelectTrigger>
//             <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-lg text-black">
//               <SelectItem value="Low">Low</SelectItem>
//               <SelectItem value="Medium">Medium</SelectItem>
//               <SelectItem value="High">High</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Deadline */}
//         <div>
//           <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//             <CalendarIcon className="h-4 w-4 text-blue-500 mr-2" />
//             Deadline
//           </label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 className={`w-full justify-between bg-white border border-gray-300 rounded-lg text-sm sm:text-base hover:bg-gray-100 ${
//                   !selectedDate && "text-gray-500"
//                 }`}
//               >
//                 {selectedDate ? format(selectedDate, "PPP") : "Select date"}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="bg-white border border-gray-200 rounded-lg shadow-lg p-0 w-auto">
//               <Calendar
//                 mode="single"
//                 selected={selectedDate}
//                 onSelect={(date) => {
//                   setSelectedDate(date);
//                   handleSelectChange("deadline", date ? format(date, "yyyy-MM-dd") : "");
//                 }}
//                 initialFocus
//                 className="rounded-lg text-black"
//               />
//             </PopoverContent>
//           </Popover>
//         </div>

//         {/* Team Selection */}
//         <div>
//           <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//             <User className="h-4 w-4 text-blue-500 mr-2" />
//             Team
//           </label>
//           <Select
//             value={selectedTeam?.teamId || ""}
//             onValueChange={(value) => {
//               const team = teams.find((t) => t.teamId === value);
//               setSelectedTeam(team);
//               handleSelectChange("teamId", value);
//             }}
//           >
//             <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-200 focus:border-blue-500">
//               <SelectValue placeholder="Select team" />
//             </SelectTrigger>
//             <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-lg text-black max-h-60 overflow-y-auto">
//               {teamOptions.map((option) => (
//                 <SelectItem key={option.value} value={option.value}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Assigned To */}
//         <div className="w-full">
//           <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//             <User className="h-4 w-4 text-blue-500 mr-2" />
//             Assigned To
//           </label>
//           <Popover open={memberOpen} onOpenChange={setMemberOpen}>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 className="w-full justify-between bg-white border border-gray-300 rounded-lg text-sm sm:text-base hover:bg-gray-100"
//                 disabled={!selectedTeam}
//                 onClick={() => setMemberOpen(true)}
//               >
//                 {formData.assignedTo
//                   ? teamMemberOptions.find((opt) => opt.value === formData.assignedTo)?.label
//                   : "Search and select team member"}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="bg-white border border-gray-200 rounded-lg shadow-lg p-0 w-full max-h-60 overflow-y-auto">
//               <Command>
//                 <CommandInput
//                   placeholder="Search team members..."
//                   value={memberSearchQuery}
//                   onValueChange={setMemberSearchQuery}
//                   className="h-10 text-sm p-2"
//                 />
//                 <CommandEmpty>No members found.</CommandEmpty>
//                 <CommandGroup>
//                   {teamMemberOptions.map((option) => (
//                     <CommandItem
//                       key={option.value}
//                       value={option.value}
//                       onSelect={() => handleMemberSelect(option.value)}
//                       className={`cursor-pointer text-sm ${
//                         formData.assignedTo === option.value ? "bg-blue-100 text-blue-800" : ""
//                       }`}
//                     >
//                       {option.label}
//                     </CommandItem>
//                   ))}
//                 </CommandGroup>
//               </Command>
//             </PopoverContent>
//           </Popover>
//         </div>
//       </div>

//       {/* Right Column (70%) */}
//       <div className="flex flex-col h-full">
//         <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//           <Info className="h-4 w-4 text-blue-500 mr-2" />
//           Description
//         </label>
//         <Textarea
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           placeholder="Task description"
//           className="flex-1 bg-white border border-gray-300 rounded-lg text-sm sm:text-base resize-y min-h-40 max-h-[80vh] p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
//         />
//       </div>

//       {/* Form Actions spanning full width */}
//       <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={onClose}
//           className="bg-white text-black border border-gray-300 hover:bg-gray-100 rounded-lg text-sm sm:text-base"
//         >
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           disabled={taskStatus === "loading"}
//           className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm sm:text-base flex items-center"
//         >
//           {taskStatus === "loading" ? (
//             <>
//               <Loader className="h-4 w-4 animate-spin mr-2" />
//               Assigning...
//             </>
//           ) : (
//             "Assign Task"
//           )}
//         </Button>
//       </div>
//     </form>
//   </DialogContent>
// </Dialog>

//   );
// };

// export default CreateTaskModal;







"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "@/features/taskSlice";
import { fetchTeamByProjectId } from "@/features/teamSlice";
import { Edit, User, Flag, CalendarIcon, Info, X, Loader } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CreateTaskModal = ({ projectId, project, onClose, isOpen }) => {
  const dispatch = useDispatch();
  const { teamsByProject: teams, status: teamStatus } = useSelector((state) => state.team);
  const { status: taskStatus, error: taskError } = useSelector((state) => state.task);

  // Initial state
  const initialFormData = useMemo(() => ({
    title: "",
    description: "",
    assignedTo: "",
    assignedBy: "",
    priority: "Medium",
    deadline: "",
    projectId: projectId || "",
    projectName: project?.data?.name || "",
    teamId: "",
    memberId: "",
  }), [projectId, project?.data?.name]);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberOpen, setMemberOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch teams only once when component mounts and projectId is available
  useEffect(() => {
    if (projectId && !isInitialized) {
      dispatch(fetchTeamByProjectId(projectId));
      setIsInitialized(true);
    }
  }, [dispatch, projectId, isInitialized]);

  // Reset form only when modal opens (not on every render)
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
      setSelectedTeam(null);
      setSelectedDate(null);
      setMemberSearchQuery("");
      setMemberOpen(false);
    }
  }, [isOpen, initialFormData]);

  // Update form data when team changes - use useCallback to prevent infinite loops
  const updateFormDataOnTeamChange = useCallback((team) => {
    if (team) {
      setFormData((prev) => ({
        ...prev,
        assignedBy: team.teamLeadName || "Current User",
        projectId: projectId || '',
        projectName: project?.data?.name || team.projectName || '',
        teamId: team.teamId || '',
        assignedTo: '', // Reset assignedTo when team changes
      }));
      setMemberSearchQuery(""); // Reset search query
    }
  }, [projectId, project?.data?.name]);

  useEffect(() => {
    if (selectedTeam) {
      updateFormDataOnTeamChange(selectedTeam);
    }
  }, [selectedTeam, updateFormDataOnTeamChange]);

  const teamOptions = useMemo(() => {
    return teams.map((team) => ({
      value: team.teamId,
      label: team.teamName,
    }));
  }, [teams]);

  const teamMemberOptions = useMemo(() => {
    if (!selectedTeam?.teamMembers || !Array.isArray(selectedTeam.teamMembers)) {
      return [];
    }
    const query = memberSearchQuery.toLowerCase();
    return selectedTeam.teamMembers
      .filter((member) => member.memberName.toLowerCase().includes(query))
      .map((member) => ({
        value: member.memberId,
        label: member.memberName,
        memberId: member.memberId,
      }));
  }, [selectedTeam, memberSearchQuery]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handlePriorityChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, priority: value }));
    setErrors((prev) => ({ ...prev, priority: '' }));
  }, []);

  const handleMemberSelect = useCallback((value) => {
    const member = teamMemberOptions.find((opt) => opt.value === value);
    handleSelectChange("assignedTo", value);
    handleSelectChange("memberId", member?.memberId || "");
    setMemberOpen(false);
  }, [teamMemberOptions, handleSelectChange]);

  const handleTeamSelect = useCallback((value) => {
    const team = teams.find((t) => t.teamId === value);
    setSelectedTeam(team);
    handleSelectChange("teamId", value);
    setErrors((prev) => ({ ...prev, team: '' }));
  }, [teams, handleSelectChange]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.priority.trim()) newErrors.priority = 'Priority is required';
    if (!selectedDate) newErrors.deadline = 'Deadline is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!selectedTeam) newErrors.team = 'Team selection is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Assigned To is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.title, formData.priority, formData.description, selectedDate, selectedTeam, formData.assignedTo]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const taskData = {
        ...formData,
        projectId: selectedTeam.projectId || projectId,
        projectName: selectedTeam.projectName || project?.data?.name || "N/A",
        teamId: selectedTeam.teamId,
        memberId: formData.memberId,
        deadline: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      };

      await dispatch(createTask(taskData)).unwrap();
      toast.success("Task assigned successfully!");
      onClose();
    } catch (err) {
      toast.error(taskError || 'Failed to assign task');
    }
  }, [validate, formData, selectedDate, selectedTeam, dispatch, projectId, project?.data?.name, taskError, onClose]);

  const isButtonEnabled = useMemo(() => 
    formData.title.trim() &&
    formData.priority.trim() &&
    selectedDate &&
    formData.description.trim() &&
    selectedTeam &&
    formData.assignedTo
  , [formData.title, formData.priority, formData.description, selectedDate, selectedTeam, formData.assignedTo]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-full h-[100vh] max-h-[100vh] sm:max-w-6xl sm:max-h-[85vh] bg-white shadow-lg border border-gray-200 rounded-lg text-black p-2">
        {/* Header - Much smaller */}
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
              <Edit className="mr-2 h-4 w-4 text-blue-500" />
              Assign New Task
            </DialogTitle>
            <DialogClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-500 hover:bg-gray-100 rounded-full h-7 w-7"
                onClick={handleClose}
              >
                <X className="h-3 w-3" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-60px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Width Task Title Section */}
            <div className="w-full">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Edit className="h-4 w-4 text-blue-500 mr-2" />
                Task Title <span className="text-red-500 ml-1">*</span>
              </label>
              <Textarea
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full h-24 sm:h-28 md:h-32 bg-white border border-gray-300 rounded-lg text-sm resize-vertical focus:ring-2 focus:ring-blue-200 focus:border-blue-500 p-3"
                placeholder="Enter task title..."
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 flex items-center">
                <X className="h-3 w-3 mr-1" /> {errors.title}
              </p>}
            </div>

            {/* Responsive Grid Layout - 2 columns on md+, 1 column on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Flag className="h-4 w-4 text-blue-500 mr-2" />
                  Priority <span className="text-red-500 ml-1">*</span>
                </label>
                <Select value={formData.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 h-10">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-lg text-black max-h-48">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && <p className="text-red-500 text-xs mt-1 flex items-center">
                  <X className="h-3 w-3 mr-1" /> {errors.priority}
                </p>}
              </div>

              {/* Deadline */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="h-4 w-4 text-blue-500 mr-2" />
                  Deadline <span className="text-red-500 ml-1">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 h-10",
                        !selectedDate && "text-gray-500"
                      )}
                    >
                      {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-white border border-gray-200 rounded-lg shadow-lg p-0 w-auto">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        handleSelectChange("deadline", date ? format(date, "yyyy-MM-dd") : "");
                        setErrors((prev) => ({ ...prev, deadline: '' }));
                      }}
                      initialFocus
                      className="rounded-lg text-black"
                    />
                  </PopoverContent>
                </Popover>
                {errors.deadline && <p className="text-red-500 text-xs mt-1 flex items-center">
                  <X className="h-3 w-3 mr-1" /> {errors.deadline}
                </p>}
              </div>

              {/* Team Selection */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 text-blue-500 mr-2" />
                  Team <span className="text-red-500 ml-1">*</span>
                </label>
                <Select value={selectedTeam?.teamId || ""} onValueChange={handleTeamSelect}>
                  <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 h-10">
                    <SelectValue placeholder={teamStatus === 'loading' ? 'Loading teams...' : 'Select team'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-lg text-black max-h-48">
                    {teamOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.team && <p className="text-red-500 text-xs mt-1 flex items-center">
                  <X className="h-3 w-3 mr-1" /> {errors.team}
                </p>}
              </div>

              {/* Assigned To */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 text-blue-500 mr-2" />
                  Assigned To <span className="text-red-500 ml-1">*</span>
                </label>
                <Popover open={memberOpen} onOpenChange={setMemberOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 h-10"
                      disabled={!selectedTeam || teamStatus === 'loading'}
                    >
                      {formData.assignedTo
                        ? teamMemberOptions.find((opt) => opt.value === formData.assignedTo)?.label
                        : !selectedTeam ? "Select team first" : "Search and select team member"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-white border border-gray-200 rounded-lg shadow-lg p-0 w-[300px] max-h-60">
                    <Command>
                      <CommandInput
                        placeholder="Search team members..."
                        value={memberSearchQuery}
                        onValueChange={setMemberSearchQuery}
                        className="h-10 text-sm p-2"
                      />
                      <CommandEmpty>No members found.</CommandEmpty>
                      <CommandGroup className="max-h-48 overflow-y-auto">
                        {teamMemberOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => handleMemberSelect(option.value)}
                            className={`cursor-pointer text-sm ${
                              formData.assignedTo === option.value ? "bg-blue-100 text-blue-800" : ""
                            }`}
                          >
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.assignedTo && <p className="text-red-500 text-xs mt-1 flex items-center">
                  <X className="h-3 w-3 mr-1" /> {errors.assignedTo}
                </p>}
              </div>
            </div>

            {/* Full Width Description Section */}
            <div className="w-full">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Info className="h-4 w-4 text-blue-500 mr-2" />
                Description <span className="text-red-500 ml-1">*</span>
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-40 sm:h-48 md:h-52 bg-white border border-gray-300 rounded-lg text-sm resize-vertical focus:ring-2 focus:ring-blue-200 focus:border-blue-500 p-3"
                placeholder="Enter detailed task description..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1 flex items-center">
                <X className="h-3 w-3 mr-1" /> {errors.description}
              </p>}
            </div>

            {/* Global Error Display */}
            {taskError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm flex items-center">
                  <X className="h-4 w-4 mr-2" /> {taskError}
                </p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="w-full sm:w-auto bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm px-4 py-2 h-10"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={!isButtonEnabled || taskStatus === "loading"}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm px-6 py-2 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {taskStatus === "loading" ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Assigning Task...
                  </>
                ) : (
                  'Assign Task'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;