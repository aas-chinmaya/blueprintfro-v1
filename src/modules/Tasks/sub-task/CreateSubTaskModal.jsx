

// 'use client';

// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { Plus } from 'lucide-react';
// import { createSubTask } from '@/features/subTaskSlice';
// import { toast } from 'sonner';
// import { useCurrentUser } from '@/hooks/useCurrentUser';

// const CreateSubtaskModal = ({ projectId,open, setOpen, taskId }) => {
//   const { currentUser } = useCurrentUser();

//     const dispatch = useDispatch();
 

//   // Initial state
//   const initialFormData = {
//     title: '',
//     priority: 'Medium',
//     deadline: '',
//     description: '',
//     assignedTo: currentUser?.id || '',
//     assignedBy: currentUser?.id || '',
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [errors, setErrors] = useState({});

//   const { loading: subTaskLoading, error: subTaskError } = useSelector((state) => state.subTask);

//   // Reset form whenever modal is opened or closed
//   useEffect(() => {
//     if (open) {
//       setFormData(initialFormData);
//       setErrors({});
//     }
//   }, [open]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on change
//   };

//   const handlePriorityChange = (value) => {
//     setFormData((prev) => ({ ...prev, priority: value }));
//     setErrors((prev) => ({ ...prev, priority: '' }));
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.title.trim()) newErrors.title = 'Title is required';
//     if (!formData.priority.trim()) newErrors.priority = 'Priority is required';
//     if (!formData.deadline.trim()) newErrors.deadline = 'Deadline is required';
//     if (!formData.description.trim()) newErrors.description = 'Description is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleAdd = async () => {
//     if (!validate()) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       const subTaskData = {
//         title: formData.title,
//         priority: formData.priority,
//         deadline: formData.deadline,
//         description: formData.description,
//         assignedTo: formData.assignedTo,
//       };

//       await dispatch(createSubTask({ taskId, subTaskData })).unwrap();
//       toast.success('Subtask added successfully');
//       setOpen(false);
//     } catch (err) {
//       toast.error(subTaskError || 'Failed to add subtask');
//     }
//   };

//   // Enable button only if all required fields are filled
//   const isButtonEnabled =
//     formData.title.trim() &&
//     formData.priority.trim() &&
//     formData.deadline.trim() &&
//     formData.description.trim();

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle className="flex items-center">
//             <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
//             Add New Subtask
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           {/* Title */}
//           <div>
//             <label className="font-medium text-xs sm:text-sm">Title*:</label>
//             <Input
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="mt-1 text-xs sm:text-sm"
//               placeholder="Enter subtask title"
//             />
//             {errors.title && <p className="text-red-500 text-xs sm:text-sm">{errors.title}</p>}
//           </div>

//           {/* Priority */}
//           <div>
//             <label className="font-medium text-xs sm:text-sm">Priority*:</label>
//             <Select value={formData.priority} onValueChange={handlePriorityChange}>
//               <SelectTrigger className="mt-1 text-xs sm:text-sm">
//                 <SelectValue placeholder="Select priority" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Low">Low</SelectItem>
//                 <SelectItem value="Medium">Medium</SelectItem>
//                 <SelectItem value="High">High</SelectItem>
//               </SelectContent>
//             </Select>
//             {errors.priority && <p className="text-red-500 text-xs sm:text-sm">{errors.priority}</p>}
//           </div>

//           {/* Deadline */}
//           <div>
//             <label className="font-medium text-xs sm:text-sm">Deadline*:</label>
//             <Input
//               name="deadline"
//               type="date"
//               value={formData.deadline}
//               onChange={handleChange}
//               className="mt-1 text-xs sm:text-sm"
//             />
//             {errors.deadline && <p className="text-red-500 text-xs sm:text-sm">{errors.deadline}</p>}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="font-medium text-xs sm:text-sm">Description*:</label>
//             <Textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               className="mt-1 text-xs sm:text-sm"
//               placeholder="Enter subtask description"
//               rows={4}
//             />
//             {errors.description && <p className="text-red-500 text-xs sm:text-sm">{errors.description}</p>}
//           </div>

//           {/* Assigned To */}
//           <div>
//             <label className="font-medium text-xs sm:text-sm">Assigned To*:</label>
//             <Input
//               name="assignedTo"
//               value={currentUser?.name || formData.assignedTo}
//               className="mt-1 text-xs sm:text-sm"
//               disabled
//             />
//           </div>

//           {/* Assigned By */}
//           <div>
//             <label className="font-medium text-xs sm:text-sm">Assigned By*:</label>
//             <Input
//               name="assignedBy"
//               value={currentUser?.name || formData.assignedBy}
//               className="mt-1 text-xs sm:text-sm"
//               disabled
//             />
//           </div>

