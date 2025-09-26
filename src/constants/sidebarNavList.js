

"use client";

import {
  LayoutDashboard,
  PhoneCall,
  CalendarDays,
  User,
  Folder,
  Users,
  ListChecks,
  Bug,
  FolderClosed,
  FileText,
  Inbox,
} from "lucide-react";

// Icon map
export const iconMap = {
  LayoutDashboard,
  PhoneCall,
  CalendarDays,
  User,
  Folder,
  Users,
  ListChecks,
  Bug,
  FolderClosed,
  FileText,
  Inbox,
};

// Role groups
export const roleGroups = {
  cpcGroup: ["cpc", "Team Lead"],       // Team Lead mirrors cpc
  employeeGroup: ["employee(regular)"], // regular employee
};

// Full navigation
export const fullNav = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["cpcGroup", "employeeGroup"],
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: "Inbox",
    roles: ["cpcGroup", "employeeGroup"],
  },
  {
    title: "Contact",
    url: "/contact",
    icon: "PhoneCall",
    roles: ["cpcGroup"],
  },
   {
    title: "Client",
    url: "/client",
    icon: "User",
    roles: ["cpcGroup"],
  },
 

  {
    title: "Quotation",
    url: "/quotation",
    icon: "FileText",
    roles: ["cpcGroup"],
  },
  {
   title: "Project Management",
   url: "#",
   icon: "CalendarDays",
   roles: ["cpcGroup","employeeGroup"],
   items: [
     { title: "All Project", url: "/project", roles: ["cpcGroup","employeeGroup"] },
     { title: "Active Team", url: "/team", roles: ["cpcGroup","employeeGroup"] },
     { title: "All Task", url: "/task", roles: ["cpcGroup","employeeGroup"] },
     { title: "All Bug", url: "/bug", roles: ["cpcGroup"] },
     { title: "Assinged Bug", url: "/bug/assigned-bugs", roles: ["employeeGroup"] },
   ],
 },
 
  {
    title: "Meeting",
    url: "#",
    icon: "CalendarDays",
    roles: ["cpcGroup"],
    items: [
      { title: "Client Meeting", url: "/meetings/all", roles: ["cpcGroup"] },
      { title: "Meeting Calendar", url: "/meetings/calendar", roles: ["cpcGroup"] },
      { title: "MOM Dashboard", url: "/meetings/mom", roles: ["cpcGroup"] },
      
    ],
  },
  
  //  {
  //   title: "Documents",
  //   url: "#",
  //   icon: "Folder",
  //   roles: ["cpcGroup"],
  //   items: [
  //     { title: "Internal", url: "/document/internal-doc", roles: ["cpcGroup"] },
  //     { title: "External", url: "/document/external-doc", roles: ["cpcGroup"] },
   
  //   ],
  // },
  {
    title: "Concerns",
    url: "#",
    icon: "FolderClosed",
    roles: ["cpcGroup"],
    items: [
      { title: "Cause Dashboard", url: "/meetings/cause", roles: ["cpcGroup"] },
    ],
  },
  {
    title: "Master",
    url: "#",
    icon: "FolderClosed",
    roles: ["cpcGroup"],
    items: [
      { title: "Service", url: "/master/services", roles: ["cpcGroup"] },
      { title: "Industry", url: "/master/industry", roles: ["cpcGroup"] },
      { title: "Meeting Slots", url: "/master/slots", roles: ["cpcGroup"] },
    ],
  },
];









// "use client";

// import {
//   LayoutDashboard,
//   PhoneCall,
//   CalendarDays,
//   User,
//   Folder,
//   Users,
//   ListChecks,
//   Bug,
//   FolderClosed,
//   FileText,
//   Inbox,
// } from "lucide-react";

// // Icon map
// export const iconMap = {
//   LayoutDashboard,
//   PhoneCall,
//   CalendarDays,
//   User,
//   Folder,
//   Users,
//   ListChecks,
//   Bug,
//   FolderClosed,
//   FileText,
//   Inbox,
// };

// // Role groups
// export const roleGroups = {
//   cpcGroup: ["cpc", "Team Lead"],       // Team Lead mirrors cpc
//   employeeGroup: ["employee(regular)"], // regular employee
// };

// // Full navigation
// export const fullNav = [
//   {
//     title: "Dashboard",
//     url: "/dashboard",
//     icon: "LayoutDashboard",
//     roles: ["cpcGroup", "employeeGroup"],
//   },
//   {
//     title: "Inbox",
//     url: "/inbox",
//     icon: "Inbox",
//     roles: ["cpcGroup", "employeeGroup"],
//   },
//   {
//     title: "Client",
//     url: "/client",
//     icon: "User",
//     roles: ["cpcGroup"],
//   },
//   {
//     title: "Project",
//     url: "/project",
//     icon: "Folder",
//     roles: ["cpcGroup", "employeeGroup"],
//   },
//   // coming soon
  
//   {
//     title: "Team",
//     url: "/team",
//     icon: "Users",
//     roles: ["cpcGroup", "employeeGroup"],
//   },
//   {
//     title: "Task",
//     url: "/task",
//     icon: "ListChecks",
//     roles: ["cpcGroup", "employeeGroup"],
//   },
//   {
//     title: "Bug",
//     url: "/bug",
//     icon: "Bug",
//     roles: ["cpcGroup"],
//   },
//   {
//     title: "Bug",
//     url: "/bug/assigned-bugs",
//     icon: "Bug",
//     roles: ["employeeGroup"],
//   },
//   {
//     title: "Contact",
//     url: "/contact",
//     icon: "PhoneCall",
//     roles: ["cpcGroup"],
//   },
//   {
//     title: "Meeting",
//     url: "#",
//     icon: "CalendarDays",
//     roles: ["cpcGroup"],
//     items: [
//       { title: "Client Meeting", url: "/meetings/all", roles: ["cpcGroup"] },
//       { title: "Meeting Calendar", url: "/meetings/calendar", roles: ["cpcGroup"] },
//       { title: "MOM Dashboard", url: "/meetings/mom", roles: ["cpcGroup"] },
//       { title: "Cause Dashboard", url: "/meetings/cause", roles: ["cpcGroup"] },
//     ],
//   },
//   {
//     title: "Quotation",
//     url: "/quotation",
//     icon: "FileText",
//     roles: ["cpcGroup"],
//   },
//   {
//     title: "Master",
//     url: "#",
//     icon: "FolderClosed",
//     roles: ["cpcGroup"],
//     items: [
//       { title: "Service", url: "/master/services", roles: ["cpcGroup"] },
//       { title: "Industry", url: "/master/industry", roles: ["cpcGroup"] },
//       { title: "Meeting Slots", url: "/master/slots", roles: ["cpcGroup"] },
//     ],
//   },
// ];







