
"use client";

import React, { useState } from "react";
import FundManagement from "./FundManagement";
import FundCategories from "./FundCategories";
import BudgetRequests from "./BudgetRequests";

const ProjectBudgetWrapper = ({projectId}) => {
  const [mainAccount, setMainAccount] = useState(100000);
  const [activeTab, setActiveTab] = useState("categories"); // "categories" or "requests"

  return (
    <div className="w-full bg-white min-h-screen p-4 flex flex-col lg:flex-row gap-6">
      {/* Left column */}
      <div className="w-full lg:w-[30%] flex flex-col">
        <FundManagement />
      </div>

      {/* Right column */}
      <div className="w-full lg:w-[70%] flex flex-col ">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 ">
          <button
            className={`px-4 py-2 text-sm font-medium cursor-pointer  ${
              activeTab === "categories"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            Fund Categories
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium cursor-pointer ${
              activeTab === "requests"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            Requests
          </button>
        </div>

        {/* Tab content */}
        <div className="w-full flex flex-col">
          {activeTab === "categories" && (
            <FundCategories mainAccount={mainAccount} setMainAccount={setMainAccount} />
          )}
          {activeTab === "requests" && <BudgetRequests projectId={projectId} />}
        </div>
      </div>
    </div>
  );
};

export default ProjectBudgetWrapper;
