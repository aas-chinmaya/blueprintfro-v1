// import { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Edit } from 'lucide-react';

// const EditSubtaskModal = ({projectId, open, setOpen, subtask, subtasks, setSubtasks, isTaskClosed }) => {
//   const [editTitle, setEditTitle] = useState(subtask.title);
//   const [editStatus, setEditStatus] = useState(subtask.status);

//   const handleSaveEdit = () => {
//     if (isTaskClosed) return;
//     setSubtasks(
//       subtasks.map((st) =>
//         st.id === subtask.id ? { ...st, title: editTitle, status: editStatus } : st
//       )
//     );
//     setOpen(false);
//     alert('Subtask edited');
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle className="flex items-center">
//             <Edit className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
//             Edit Subtask
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-3">
//           <div>
//             <span className="font-medium text-xs sm:text-sm">Title:</span>
//             <Input
//               value={editTitle}
//               onChange={(e) => setEditTitle(e.target.value)}
//               className="mt-1 text-xs sm:text-sm"
//               disabled={isTaskClosed}
//             />
//           </div>
//           <div>
//             <span className="font-medium text-xs sm:text-sm">Status:</span>
//             <select
//               className="w-full p-2 border rounded bg-background text-foreground mt-1 text-xs sm:text-sm"
//               value={editStatus}
//               onChange={(e) => setEditStatus(e.target.value)}
//               disabled={isTaskClosed}
//             >
//               <option>Open</option>
//               <option>Closed</option>
//             </select>
//           </div>
//           <DialogClose asChild>
//             <Button
//               onClick={handleSaveEdit}
//               disabled={isTaskClosed}
//               className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm h-8 sm:h-9"
//             >
//               Save Changes
//             </Button>
//           </DialogClose>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditSubtaskModal;














'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Edit, User, Flag, CalendarIcon, Info, X, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { updateSubTask } from '@/features/subTaskSlice';
import { fetchTeamByProjectId } from '@/features/teamSlice';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const EditSubtaskModal = ({ projectId, open, setOpen, subtask, taskId }) => {
  const { currentUser } = useCurrentUser();
  const dispatch = useDispatch();
  
  const { teamsByProject: teams, status: teamStatus } = useSelector((state) => state.team);
  const { loading: subTaskLoading, error: subTaskError } = useSelector((state) => state.subTask);

  // Initial state - removed status
  const initialFormData = useMemo(() => ({
    title: subtask?.title || '',
    priority: subtask?.priority || 'Medium',
    deadline: subtask?.deadline || '',
    description: subtask?.description || '',
    assignedTo: subtask?.assignedTo || '',
    assignedBy: subtask?.assignedBy || currentUser?.id || '',
    projectId: projectId || '',
    teamId: subtask?.teamId || '',
    memberId: subtask?.memberId || '',
  }), [subtask, currentUser?.id, projectId]);

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

  // Reset form when modal opens with new subtask data
  useEffect(() => {
    if (open && subtask) {
      setFormData(initialFormData);
      setErrors({});
      
      // Set selected team from subtask data
      const team = teams.find(t => t.teamId === subtask.teamId);
      setSelectedTeam(team || null);
      
      // Set selected date from subtask data
      setSelectedDate(subtask.deadline ? new Date(subtask.deadline) : null);
      
      // Set member search query to empty to show existing member
      setMemberSearchQuery("");
      setMemberOpen(false);
    }
  }, [open, subtask, initialFormData, teams]);

  // Update form data when team changes
  const updateFormDataOnTeamChange = useCallback((team) => {
    if (team) {
      setFormData((prev) => ({
        ...prev,
        assignedBy: currentUser?.name || "Current User",
        projectId: projectId || '',
        teamId: team.teamId || '',
        // Keep existing assignedTo when team changes
        assignedTo: subtask?.assignedTo || formData.assignedTo || '',
      }));
      setMemberSearchQuery(""); // Reset search query
    }
  }, [projectId, currentUser?.name, subtask?.assignedTo, formData.assignedTo]);

  useEffect(() => {
    if (selectedTeam && !memberSearchQuery) {
      updateFormDataOnTeamChange(selectedTeam);
    }
  }, [selectedTeam, updateFormDataOnTeamChange, memberSearchQuery]);

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

  // Find existing team name for display
  const existingTeam = useMemo(() => {
    if (formData.teamId) {
      return teams.find(team => team.teamId === formData.teamId);
    }
    return null;
  }, [formData.teamId, teams]);

  // Find existing member name for display - Show existing member info by default
  const existingMember = useMemo(() => {
    // First, try to find member from the currently selected team
    if (selectedTeam?.teamMembers && formData.assignedTo && selectedTeam.teamId === formData.teamId) {
      return selectedTeam.teamMembers.find(member => member.memberId === formData.assignedTo);
    }
    
    // If no team selected but we have assignedTo, try to find from any team
    if (formData.assignedTo && !selectedTeam) {
      // Search across all teams to find the member
      for (const team of teams) {
        const member = team.teamMembers?.find(member => member.memberId === formData.assignedTo);
        if (member) {
          return member;
        }
      }
    }
    
    return null;
  }, [selectedTeam?.teamMembers, formData.assignedTo, selectedTeam?.teamId, formData.teamId, teams]);

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
    
    // Keep existing assignedTo when team changes, but validate if member exists in new team
    if (team && formData.assignedTo) {
      const memberExistsInNewTeam = team.teamMembers?.some(member => member.memberId === formData.assignedTo);
      if (!memberExistsInNewTeam) {
        // If member doesn't exist in new team, clear it
        setFormData(prev => ({ ...prev, assignedTo: '', memberId: '' }));
      }
    }
    
    setErrors((prev) => ({ ...prev, team: '' }));
  }, [teams, handleSelectChange, formData.assignedTo]);

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

  const handleSaveEdit = useCallback(async () => {
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

   
      
      await dispatch(updateSubTask({ taskId, subTaskId: subtask.subtask_id, subTaskData }));
      toast.success('Subtask updated successfully');
      setOpen(false);
    } catch (err) {
      toast.error(subTaskError || 'Failed to update subtask');
    }
  }, [validate, formData, selectedDate, selectedTeam, dispatch, taskId, subtask.id, subTaskError, setOpen]);

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
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
              <Edit className="mr-2 h-4 w-4 text-blue-500" />
              Edit Subtask
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
          <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
            {/* Full Width Subtask Title Section - Textarea */}
            <div className="w-full">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Edit className="h-4 w-4 text-blue-500 mr-2" />
                Subtask Title <span className="text-red-500 ml-1">*</span>
              </label>
              <Textarea
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full h-24 sm:h-28 md:h-32 bg-white border border-gray-300 rounded-lg text-sm resize-vertical focus:ring-2 focus:ring-blue-200 focus:border-blue-500 p-3"
                placeholder="Enter subtask title..."
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 flex items-center">
                <X className="h-3 w-3 mr-1" /> {errors.title}
              </p>}
            </div>

            {/* Responsive Grid Layout - 2 columns on md+, 1 column on mobile - REMOVED STATUS */}
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

              {/* Team Selection - Shows existing team by default */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 text-blue-500 mr-2" />
                  Team <span className="text-red-500 ml-1">*</span>
                </label>
                <Select value={selectedTeam?.teamId || formData.teamId || ""} onValueChange={handleTeamSelect}>
                  <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 h-10">
                    <SelectValue placeholder={teamStatus === 'loading' ? 'Loading teams...' : existingTeam ? existingTeam.teamName : 'Select team'} />
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

              {/* Assigned To - Shows existing member by default, read-only until team selected for editing */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 text-blue-500 mr-2" />
                  Assigned To <span className="text-red-500 ml-1">*</span>
                </label>
                <Popover open={memberOpen} onOpenChange={setMemberOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between bg-white border border-gray-300 rounded-lg text-sm h-10",
                        // For editing: show existing member as read-only if no team selected
                        (formData.assignedTo && !selectedTeam) && "hover:bg-gray-50 cursor-default text-gray-700 font-medium",
                        // For initial adding: disable until team selected
                        (!selectedTeam && !formData.assignedTo) && "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400",
                        // Enable when team selected
                        selectedTeam && "hover:bg-gray-100 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                      )}
                      disabled={(!selectedTeam && !formData.assignedTo) || teamStatus === 'loading'}
                    >
                      {teamStatus === 'loading' ? (
                        "Loading..."
                      ) : formData.assignedTo && existingMember ? (
                        // Show existing member (read-only for editing, editable for initial adding after team select)
                        <span className={selectedTeam ? "text-gray-700" : "text-gray-700 font-medium"}>
                          {existingMember.memberName} ({existingMember.memberId})
                        </span>
                      ) : !selectedTeam ? (
                        // For initial adding: show prompt
                        <span className="text-gray-400">Select team first</span>
                      ) : (
                        // Show search prompt when team selected but no member
                        <span className="text-gray-500">Search and select team member</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-white border border-gray-200 rounded-lg shadow-lg p-0 w-[300px] max-h-60">
                    <Command>
                      <CommandInput
                        placeholder="Search team members..."
                        value={memberSearchQuery}
                        onValueChange={setMemberSearchQuery}
                        className="h-10 text-sm p-2"
                        disabled={!selectedTeam}
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
                placeholder="Enter detailed subtask description..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1 flex items-center">
                <X className="h-3 w-3 mr-1" /> {errors.description}
              </p>}
            </div>

          

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
                    Updating Subtask...
                  </>
                ) : (
                  'Update Subtask'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubtaskModal;