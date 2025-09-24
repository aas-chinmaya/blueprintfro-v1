









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

import { Pie, Doughnut, Bar, Line, Radar } from "react-chartjs-2";

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

// Dummy Data (total length by status/type, with some zero values)
const projectTitle = "Project Alpha";
const projectStatus = "In Progress";
const projectDeadline = "September 30, 2025";
const projectScore = 75; // Progress score (0-100)

const taskChartData = [
  { name: "Pending", value: 15 },
  { name: "In Progress", value: 5 },
  { name: "Completed", value: 30 },
]; // Total: 50 tasks

const bugChartData = [
  { name: "Critical", value: 3 },
  { name: "High", value: 2 },
  { name: "Medium", value: 8 },
  { name: "Low", value: 0 }, // Zero for testing
]; // Total: 13 bugs, by priority

const teamChartData = [
  { name: "Online", value: 5 },
  { name: "Offline", value: 5 },
  { name: "Inactive", value: 0 }, // Zero for testing
]; // Total: 10 members

const documentChartData = [
  { name: "Excel", value: 4 },
  { name: "Word", value: 6 },
  { name: "PDF", value: 5 },
]; // Total: 15 documents, by type

const momChartData = [
  { name: "Online", value: 4 },
  { name: "Offline", value: 4 },
]; // Total: 8 meetings

const risksChartData = [
  { category: "Technical", value: 4 },
  { category: "Financial", value: 2 },
  { category: "Operational", value: 3 },
  { category: "External", value: 1 },
]; // Total: 10 risks

// Mixed professional color palette (5 colors, mixed across sections)
const MIXED_COLORS = [
  "#3b82f6", // Blue
  "#22c55e", // Green
  "#ef4444", // Red
  "#eab308", // Yellow
  "#f97316", // Orange
];

// Skeleton for loading state
function ChartSkeleton() {
  return <Skeleton className="w-full h-[200px] rounded-lg" />;
}

// Chart rendering function
function renderChart(type, data) {
  if (!data || data.every(d => d.value === 0)) {
    return <div className="text-center text-gray-500 text-lg font-semibold">0</div>;
  }

  const labels = data.map(d => d.name || d.category);
  const values = data.map(d => d.value);
  const chartData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: MIXED_COLORS,
      borderColor: MIXED_COLORS.map(c => c + 'cc'), // Slightly transparent borders
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: "#1f2937",
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 4,
        padding: 6,
      },
    },
  };

  switch (type) {
    case "pie":
      return <Pie data={chartData} options={options} />;
    case "doughnut":
      return <Doughnut data={chartData} options={{ ...options, cutout: "50%" }} />;
    case "bar":
      return <Bar data={chartData} options={options} />;
    case "line":
      return <Line data={chartData} options={options} />;
    case "area":
      chartData.datasets[0].fill = true;
      return <Line data={chartData} options={options} />;
    case "bullet":
      return <Bar data={chartData} options={{ ...options, indexAxis: "y" }} />;
    case "radar":
      return <Radar data={chartData} options={options} />;
    default:
      return null;
  }
}

// Project Overview Component
export default function ProjectOverview({
  isLoading = false,
  project = { title: projectTitle, status: projectStatus, deadline: projectDeadline, score: projectScore },
  taskChart = taskChartData,
  bugChart = bugChartData,
  teamChart = teamChartData,
  documentChart = documentChartData,
  momChart = momChartData,
  risksChart = risksChartData,
}) {
  return (
    <div className="p-6 space-y-6">
      {/* Header with Project Progress Score */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
        <div className="flex gap-2 items-center">
          <Badge className="bg-green-500 text-white">{project.status}</Badge>
          <Badge className="bg-yellow-500/20 text-yellow-600">Deadline: {project.deadline}</Badge>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Score:</span>
            <Progress
              value={project.score}
              className="w-24 h-2 bg-gray-200"
              indicatorClassName="bg-blue-500"
            />
            <Badge
              className={project.score > 0 ? "bg-teal-500 text-white" : "bg-red-500 text-white"}
            >
              {project.score || 0}%
            </Badge>
          </div>
        </div>
      </div>

      {/* 6 Equal-Sized Cards in 3-Column Grid (Graphs Only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tasks Card (PieChart: Total Tasks by Status - Pending, In Progress, Completed) */}
        <Card className="transition-shadow hover:shadow-md bg-white border border-gray-200 rounded-lg overflow-hidden">
          <CardHeader className="pb-2 bg-blue-50">
            <CardTitle className="text-base font-semibold text-blue-900">Tasks</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4" style={{ height: "250px" }}>
            {isLoading ? <ChartSkeleton /> : renderChart("pie", taskChart)}
          </CardContent>
        </Card>

        {/* Bugs Card (Doughnut Chart: Total Bugs by Priority - Critical, High, Medium, Low) */}
        <Card className="transition-shadow hover:shadow-md bg-white border border-gray-200 rounded-lg overflow-hidden">
          <CardHeader className="pb-2 bg-red-50">
            <CardTitle className="text-base font-semibold text-red-900">Bugs</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4" style={{ height: "250px" }}>
            {isLoading ? <ChartSkeleton /> : renderChart("doughnut", bugChart)}
          </CardContent>
        </Card>

        {/* Team Card (Bar Chart: Total Members by Status - Online, Offline, Inactive) */}
        <Card className="transition-shadow hover:shadow-md bg-white border border-gray-200 rounded-lg overflow-hidden">
          <CardHeader className="pb-2 bg-green-50">
            <CardTitle className="text-base font-semibold text-green-900">Team</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4" style={{ height: "250px" }}>
            {isLoading ? <ChartSkeleton /> : renderChart("pie", teamChart)}
          </CardContent>
        </Card>

        {/* Documents Card (Area Chart: Total Documents by Type - Excel, Word, PDF) */}
        <Card className="transition-shadow hover:shadow-md bg-white border border-gray-200 rounded-lg overflow-hidden">
          <CardHeader className="pb-2 bg-yellow-50">
            <CardTitle className="text-base font-semibold text-yellow-900">Documents</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4" style={{ height: "250px" }}>
            {isLoading ? <ChartSkeleton /> : renderChart("bar", documentChart)}
          </CardContent>
        </Card>

        {/* MOM Card (Line Chart: Total Meetings by Type - Online, Offline) */}
        <Card className="transition-shadow hover:shadow-md bg-white border border-gray-200 rounded-lg overflow-hidden">
          <CardHeader className="pb-2 bg-purple-50">
            <CardTitle className="text-base font-semibold text-purple-900">MOM</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4" style={{ height: "250px" }}>
            {isLoading ? <ChartSkeleton /> : renderChart("line", momChart)}
          </CardContent>
        </Card>

        {/* Risks Card (Radar Chart: Total Risks by Category - Technical, Financial, Operational, External) */}
        <Card className="transition-shadow hover:shadow-md bg-white border border-gray-200 rounded-lg overflow-hidden">
          <CardHeader className="pb-2 bg-orange-50">
            <CardTitle className="text-base font-semibold text-orange-900">Risks</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4" style={{ height: "250px" }}>
            {isLoading ? <ChartSkeleton /> : renderChart("radar", risksChart)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
