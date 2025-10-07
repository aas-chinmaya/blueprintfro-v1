





"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Filler
} from "chart.js";
import { Pie, Doughnut, Bar, Line } from "react-chartjs-2";
import { 
  Info, Calendar, User, FileText, Paperclip, Briefcase, TrendingUp, 
  Download, DownloadCloud, Edit, Pencil, FileStack 
} from "lucide-react";
import { FiDownload, FiEdit, FiInfo as FiInfoIcon, FiCalendar as FiCalendarIcon, FiUser as FiUserIcon, FiPaperclip as FiPaperclipIcon, FiFileText as FiFileTextIcon } from "react-icons/fi";
import { formatDateUTC } from "@/utils/formatDate";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Register components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Filler
);

// Dummy Data for Charts
const getDummyTaskChartData = () => [
  { name: "Pending", value: 15 },
  { name: "In Progress", value: 5 },
  { name: "Completed", value: 30 },
];

const getDummyBugChartData = () => [
  { name: "Critical", value: 3 },
  { name: "High", value: 2 },
  { name: "Medium", value: 8 },
  { name: "Low", value: 0 },
];

const getDummyTeamChartData = () => [
  { name: "Online", value: 5 },
  { name: "Offline", value: 5 },
  { name: "Inactive", value: 0 },
];

const getDummyMomChartData = () => [
  { name: "Online", value: 4 },
  { name: "Offline", value: 4 },
];

const MIXED_COLORS = [
  "#3b82f6", "#22c55e", "#ef4444", "#eab308", "#f97316"
];

// Skeleton for loading state
function ChartSkeleton() {
  return <Skeleton className="w-full h-[150px] rounded-lg" />;
}

// Chart rendering function
function renderChart(type, data) {
  if (!data || data.every(d => d.value === 0)) {
    return <div className="text-center text-gray-500 text-sm font-medium flex items-center justify-center h-full">No Data</div>;
  }

  const labels = data.map(d => d.name);
  const values = data.map(d => d.value);
  const chartData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: MIXED_COLORS.slice(0, values.length),
      borderColor: MIXED_COLORS.slice(0, values.length).map(c => c + 'cc'),
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 10, family: "'Inter', sans-serif" },
          color: "#1f2937",
          padding: 5,
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 4,
        padding: 4,
      },
    },
  };

  switch (type) {
    case "pie": return <Pie data={chartData} options={options} />;
    case "doughnut": return <Doughnut data={chartData} options={{ ...options, cutout: "50%" }} />;
    case "bar": return <Bar data={chartData} options={options} />;
    case "line": return <Line data={chartData} options={options} />;
    default: return null;
  }
}

// Handle Download with Toast Feedback
const handleDownload = (url, filename, isDownloading, externalHandleDownload) => {
  if (isDownloading) return;
  externalHandleDownload(url, filename);
};

// Project Overview Component (Simplified: Progress Bar + Metrics + Single Details Section with Expandable Description)
export default function ProjectOverview({
  project = {},
  projectId,
  teamLeadId,
  canEditStatus = false,
  canEditProject = false,
  setIsStatusModalOpen,
  statusUpdateMessage,
  handleDownload: externalHandleDownload,
  isDownloading = false,
  projectStatus,
}) {
  const projectData = project || {};
  const overallProgress = Math.floor(Math.random() * 101);

  // Filter attachments
  const imageAttachments = projectData.attachments?.filter(att => 
    att.filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)
  ) || [];
  const otherAttachments = projectData.attachments?.filter(att => 
    !att.filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)
  ) || [];

  return (
    <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50">
      {/* 1. Simple Project Header with Progress Bar Only */}
      <Card className="bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 text-white rounded-xl overflow-hidden shadow-xl border-0">
        <CardHeader className="p-6 pb-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold truncate">{projectData.projectName || "Unnamed Project"}</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 items-center justify-end flex-shrink-0">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                <span className="text-sm opacity-90">Progress</span>
                <Progress
                  value={overallProgress}
                  className="w-20 h-2 flex-shrink-0 sm:w-24"
                  indicatorClassName="bg-white/90"
                />
                <span className="text-sm font-bold">{overallProgress}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 2. Project Metrics - Single Row (4 Cards) */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Project Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50 rounded-xl overflow-hidden shadow-md">
            <CardHeader className="pb-2 bg-blue-200/50">
              <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-1">Tasks</CardTitle>
            </CardHeader>
            <CardContent className="p-4" style={{ height: "180px" }}>
              {renderChart("pie", getDummyTaskChartData())}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200/50 rounded-xl overflow-hidden shadow-md">
            <CardHeader className="pb-2 bg-red-200/50">
              <CardTitle className="text-sm font-medium text-red-900 flex items-center gap-1">Bugs</CardTitle>
            </CardHeader>
            <CardContent className="p-4" style={{ height: "180px" }}>
              {renderChart("doughnut", getDummyBugChartData())}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200/50 rounded-xl overflow-hidden shadow-md">
            <CardHeader className="pb-2 bg-green-200/50">
              <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-1">Team</CardTitle>
            </CardHeader>
            <CardContent className="p-4" style={{ height: "180px" }}>
              {renderChart("bar", getDummyTeamChartData())}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50 rounded-xl overflow-hidden shadow-md">
            <CardHeader className="pb-2 bg-purple-200/50">
              <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-1">MOM</CardTitle>
            </CardHeader>
            <CardContent className="p-4" style={{ height: "180px" }}>
              {renderChart("line", getDummyMomChartData())}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. Single Details Section (Combined Project Details + Timeline + Attachments + Expandable Description) */}
      <section className="space-y-6">
        <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Project Details
              </CardTitle>
              {1 && (
                <Button
                  size="sm"
                  onClick={() => window.location.href = `/project/edit/${projectId}`}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  aria-label="Edit project"
                >
                  <FiEdit className="h-5 w-5 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Combined Details Grid */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Basic Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-3 pl-7">
                    <Briefcase className="h-4 w-4 text-[#38b000]" />
                    <span className="font-semibold text-gray-900 w-28">
                      Project ID:
                    </span>
                    <span>{projectData.projectId}</span>
                  </div>
                  <div className="flex items-center gap-3 pl-7">
                    <FiPaperclipIcon className="h-4 w-4 text-[#38b000]" />
                    <span className="font-semibold text-gray-900 w-28">
                      Category:
                    </span>
                    <span>
                      {projectData.category
                        ? projectData.category
                            .toLowerCase()
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')
                        : "N/A"}
                    </span>
                  </div>
                  {projectData.clientId?.trim() && (
                    <div className="flex items-center gap-3 pl-7">
                      <FiUserIcon className="h-4 w-4 text-[#38b000]" />
                      <span className="font-semibold text-gray-900 w-28">
                        Client ID:
                      </span>
                      <span>{projectData.clientId}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pl-7">
                    <TrendingUp className="h-4 w-4 text-[#38b000]" />
                    <span className="font-semibold text-gray-900 w-28">
                      Status:
                    </span>
                    <TooltipProvider>
                      {canEditStatus ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              onClick={() => setIsStatusModalOpen(true)}
                              className={`inline-flex items-center gap-1 cursor-pointer px-3 py-1 rounded-md text-sm font-medium ${
                                projectStatus === "Completed"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                  : projectStatus === "In Progress"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                  : projectStatus === "Cancelled"
                                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              {projectStatus}
                              <Pencil className="w-4 h-4 opacity-70" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to update project status</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <div
                          className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${
                            projectStatus === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : projectStatus === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : projectStatus === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {projectStatus}
                        </div>
                      )}
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-3 pl-7">
                    <FiUserIcon className="h-4 w-4 text-[#38b000]" />
                    <span className="font-semibold text-gray-900 w-28">
                      Team Lead:
                    </span>
                    <span>{projectData.teamLeadName || "Unassigned"}</span>
                  </div>
                  <div className="flex items-center gap-3 pl-7">
                    <FiCalendarIcon className="h-4 w-4 text-[#38b000]" />
                    <span className="font-semibold text-gray-900 w-30">
                      Onboarding Date:
                    </span>
                    <span>
                      {projectData.createdAt
                        ? formatDateUTC(projectData.createdAt)
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Timeline Grid */}
                {(projectData.startDate ||
                  projectData.endDate ||
                  projectData.expectedEndDate) && (
                  <div className="space-y-4 pb-3">
                    <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 pl-7">
                      <FiCalendarIcon className="h-5 w-5 text-blue-600" />
                      Timeline
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 pl-7">
                      {projectData.startDate && (
                        <div className="flex items-center gap-3">
                          <FiCalendarIcon className="h-4 w-4 text-[#38b000]" />
                          <span className="font-semibold text-gray-900 w-35">
                            Start Date:
                          </span>
                          <span>{formatDateUTC(projectData.startDate)}</span>
                        </div>
                      )}
                      {projectData.endDate && (
                        <div className="flex items-center gap-3">
                          <FiCalendarIcon className="h-4 w-4 text-[#38b000]" />
                          <span className="font-semibold text-gray-900 w-35">
                            End Date:
                          </span>
                          <span>{formatDateUTC(projectData.endDate)}</span>
                        </div>
                      )}
                      {projectData.expectedEndDate && (
                        <div className="flex items-center gap-3">
                          <FiCalendarIcon className="h-4 w-4 text-[#38b000]" />
                          <span className="font-semibold text-gray-900 w-35">
                            Expected End Date:
                          </span>
                          <span>{formatDateUTC(projectData.expectedEndDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {projectData.attachments?.length > 0 && (
                  <div className="space-y-4 pb-3">
                    <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 pl-7">
                      <FiPaperclipIcon className="h-5 w-5 text-blue-600" />
                      Attachments
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                      {projectData.attachments.map((attachment, index) => (
                        <Button
                          key={index}
                          onClick={() => handleDownload(attachment.url, attachment.filename, isDownloading, externalHandleDownload)}
                          disabled={isDownloading}
                          variant="outline"
                          className="flex items-center gap-2 w-full justify-start text-left border-gray-200 hover:bg-blue-50"
                          aria-label={`Download ${attachment.filename}`}
                        >
                          <FiDownload className="h-5 w-5 text-blue-600" />
                          <span className="text-gray-700 truncate">
                            {attachment.filename}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Expandable Description */}
            {projectData.description && (
              <div className="border-t border-gray-200">
                <Accordion type="single" collapsible defaultValue="desc" className="w-full">
                  <AccordionItem value="desc" className="border-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-2 text-left">
                        <FiFileTextIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-lg font-bold text-gray-900">Description</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {projectData.description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}