//           {subTaskError && <p className="text-red-500 text-xs sm:text-sm">{subTaskError}</p>}

//           {/* Add Button */}
//           <DialogClose asChild>
//             <Button
//               onClick={handleAdd}
//               disabled={!isButtonEnabled}
//               className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm h-8 sm:h-9 disabled:opacity-50"
//             >
//               {subTaskLoading ? 'Adding...' : 'Add Subtask'}
//             </Button>
//           </DialogClose>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreateSubtaskModal;









'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Plus, User, CalendarIcon, X, Loader, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createSubTask } from '@/features/subTaskSlice';
import { fetchTeamByProjectId } from '@/features/teamSlice';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const CreateSubtaskModal = ({ projectId, open, setOpen, taskId }) => {
  const { currentUser } = useCurrentUser();
  const dispatch = useDispatch();
  
  const { teamsByProject: teams, status: teamStatus } = useSelector((state) => state.team);
  const { loading: subTaskLoading, error: subTaskError } = useSelector((state) => state.subTask);

  // Initial state
  const initialFormData = useMemo(() => ({
    title: '',
    priority: 'Medium',
    deadline: '',
    description: '',
    assignedTo: '',
    assignedBy: currentUser?.id || '',
    projectId: projectId || '',
    teamId: '',
    memberId: '',
  }), [currentUser?.id, projectId]);

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
    if (open) {
      setFormData(initialFormData);
      setErrors({});
      setSelectedTeam(null);
      setSelectedDate(null);
      setMemberSearchQuery("");
      setMemberOpen(false);
    }
  }, [open, initialFormData]);

  // Update assignedBy when team changes - use useCallback to prevent infinite loops
  const updateFormDataOnTeamChange = useCallback((team) => {
    if (team) {
      setFormData((prev) => ({
        ...prev,
        assignedBy: currentUser?.name || "Current User",
        projectId: projectId || '',
        teamId: team.teamId || '',
        assignedTo: '', // Reset assignedTo when team changes
      }));
      setMemberSearchQuery(""); // Reset search query
    }
  }, [projectId, currentUser?.name]);

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

  const handleAdd = useCallback(async () => {
    if (!validate()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const subTaskData = {
        title: formData.title,
        priority: formData.priority,
        deadline: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        description: formData.description,
        assignedTo: formData.assignedTo,
        assignedBy: formData.assignedBy,
        teamId: selectedTeam.teamId,
        memberId: formData.memberId,
      };

      await dispatch(createSubTask({ taskId, subTaskData })).unwrap();
      toast.success('Subtask added successfully');
      setOpen(false);
    } catch (err) {
      toast.error(subTaskError || 'Failed to add subtask');
    }
  }, [validate, formData, selectedDate, selectedTeam, dispatch, taskId, subTaskError, setOpen]);

  const isButtonEnabled = useMemo(() => 
    formData.title.trim() &&
    formData.priority.trim() &&
    selectedDate &&
    formData.description.trim() &&
    selectedTeam &&
    formData.assignedTo
  , [formData.title, formData.priority, formData.description, selectedDate, selectedTeam, formData.assignedTo]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-full h-[100vh] max-h-[100vh] sm:max-w-6xl sm:max-h-[85vh] bg-white shadow-lg border border-gray-200 rounded-lg text-black p-2">
        {/* Header - Much smaller */}
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
              <Plus className="mr-2 h-4 w-4 text-blue-500" />
              Add New Subtask
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
          <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} className="space-y-4">
            {/* Full Width Subtask Title Section */}
            <div className="w-full">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Plus className="h-4 w-4 text-blue-500 mr-2" />
                Subtask Title <span className="text-red-500 ml-1">*</span>
              </label>
              <Textarea
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 h-10"
                placeholder="Enter subtask title"
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
                <Plus className="h-4 w-4 text-blue-500 mr-2" />
                Description <span className="text-red-500 ml-1">*</span>
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full h-40 sm:h-48 md:h-52 bg-white border border-gray-300 rounded-lg text-sm resize-vertical focus:ring-2 focus:ring-blue-200 focus:border-blue-500 p-3"
                placeholder="Enter detailed subtask description..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1 flex items-center">
                <X className="h-3 w-3 mr-1" /> {errors.description}
              </p>}
            </div>

            {/* Global Error Display */}
            {subTaskError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm flex items-center">
                  <X className="h-4 w-4 mr-2" /> {subTaskError}
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
                disabled={!isButtonEnabled || subTaskLoading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm px-6 py-2 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subTaskLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Adding Subtask...
                  </>
                ) : (
                  'Assign Subtask'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubtaskModal;