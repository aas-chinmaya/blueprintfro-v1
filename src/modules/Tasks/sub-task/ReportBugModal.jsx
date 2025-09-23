

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Bug, X, Loader, Flag, CalendarIcon, Clock, Info } from 'lucide-react';
import { createBug } from '@/features/bugSlice';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const ReportBugModal = ({ 
  onClose, 
  task_id, 
  subtask_id, 
  isOpen = true 
}) => {
  const dispatch = useDispatch();
  const isTaskClosed = false;
  const [bugTitle, setBugTitle] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setBugTitle('');
    setBugDescription('');
    setPriority('Medium');
    setDeadline('');
    setSelectedDate(null);
    setSelectedTime('');
    setError(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bugTitle.trim()) newErrors.title = 'Bug title is required.';
    if (!bugDescription.trim()) newErrors.description = 'Bug description is required.';
    if (!priority) newErrors.priority = 'Please select a priority.';
    if (!selectedDate) newErrors.deadline = 'Please select a date.';
    // Removed time validation - time is now optional
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReportBug = async () => {
    if (isTaskClosed) {
      toast.error('Cannot report bugs for closed tasks.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // Combine date and time into ISO string - time is optional
    function pad(n) {
  return n < 10 ? "0" + n : n;
}

let combinedDateTime;

if (selectedDate) {
  // Ensure selectedDate is a Date object
  const dateObj = new Date(selectedDate);

  // Get hours and minutes from selectedTime, or default to end of day
  const [hours, minutes] = selectedTime
    ? selectedTime.split(":").map(Number)
    : [23, 59];

  dateObj.setHours(hours, minutes, 0, 0);

  // Manually format as YYYY-MM-DDTHH:mm:ss
  combinedDateTime =
    dateObj.getFullYear() +
    "-" +
    pad(dateObj.getMonth() + 1) +
    "-" +
    pad(dateObj.getDate()) +
    "T" +
    pad(dateObj.getHours()) +
    ":" +
    pad(dateObj.getMinutes()) +
    ":" +
    pad(dateObj.getSeconds());

 
 
}


    const bugData = {
      title: bugTitle.trim(),
      description: bugDescription.trim(),
      priority,
      deadline: combinedDateTime,
      task_id: task_id || null,
      ...(subtask_id && { subtask_id })
    };

    try {
      const result = await dispatch(createBug(bugData)).unwrap();
      toast.success('Bug reported successfully!');
      resetForm();
      onClose();
    } catch (err) {
      const errorMessage = err?.message || err || 'Failed to create bug. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid for button enable/disable - time is now optional
  const isFormValid = bugTitle.trim() && bugDescription.trim() && priority && selectedDate;
  const isDisabled = isTaskClosed || isSubmitting || !isFormValid;

  // Format display date - handle time optional
  const displayDateTime = selectedDate 
    ? format(selectedDate, "MMM dd, yyyy") + (selectedTime ? ` at ${selectedTime}` : ' (End of Day)')
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => {
      if (!openState) {
        handleClose();
      }
    }}>
      <DialogContent className="w-full max-w-full h-[100vh] max-h-[100vh] sm:max-w-6xl sm:max-h-[85vh] bg-white shadow-lg border border-gray-200 rounded-lg text-black p-2">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200 sticky top-0 z-10 h-16 flex items-center">
          <div className="flex justify-between items-center w-full">
            <DialogTitle className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
              <Bug className="mr-2 h-4 w-4 text-blue-500" />
              Report Bug
            </DialogTitle>
            <DialogClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-500 hover:bg-gray-100 rounded-full h-8 w-8"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-4 sm:px-6 overflow-y-auto max-h-[calc(85vh-64px)]">
          <form onSubmit={(e) => { e.preventDefault(); handleReportBug(); }} className="space-y-4">
            {/* Full Width Bug Title Section */}
            <div className="w-full">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Bug className="h-4 w-4 text-blue-500 mr-2" />
                 Title <span className="text-red-500 ml-1">*</span>
              </label>
              <Textarea
                value={bugTitle}
                onChange={(e) => {
                  setBugTitle(e.target.value);
                  setErrors(prev => ({ ...prev, title: '' }));
                }}
                className="w-full  bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 p-3"
                disabled={isTaskClosed || isSubmitting}
                placeholder="Enter bug title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 flex items-center">
                <X className="h-3 w-3 mr-1" /> {errors.title}
              </p>}
            </div>

            {/* Responsive Grid Layout - 3 columns on lg+, 2 columns on md, 1 column on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Priority */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Flag className="h-4 w-4 text-blue-500 mr-2" />
                  Priority <span className="text-red-500 ml-1">*</span>
                </label>
                <Select 
                  value={priority} 
                  onValueChange={(value) => {
                    setPriority(value);
                    setErrors(prev => ({ ...prev, priority: '' }));
                  }} 
                  disabled={isTaskClosed || isSubmitting}
                >
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

              {/* Date */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="h-4 w-4 text-blue-500 mr-2" />
                  Date <span className="text-red-500 ml-1">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 h-10",
                        !selectedDate && "text-gray-500"
                      )}
                      disabled={isTaskClosed || isSubmitting}
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
                        setErrors(prev => ({ ...prev, deadline: '' }));
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

              {/* Time - Now Optional */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 text-blue-500 mr-2" />
                  Time
                </label>
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => {
                    setSelectedTime(e.target.value);
                    // Clear any time-related errors when user starts typing
                    if (e.target.value) {
                      setErrors(prev => ({ ...prev, time: '' }));
                    }
                  }}
                  className="cursor-pointer w-full bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 h-10"
                  disabled={isTaskClosed || isSubmitting}
                  placeholder="Select time (optional)"
                />
             
              </div>
            </div>

       

            {/* Full Width Description Section */}
            <div className="w-full">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Info className="h-4 w-4 text-blue-500 mr-2" />
                Description <span className="text-red-500 ml-1">*</span>
              </label>
              <Textarea
                value={bugDescription}
                onChange={(e) => {
                  setBugDescription(e.target.value);
                  setErrors(prev => ({ ...prev, description: '' }));
                }}
                className="w-full h-[50vh] bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 p-3 "
                disabled={isTaskClosed || isSubmitting}
                placeholder="Describe the issue you're experiencing..."
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
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm px-4 py-2 h-10"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isDisabled}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm px-6 py-2 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Reporting Bug...
                  </>
                ) : (
                  "Report Bug"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportBugModal;