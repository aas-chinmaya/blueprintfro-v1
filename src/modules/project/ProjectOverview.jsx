









// "use client";

// import React from "react";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Skeleton } from "@/components/ui/skeleton";

// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   PointElement,
//   RadialLinearScale,
//   Filler
// } from "chart.js";

// import { Pie, Doughnut, Bar, Line, Radar } from "react-chartjs-2";

// // Register components
// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   PointElement,
//   RadialLinearScale,
//   Filler
// );

// // Dummy Data (total length by status/type, with some zero values)
// const projectTitle = "Project Alpha";
// const projectStatus = "In Progress";
// const projectDeadline = "September 30, 2025";
// const projectScore = 75; // Progress score (0-100)

// const taskChartData = [
//   { name: "Pending", value: 15 },
//   { name: "In Progress", value: 5 },
//   { name: "Completed", value: 30 },
// ]; // Total: 50 tasks

// const bugChartData = [
//   { name: "Critical", value: 3 },
//   { name: "High", value: 2 },
//   { name: "Medium", value: 8 },
//   { name: "Low", value: 0 }, // Zero for testing
// ]; // Total: 13 bugs, by priority

// const teamChartData = [
//   { name: "Online", value: 5 },
//   { name: "Offline", value: 5 },
//   { name: "Inactive", value: 0 }, // Zero for testing
// ]; // Total: 10 members

// const documentChartData = [
//   { name: "Excel", value: 4 },
//   { name: "Word", value: 6 },
//   { name: "PDF", value: 5 },
// ]; // Total: 15 documents, by type

// const momChartData = [
//   { name: "Online", value: 4 },
//   { name: "Offline", value: 4 },
// ]; // Total: 8 meetings

// const risksChartData = [
//   { category: "Technical", value: 4 },
//   { category: "Financial", value: 2 },
//   { category: "Operational", value: 3 },
//   { category: "External", value: 1 },
// ]; // Total: 10 risks

// // Mixed professional color palette (5 colors, mixed across sections)
// const MIXED_COLORS = [
//   "#3b82f6", // Blue
//   "#22c55e", // Green
//   "#ef4444", // Red
//   "#eab308", // Yellow
//   "#f97316", // Orange
// ];

// // Skeleton for loading state
// function ChartSkeleton() {
//   return <Skeleton className="w-full h-[200px] rounded-lg" />;
// }

// // Chart rendering function
// function renderChart(type, data) {
//   if (!data || data.every(d => d.value === 0)) {
//     return <div className="text-center text-gray-500 text-lg font-semibold">0</div>;
//   }

//   const labels = data.map(d => d.name || d.category);
//   const values = data.map(d => d.value);
//   const chartData = {
//     labels,
//     datasets: [{
//       data: values,
//       backgroundColor: MIXED_COLORS,
//       borderColor: MIXED_COLORS.map(c => c + 'cc'), // Slightly transparent borders
//       borderWidth: 2,
//     }],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           font: {
//             size: 12,
//             family: "'Inter', sans-serif",
//           },
//           color: "#1f2937",
//         },
//       },
//       tooltip: {
//         backgroundColor: "#ffffff",
//         titleColor: "#1f2937",
//         bodyColor: "#1f2937",
//         borderColor: "#e5e7eb",
//         borderWidth: 1,
//         cornerRadius: 4,
//         padding: 6,
//       },
//     },
//   };

//   switch (type) {
//     case "pie":
//       return <Pie data={chartData} options={options} />;
//     case "doughnut":
//       return <Doughnut data={chartData} options={{ ...options, cutout: "50%" }} />;
//     case "bar":
//       return <Bar data={chartData} options={options} />;
//     case "line":
//       return <Line data={chartData} options={options} />;
//     case "area":
//       chartData.datasets[0].fill = true;
//       return <Line data={chartData} options={options} />;
//     case "bullet":
//       return <Bar data={chartData} options={{ ...options, indexAxis: "y" }} />;
//     case "radar":
//       return <Radar data={chartData} options={options} />;
//     default:
//       return null;
//   }
// }

