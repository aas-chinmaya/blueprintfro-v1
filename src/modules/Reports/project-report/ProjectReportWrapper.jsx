"use client";

import { useState, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, Download } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import ProjectReport from './ProjectReport';
import Performance from './Performance';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DashboardWrapper = () => {
  const [viewMode, setViewMode] = useState('Admin'); // Admin (Project Report) or Personal (Performance)
  const [dateRange, setDateRange] = useState('All');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const contentRef = useRef(null);

  const handleDownloadPDF = () => {
    const input = contentRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${viewMode === 'Admin' ? 'project-report' : 'performance-report'}.pdf`);
        setIsPreviewOpen(false);
        toast.success('PDF downloaded successfully!', { duration: 2000 });
      });
    }
  };

  return (
    <div className="p-4  mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Toaster position="top-right" richColors />
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {viewMode === 'Admin' ? 'Project Report' : 'My Performance'}
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">View Mode</Label>
            <Switch
              checked={viewMode === 'Admin'}
              onCheckedChange={(checked) => setViewMode(checked ? 'Admin' : 'Personal')}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className="text-sm">{viewMode === 'Admin' ? 'Admin' : 'Personal'}</span>
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[140px] border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Time</SelectItem>
              <SelectItem value="Last30">Last 30 Days</SelectItem>
              <SelectItem value="Last7">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors">
                <Eye className="mr-2 h-4 w-4" /> Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  {viewMode === 'Admin' ? 'Project Report' : 'Performance Report'} Preview
                </DialogTitle>
              </DialogHeader>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner">
                <div ref={contentRef}>
                  {viewMode === 'Admin' ? (
                    <ProjectReport dateRange={dateRange} isPrintMode={true} />
                  ) : (
                    <Performance dateRange={dateRange} isPrintMode={true} />
                  )}
                </div>
              </div>
              <Button
                onClick={handleDownloadPDF}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white shadow-md transition-colors"
              >
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <motion.div
        key={viewMode}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {viewMode === 'Admin' ? (
          <ProjectReport dateRange={dateRange} isPrintMode={false} ref={contentRef} />
        ) : (
          <Performance dateRange={dateRange} isPrintMode={false} ref={contentRef} />
        )}
      </motion.div>
    </div>
  );
};

export default DashboardWrapper;