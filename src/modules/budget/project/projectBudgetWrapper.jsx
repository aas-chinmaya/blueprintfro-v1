

// components/ProjectBudgetWrapper.jsx
"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import FundManagement from "./FundManagement";
import CategoriesAndRequests from "./CategoriesAndRequests";

const ProjectBudgetWrapper = ({ projectId }) => {
  const project = useSelector((state) => state.project.project?.data);
  const [isDistributionStarted, setIsDistributionStarted] = useState(false);

  const handleStartDistribution = () => {
    setIsDistributionStarted(true);
    toast.success("Budget distribution started!");
    // Add API call here if needed
  };

  return (
    <div className="w-full bg-white flex flex-col">
      {/* Dynamic inner section: only one visible at a time */}
      {project?.status !== "pending" ? (
        // ✅ Main Budget Overview Layout
        <div className="flex flex-col lg:flex-row gap-6 min-h-screen p-4">
          <FundManagement />
          <CategoriesAndRequests />
        </div>
      ) : (
        // ✅ Compact card when project status is pending
        <div className="min-h-[87vh] flex-1 flex items-center justify-center bg-gray-100 rounded-md shadow-sm p-4">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center space-y-3 w-[250px]">
            <span className="text-gray-700 font-medium text-sm">Budget Allocated</span>
            <span className="text-xl font-bold text-green-600">₹50,000</span>
            <button
              onClick={handleStartDistribution}
              className="cursor-pointer px-4 py-1 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 transition"
            >
              Start Distribution
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBudgetWrapper;