// // Project Overview Component
// export default function ProjectOverview({
//   isLoading = false,
//   project = { title: projectTitle, status: projectStatus, deadline: projectDeadline, score: projectScore },
//   taskChart = taskChartData,
//   bugChart = bugChartData,
//   teamChart = teamChartData,
//   documentChart = documentChartData,
//   momChart = momChartData,
//   risksChart = risksChartData,
// }) {
//   return (
//     <div className="p-6 space-y-6">
//       {/* Header with Project Progress Score */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
//         <div className="flex gap-2 items-center">
//           <Badge className="bg-green-500 text-white">{project.status}</Badge>
//           <Badge className="bg-yellow-500/20 text-yellow-600">Deadline: {project.deadline}</Badge>
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-600">Score:</span>
//             <Progress
//               value={project.score}
//               className="w-24 h-2 bg-gray-200"
//               indicatorClassName="bg-blue-500"
//             />
//             <Badge
//               className={project.score > 0 ? "bg-teal-500 text-white" : "bg-red-500 text-white"}
//             >
//               {project.score || 0}%
//             </Badge>
//           </div>
//         </div>
//       </div>

//       {/* 6 Equal-Sized Cards in 3-Column Grid (Graphs Only) */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Tasks Card (PieChart: Total Tasks by Status - Pending, In Progress, Completed) */}
//         <Card className="transition-shadow hover:shadow-md bg-white border border-gray-200 rounded-lg overflow-hidden">
//           <CardHeader className="pb-2 bg-blue-50">
//             <CardTitle className="text-base font-semibold text-blue-900">Tasks</CardTitle>
//           </CardHeader>
//           <CardContent className="flex justify-center p-4" style={{ height: "250px" }}>
//             {isLoading ? <ChartSkeleton /> : renderChart("pie", taskChart)}
//           </CardContent>
//         </Card>

//         {/* Bugs Card (Doughnut Chart: Total Bugs by Priority - Critical, High, Medium, Low) */}
//         <Card className="transition-shadow hover:shadow-md bg-white border border-gray-200 rounded-lg overflow-hidden">
//           <CardHeader className="pb-2 bg-red-50">
//             <CardTitle className="text-base font-semibold text-red-900">Bugs</CardTitle>
//           </CardHeader>
//           <CardContent className="flex justify-center p-4" style={{ height: "250px" }}>
//             {isLoading ? <ChartSkeleton /> : renderChart("doughnut", bugChart)}
//           </CardContent>
//         </Card>

//         {/* Team Card (Bar Chart: Total Members by Status - Online, Offline, Inactive) */}
//         <Card className="transition-shadow hover:shadow-md bg-white border border-gray-200 rounded-lg overflow-hidden">
//           <CardHeader className="pb-2 bg-green-50">
//             <CardTitle className="text-base font-semibold text-green-900">Team</CardTitle>
//           </CardHeader>
//           <CardContent className="flex justify-center p-4" style={{ height: "250px" }}>
//             {isLoading ? <ChartSkeleton /> : renderChart("pie", teamChart)}
//           </CardContent>
//         </Card>

//         {/* Documents Card (Area Chart: Total Documents by Type - Excel, Word, PDF) */}
//         <Card className="transition-shadow hover:shadow-md bg-white border border-gray-200 rounded-lg overflow-hidden">
//           <CardHeader className="pb-2 bg-yellow-50">
//             <CardTitle className="text-base font-semibold text-yellow-900">Documents</CardTitle>
//           </CardHeader>
//           <CardContent className="flex justify-center p-4" style={{ height: "250px" }}>
//             {isLoading ? <ChartSkeleton /> : renderChart("bar", documentChart)}
//           </CardContent>
//         </Card>

//         {/* MOM Card (Line Chart: Total Meetings by Type - Online, Offline) */}
//         <Card className="transition-shadow hover:shadow-md bg-white border border-gray-200 rounded-lg overflow-hidden">
//           <CardHeader className="pb-2 bg-purple-50">
//             <CardTitle className="text-base font-semibold text-purple-900">MOM</CardTitle>
//           </CardHeader>
//           <CardContent className="flex justify-center p-4" style={{ height: "250px" }}>
//             {isLoading ? <ChartSkeleton /> : renderChart("line", momChart)}
//           </CardContent>
//         </Card>

