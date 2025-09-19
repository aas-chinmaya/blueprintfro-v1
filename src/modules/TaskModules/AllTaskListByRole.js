'use client';

import { useState } from 'react';
import CpcTaskList from './CpcTaskList';
import EmployeeTaskList from './EmployeeTaskList';
import { useDispatch, useSelector } from "react-redux";


import { useCurrentUser } from "@/hooks/useCurrentUser";


export default function AllTaskListByRole() {
      const { userData, employeeData, loading: userLoading } = useSelector(state => state.user) || {};

 const { currentUser } = useCurrentUser();
// const currentUser = {
//   // role: "employee", // Change to 'employee' or 'team_lead' for testing
//   role: employeeData?.role, // Change to 'employee' or 'team_lead' for testing
//   name: employeeData?.name,
// };
console.log("Current User in AllTaskListByRole:", currentUser);
  return (
    <div className="">
      {currentUser.role === "cpc"||  currentUser?.position === "Team Lead" ? (
        <CpcTaskList  currentUser={currentUser} />
      ) : (
        <EmployeeTaskList  currentUser={currentUser} />
      )}
    </div>
  );
}