//         {/* Risks Card (Radar Chart: Total Risks by Category - Technical, Financial, Operational, External) */}
//         <Card className="transition-shadow hover:shadow-md bg-white border border-gray-200 rounded-lg overflow-hidden">
//           <CardHeader className="pb-2 bg-orange-50">
//             <CardTitle className="text-base font-semibold text-orange-900">Risks</CardTitle>
//           </CardHeader>
//           <CardContent className="flex justify-center p-4" style={{ height: "250px" }}>
//             {isLoading ? <ChartSkeleton /> : renderChart("radar", risksChart)}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [mode, setMode] = useState('Analysis'); // Toggle state
  const [view, setView] = useState('Personal'); // Personal, Team, Organization
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // Mock data for KPIs and charts
  const kpiData = {
    tasksCompleted: 85,
    bugsResolved: 92,
    teamProductivity: 120,
    projectProgress: 75,
  };

  const chartData = {
    pie: {
      labels: ['To Do', 'In Progress', 'Done'],
      datasets: [{
        data: [30, 40, 30],
        backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
      }],
    },
    bar: {
      labels: ['Critical', 'High', 'Medium', 'Low'],
      datasets: [{
        label: 'Bugs by Severity',
        data: [10, 20, 30, 40],
        backgroundColor: '#FF6384',
      }],
    },
    line: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Task Completion',
        data: [20, 40, 60, 80],
        borderColor: '#36A2EB',
        fill: true,
      }],
    },
  };

  // Mock table data
  const tableData = {
    tasks: [
      { id: 1, description: 'Implement login', assignee: 'John', status: 'Done', deadline: '2025-09-20', priority: 'High', sla: 'Yes' },
      { id: 2, description: 'Fix UI bug', assignee: 'Jane', status: 'In Progress', deadline: '2025-09-25', priority: 'Medium', sla: 'No' },
    ],
  };

  // Export functions
  const exportPDF = (tableId, title) => {
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    doc.autoTable({ html: `#${tableId}` });
    doc.save(`${title}.pdf`);
  };

  const exportExcel = (data, title) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${title}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analysis Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            <option>Personal</option>
            <option>Team</option>
            <option>Organization</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            <option>Last 30 Days</option>
            <option>This Week</option>
            <option>Custom</option>
          </select>
        </div>
      </header>

      {/* Toggle Switch */}
      <div className="bg-white shadow-sm p-4 text-center">
        <div className="inline-flex rounded-md bg-gray-200 p-1">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'Analysis' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            onClick={() => setMode('Analysis')}
          >
            Analysis
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${mode === 'Reports' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            onClick={() => setMode('Reports')}
          >
            Reports
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {mode === 'Analysis' ? (
          <div>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(kpiData).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                  <p className="text-3xl font-bold text-blue-600">{value}%</p>
                  <div className="h-10 bg-gray-200 rounded mt-2" /> {/* Mock sparkline */}
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Tasks Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Task Status Distribution</h3>
                    <Pie data={chartData.pie} options={{ maintainAspectRatio: false }} height={200} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Bugs by Severity</h3>
                    <Bar data={chartData.bar} options={{ maintainAspectRatio: false }} height={200} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Task Completion Trend</h3>
                    <Line data={chartData.line} options={{ maintainAspectRatio: false }} height={200} />
                  </div>
                </div>
              </div>
              {/* Progress Comparison */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Progress Comparison (This Month vs Last Month)</h2>
                <Line
                  data={{
                    labels: ['Tasks', 'Bugs', 'Progress'],
                    datasets: [
                      { label: 'This Month', data: [85, 92, 75], borderColor: '#36A2EB' },
                      { label: 'Last Month', data: [80, 88, 70], borderColor: '#FF6384' },
                    ],
                  }}
                  options={{ maintainAspectRatio: false }}
                  height={200}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Filter Controls */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex space-x-4">
              <select className="border rounded-md p-2 text-sm">
                <option>All Projects</option>
              </select>
              <select className="border rounded-md p-2 text-sm">
                <option>All Teams</option>
              </select>
              <input type="text" placeholder="Search..." className="border rounded-md p-2 text-sm" />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Apply</button>
            </div>

            {/* Tables Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Tasks Report</h2>
                <div className="space-x-2">
                  <button
                    onClick={() => exportPDF('tasks-table', 'Tasks Report')}
                    className="bg-gray-200 px-3 py-1 rounded-md text-sm"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => exportExcel(tableData.tasks, 'Tasks Report')}
                    className="bg-gray-200 px-3 py-1 rounded-md text-sm"
                  >
                    Excel
                  </button>
                </div>
              </div>
              <table id="tasks-table" className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Assignee</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Deadline</th>
                    <th className="p-2 text-left">Priority</th>
                    <th className="p-2 text-left">SLA</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.tasks.map((task) => (
                    <tr key={task.id} className="border-t">
                      <td className="p-2">{task.id}</td>
                      <td className="p-2">{task.description}</td>
                      <td className="p-2">{task.assignee}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded ${task.status === 'Done' ? 'bg-green-200' : 'bg-yellow-200'}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="p-2">{task.deadline}</td>
                      <td className="p-2">{task.priority}</td>
                      <td className="p-2">{task.sla}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;