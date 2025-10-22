


// "use client";

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchBudgetAccountsByProject,
//   createBudgetAccount,
// } from "@/features/budget/budgetSlice";

// import { FundOverview } from "@/modules/budget/fund/FundOverview";
// import BudgetRequestsPanel from "@/modules/budget/request/BudgetRequestsPanel";
// import { TransactionHistory } from "@/modules/budget/fund/TransactionHistory";
// import { AddFundDialog } from "@/modules/budget/fund/AddFundDialog";
// import { CreateCategoryDialog } from "@/modules/budget/category/CreateCategoryDialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Plus, Wallet, CheckCircle } from "lucide-react";
// import  CategoryList  from "@/modules/budget/category/CategoryList";

// export default function ProjectBudgetWrapper({ projectId, projectName }) {
//   const dispatch = useDispatch();
//   const { projectAccounts, loading, error } = useSelector(
//     (state) => state.budget
//   );
//   const BudgetAccount = projectAccounts?.[0] || null;

//   const ClientBudget = "50cr";
//   const [state, setState] = useState({
//     mainAccount: 0,
//     categories: [],
//     budgetRequests: [],
//     transactions: [],
//   });

//   // ----- Dialog States -----
//   const [addFundDialogOpen, setAddFundDialogOpen] = useState(false);
//   const [createCategoryDialogOpen, setCreateCategoryDialogOpen] =
//     useState(false);

 
//   // ----- Create Budget Account Dialog -----
//   const [openCreateAccountDialog, setOpenCreateAccountDialog] = useState(false);
//   const [initialBudget, setInitialBudget] = useState("");
//   const [agreed, setAgreed] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [creating, setCreating] = useState(false);

//   // Fetch project accounts on mount
//   useEffect(() => {
//     if (projectId) dispatch(fetchBudgetAccountsByProject(projectId));
//   }, [dispatch, projectId]);

//   // ----- Totals -----
//   const totalAllocated = state.categories.reduce(
//     (sum, cat) => sum + cat.allocated,
//     0
//   );
//   const totalSpent = state.categories.reduce((sum, cat) => sum + cat.spent, 0);
//   const availableFunds = state.mainAccount - totalSpent;


//   const handleCreateBudgetAccount = async () => {
//     if (!initialBudget || !agreed) return;

//     const amount = parseFloat(initialBudget);
//     if (isNaN(amount) || amount <= 0) return;

//     setCreating(true);

//     try {
//       // Dispatch the thunk to create account
//       await dispatch(
//         createBudgetAccount({
//           projectId,
//           accountData: { initialAmount: amount },
//         })
//       ).unwrap();

//       setState((prev) => ({ ...prev, mainAccount: amount }));
//       setSuccess(true);

//       setTimeout(() => {
//         setSuccess(false);
//         setOpenCreateAccountDialog(false);
//         setInitialBudget("");
//         setAgreed(false);
//       }, 1500);
//     } catch (err) {
//       alert(err.message || "Failed to create account");
//     } finally {
//       setCreating(false);
//     }
//   };

//   // ----- Loading or Empty State -----
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading budget accounts...</p>
//       </div>
//     );
//   }

//   if (!BudgetAccount || BudgetAccount.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center space-y-6 p-4 text-center">
//         <h1 className="text-2xl font-bold">{projectName || "Project"}</h1>
//         <p className="text-muted-foreground">
//           Client Budget INR: {ClientBudget || 0}
//         </p>

//         <Button onClick={() => setOpenCreateAccountDialog(true)}>
//           Create Budget Account
//         </Button>

//         {/* Create Budget Account Dialog */}
//         {openCreateAccountDialog && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//             <div className="bg-white p-6 rounded-md w-96 space-y-4">
//               <h2 className="text-xl font-bold">
//                 Create Project Budget Account
//               </h2>
//               <p>Enter the initial budget and agree to create a new account.</p>

//               {!success ? (
//                 <>
//                   <Input
//                     type="number"
//                     placeholder="Initial Budget Amount in INR"
//                     value={initialBudget}
//                     onChange={(e) => setInitialBudget(e.target.value)}
//                   />
//                   <div className="flex items-center gap-2">
//                     <Checkbox
//                       checked={agreed}
//                       onCheckedChange={(val) => setAgreed(!!val)}
//                     />
//                     <span>I agree to create this account</span>
//                   </div>
//                   <div className="flex justify-end gap-2">
//                     <Button
//                       variant="outline"
//                       onClick={() => setOpenCreateAccountDialog(false)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       onClick={handleCreateBudgetAccount}
//                       disabled={!agreed || !initialBudget || creating}
//                     >
//                       {creating ? "Creating..." : "Create Account"}
//                     </Button>
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex flex-col items-center justify-center py-6">
//                   <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
//                   <p className="text-green-600 font-medium">
//                     Budget Account Created!
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ----- Normal UI if accounts exist -----
//   return (
//     <div className="min-h-screen bg-background">
//       <div className="mx-auto space-y-6">
//      <div className="flex items-center justify-end gap-2">
//   <Button onClick={() => setAddFundDialogOpen(true)}>
//     <Wallet className="h-4 w-4 mr-2" />
//     Add Funds
//   </Button>
//   <Button
//     onClick={() => setCreateCategoryDialogOpen(true)}
//     // variant="outline"
//   >
//     <Plus className="h-4 w-4 mr-2" />
//     New Category
//   </Button>
// </div>


//         <FundOverview
//           BudgetAccount={BudgetAccount}
//           mainAccount={state.mainAccount}
//           totalAllocated={totalAllocated}
//           totalSpent={totalSpent}
//         />

//         <Tabs defaultValue="categories" className="space-y-2">
//           <TabsList>
//             <TabsTrigger value="requests">Requests</TabsTrigger>
//             <TabsTrigger value="transactions">Transactions</TabsTrigger>
//             <TabsTrigger value="categories">Categories</TabsTrigger>
//           </TabsList>

//           <TabsContent value="categories">
//             <CategoryList BudgetAccount={BudgetAccount} projectId={projectId} />
//           </TabsContent>

//           <TabsContent value="requests">
//             <BudgetRequestsPanel projectId={projectId} />
//           </TabsContent>

//           <TabsContent value="transactions">
//             <TransactionHistory
//               transactions={BudgetAccount?.transactions}
//               projectId={projectId}
//             />
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Dialogs */}
//       <AddFundDialog
//         accountId={BudgetAccount?.accountId}
//         open={addFundDialogOpen}
//         onOpenChange={setAddFundDialogOpen}
//       />
//       <CreateCategoryDialog
//         BudgetAccount={BudgetAccount}
//         open={createCategoryDialogOpen}
//         onOpenChange={setCreateCategoryDialogOpen}
//         onCreateCategory={() => {}}
//         availableFunds={availableFunds}
//       />

      
//     </div>
//   );
// }












// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
// import {
//   fetchBudgetAccountsByProject,
//   createBudgetAccount,
// } from "@/features/budget/budgetSlice";

// import { FundOverview } from "@/modules/budget/fund/FundOverview";
// import BudgetRequestsPanel from "@/modules/budget/request/BudgetRequestsPanel";
// import { TransactionHistory } from "@/modules/budget/fund/TransactionHistory";
// import { AddFundDialog } from "@/modules/budget/fund/AddFundDialog";
// import { CreateCategoryDialog } from "@/modules/budget/category/CreateCategoryDialog";
// import CategoryList from "@/modules/budget/category/CategoryList";

// import {
//   Button,
// } from "@/components/ui/button";
// import {
//   Input,
// } from "@/components/ui/input";
// import {
//   Checkbox,
// } from "@/components/ui/checkbox";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Skeleton,
// } from "@/components/ui/skeleton";
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
// import { Plus, Wallet, CheckCircle } from "lucide-react";

// // ========================================
// // PERFECT SINGLE FILE - ZERO INFINITE API
// // PURE JS - FULL SKELETONS - NO DEPENDENCIES
// // ========================================

// export default function ProjectBudgetWrapper({ projectId, projectName }) {
//   const dispatch = useDispatch();
  
//   // SIMPLE SELECTOR - NO SHALLOW EQUAL
//   const budgetState = useSelector((state) => state.budget);
//   const { projectAccounts = [], loading } = budgetState;
//   const BudgetAccount = projectAccounts[0] || null;

//   // ========================================
//   // DIALOG STATES
//   // ========================================
//   const [addFundDialogOpen, setAddFundDialogOpen] = useState(false);
//   const [createCategoryDialogOpen, setCreateCategoryDialogOpen] = useState(false);
//   const [openCreateAccountDialog, setOpenCreateAccountDialog] = useState(false);
//   const [initialBudget, setInitialBudget] = useState("");
//   const [agreed, setAgreed] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [creating, setCreating] = useState(false);

//   // ========================================
//   // CHART STATES - SIMPLE
//   // ========================================
//   const [timeRange, setTimeRange] = useState("90d");

//   // STATIC - NO RECREATE
//   const CHART_CONFIG = {
//     categories: { label: "Categories", color: "#16a34a" },
//     transactions: { label: "Transactions", color: "#22c55e" },
//     requests: { label: "Requests", color: "#4ade80" },
//   };

//   // ========================================
//   // SINGLE API CALL - NEVER INFINITE
//   // ========================================
//   useEffect(() => {
//     // ONLY CALL ONCE - NO DEPENDENCIES
//     if (projectId && projectAccounts.length === 0) {
//       dispatch(fetchBudgetAccountsByProject(projectId));
//     }
//   }, []); // EMPTY DEPENDENCY ARRAY = RUNS ONCE

//   // ========================================
//   // CREATE ACCOUNT - SIMPLE
//   // ========================================
//   const handleCreateBudgetAccount = async () => {
//     if (!initialBudget || !agreed) return;
//     const amount = parseFloat(initialBudget);
//     if (isNaN(amount) || amount <= 0) return;

//     setCreating(true);
    
//     try {
//       await dispatch(
//         createBudgetAccount({
//           projectId,
//           accountData: { initialAmount: amount },
//         })
//       ).unwrap();
      
//       setSuccess(true);
//       setTimeout(() => {
//         setSuccess(false);
//         setOpenCreateAccountDialog(false);
//         setInitialBudget("");
//         setAgreed(false);
//       }, 1500);
//     } catch (err) {
//       alert(err.message || "Failed to create account");
//     } finally {
//       setCreating(false);
//     }
//   };

//   // ========================================
//   // CHART DATA - SIMPLE MEMO
//   // ========================================
//   const chartData = useMemo(() => {
//     if (!BudgetAccount || loading) return [{ date: "2025-01-01", categories: 0, transactions: 0, requests: 0 }];
    
//     const endDate = new Date();
//     const startDate = new Date(endDate);
//     const days = { "7d": 7, "30d": 30, "90d": 90 }[timeRange];
//     startDate.setDate(endDate.getDate() - days);
    
//     const dateMap = new Map();
    
//     // Simple data processing
//     const allItems = [...(BudgetAccount.categories || []), ...(BudgetAccount.transactions || []), ...(BudgetAccount.requests || [])];
    
//     allItems.forEach((item) => {
//       const date = new Date(item.createdAt || item.created_at);
//       if (date >= startDate && date <= endDate) {
//         const key = date.toISOString().split("T")[0];
//         const current = dateMap.get(key) || { date: key, categories: 0, transactions: 0, requests: 0 };
//         if (item.category) dateMap.set(key, { ...current, categories: current.categories + 1 });
//         if (item.amount) dateMap.set(key, { ...current, transactions: current.transactions + 1 });
//         if (item.requestId) dateMap.set(key, { ...current, requests: current.requests + 1 });
//       }
//     });
    
//     // Fill dates
//     let current = new Date(startDate);
//     while (current <= endDate) {
//       const key = current.toISOString().split("T")[0];
//       if (!dateMap.has(key)) dateMap.set(key, { date: key, categories: 0, transactions: 0, requests: 0 });
//       current.setDate(current.getDate() + 1);
//     }
    
//     return Array.from(dateMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
//   }, [BudgetAccount, timeRange, loading]);

//   // STATIC GRADIENTS
//   const gradients = (
//     <>
//       <linearGradient id="fillCategories" x1="0" y1="0" x2="0" y2="1">
//         <stop offset="5%" stopColor="#16a34aff" stopOpacity="1" />
//         <stop offset="95%" stopColor="#16a34aff" stopOpacity="0.1" />
//       </linearGradient>
//       <linearGradient id="fillTransactions" x1="0" y1="0" x2="0" y2="1">
//         <stop offset="5%" stopColor="#22c55eff" stopOpacity="0.8" />
//         <stop offset="95%" stopColor="#22c55eff" stopOpacity="0.1" />
//       </linearGradient>
//       <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
//         <stop offset="5%" stopColor="#4ade80ff" stopOpacity="0.6" />
//         <stop offset="95%" stopColor="#4ade80ff" stopOpacity="0.1" />
//       </linearGradient>
//     </>
//   );

//   // STATIC AREAS
//   const areas = (
//     <>
//       <Area dataKey="requests" type="natural" fill="url(#fillRequests)" stroke="#4ade80ff" stackId="a" />
//       <Area dataKey="transactions" type="natural" fill="url(#fillTransactions)" stroke="#22c55eff" stackId="a" />
//       <Area dataKey="categories" type="natural" fill="url(#fillCategories)" stroke="#16a34aff" stackId="a" />
//     </>
//   );

//   // ========================================
//   // FULL PAGE SKELETON
//   // ========================================
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background p-6 space-y-6">
//         {/* ACTION BUTTONS SKELETON */}
//         <div className="flex justify-end gap-2">
//           <Skeleton className="h-10 w-24" />
//           <Skeleton className="h-10 w-28" />
//         </div>

//         {/* ROW 1: CHART SKELETON */}
//         <Card className="h-[300px]">
//           <CardHeader className="pb-3 space-y-2">
//             <Skeleton className="h-5 w-32" />
//             <Skeleton className="h-4 w-48" />
//             <div className="flex justify-end">
//               <Skeleton className="h-7 w-24" />
//             </div>
//           </CardHeader>
//           <CardContent className="px-3 pt-2">
//             <Skeleton className="h-full rounded-xl" />
//           </CardContent>
//         </Card>

//         {/* ROW 2: 2-COLUMNS SKELETON */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card className="h-[400px]">
//             <CardContent className="p-6 space-y-4">
//               <Skeleton className="h-6 w-40" />
//               <Skeleton className="h-8 w-full" />
//               <Skeleton className="h-64 w-full" />
//             </CardContent>
//           </Card>
//           <Card className="h-[400px]">
//             <CardContent className="p-6 space-y-4">
//               <Skeleton className="h-6 w-32" />
//               <div className="space-y-2">
//                 <Skeleton className="h-10 w-full" />
//                 <Skeleton className="h-10 w-full" />
//                 <Skeleton className="h-10 w-full" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* ROW 3: TABS SKELETON */}
//         <Card>
//           <CardContent className="p-6 space-y-4">
//             <Skeleton className="h-10 w-48" />
//             <Skeleton className="h-64 w-full" />
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // ========================================
//   // EMPTY STATE
//   // ========================================
//   if (!BudgetAccount) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center space-y-6 p-4 text-center">
//         <h1 className="text-2xl font-bold">{projectName || "Project"}</h1>
//         <p className="text-muted-foreground">Client Budget INR: 50cr</p>
//         <Button onClick={() => setOpenCreateAccountDialog(true)}>
//           Create Budget Account
//         </Button>

//         {openCreateAccountDialog && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//             <div className="bg-white p-6 rounded-md w-96 space-y-4">
//               <h2 className="text-xl font-bold">Create Project Budget Account</h2>
              
//               {!success ? (
//                 <>
//                   <Input
//                     type="number"
//                     placeholder="Initial Budget Amount in INR"
//                     value={initialBudget}
//                     onChange={(e) => setInitialBudget(e.target.value)}
//                   />
//                   <div className="flex items-center gap-2">
//                     <Checkbox checked={agreed} onCheckedChange={setAgreed} />
//                     <span>I agree to create this account</span>
//                   </div>
//                   <div className="flex justify-end gap-2">
//                     <Button variant="outline" onClick={() => setOpenCreateAccountDialog(false)}>
//                       Cancel
//                     </Button>
//                     <Button
//                       onClick={handleCreateBudgetAccount}
//                       disabled={!agreed || !initialBudget || creating}
//                     >
//                       {creating ? "Creating..." : "Create Account"}
//                     </Button>
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex flex-col items-center justify-center py-6">
//                   <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
//                   <p className="text-green-600 font-medium">Budget Account Created!</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ========================================
//   // MAIN LAYOUT - NO SKELETONS
//   // ========================================
//   return (
//     <div className="min-h-screen bg-background p-6 space-y-6">
//       {/* ACTION BUTTONS */}
//       <div className="flex items-center justify-end gap-2">
//         <Button onClick={() => setAddFundDialogOpen(true)}>
//           <Wallet className="h-4 w-4 mr-2" />
//           Add Funds
//         </Button>
//         <Button onClick={() => setCreateCategoryDialogOpen(true)}>
//           <Plus className="h-4 w-4 mr-2" />
//           New Category
//         </Button>
//       </div>

//       {/* ROW 1: CHART */}
//       <Card className="h-[300px]">
//         <CardHeader className="pb-3">
//           <div className="flex justify-between items-center">
//             <div>
//               <CardTitle className="text-sm font-medium">Budget Activity</CardTitle>
//               <CardDescription className="text-xs text-muted-foreground">
//                 Categories, transactions, and requests over time
//               </CardDescription>
//             </div>
//             <Select value={timeRange} onValueChange={setTimeRange}>
//               <SelectTrigger className="w-24 h-7 text-xs">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="90d" className="text-xs">3 months</SelectItem>
//                 <SelectItem value="30d" className="text-xs">30 days</SelectItem>
//                 <SelectItem value="7d" className="text-xs">7 days</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardHeader>
//         <CardContent className="px-3 pt-2 h-[calc(100%-3.75rem)]">
//           <ChartContainer config={CHART_CONFIG} className="h-full w-full">
//             <AreaChart data={chartData}>
//               <defs>{gradients}</defs>
//               <CartesianGrid vertical={false} strokeOpacity={0.3} />
//               <XAxis
//                 dataKey="date"
//                 tickLine={false}
//                 axisLine={false}
//                 tickMargin={4}
//                 fontSize={10}
//                 minTickGap={25}
//                 tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
//               />
//               <ChartTooltip
//                 cursor={false}
//                 content={
//                   <ChartTooltipContent
//                     labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
//                     indicator="dot"
//                     classNames={{ label: "text-xs" }}
//                   />
//                 }
//               />
//               {areas}
//             </AreaChart>
//           </ChartContainer>
//         </CardContent>
//       </Card>

//       {/* ROW 2: 2-COLUMNS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="h-[400px]">
//           <CardContent className="p-6 h-full">
//             <FundOverview
//               BudgetAccount={BudgetAccount}
//               mainAccount={BudgetAccount.balance || 0}
//               totalAllocated={BudgetAccount.totalAllocated || 0}
//               totalSpent={BudgetAccount.totalSpent || 0}
//             />
//           </CardContent>
//         </Card>

//         <Card className="h-[400px]">
//           <CardContent className="p-6 h-full">
//             <TransactionHistory
//               transactions={BudgetAccount.transactions}
//               projectId={projectId}
//             />
//           </CardContent>
//         </Card>
//       </div>

//       {/* ROW 3: TABS */}
//       <Card>
//         <CardContent className="p-0">
//           <Tabs defaultValue="categories" className="space-y-2">
//             <TabsList>
//               <TabsTrigger value="requests">Requests</TabsTrigger>
//               <TabsTrigger value="categories">Categories</TabsTrigger>
//             </TabsList>
//             <TabsContent value="categories" className="p-6">
//               <CategoryList BudgetAccount={BudgetAccount} projectId={projectId} />
//             </TabsContent>
//             <TabsContent value="requests" className="p-6">
//               <BudgetRequestsPanel projectId={projectId} />
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>

//       {/* DIALOGS */}
//       <AddFundDialog
//         accountId={BudgetAccount.accountId}
//         open={addFundDialogOpen}
//         onOpenChange={setAddFundDialogOpen}
//       />
//       <CreateCategoryDialog
//         BudgetAccount={BudgetAccount}
//         open={createCategoryDialogOpen}
//         onOpenChange={setCreateCategoryDialogOpen}
//         onCreateCategory={() => {}}
//         availableFunds={BudgetAccount.balance || 0}
//       />
//     </div>
//   );
// }




"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  fetchBudgetAccountsByProject,
  createBudgetAccount,
} from "@/features/budget/budgetSlice";

import { FundOverview } from "@/modules/budget/fund/FundOverview";
import BudgetRequestsPanel from "@/modules/budget/request/BudgetRequestsPanel";
import { TransactionHistory } from "@/modules/budget/fund/TransactionHistory";
import { AddFundDialog } from "@/modules/budget/fund/AddFundDialog";
import { CreateCategoryDialog } from "@/modules/budget/category/CreateCategoryDialog";
import CategoryList from "@/modules/budget/category/CategoryList";

import {
  Button,
} from "@/components/ui/button";
import {
  Input,
} from "@/components/ui/input";
import {
  Checkbox,
} from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Skeleton,
} from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Plus, Wallet, CheckCircle } from "lucide-react";

// ========================================
// PERFECT SINGLE FILE - ZERO INFINITE API
// PURE JS - FULL SKELETONS - NO DEPENDENCIES
// ========================================

export default function ProjectBudgetWrapper({ projectId, projectName }) {
  const dispatch = useDispatch();
  
  // SIMPLE SELECTOR - NO SHALLOW EQUAL
  const budgetState = useSelector((state) => state.budget);
  const { projectAccounts = [], loading } = budgetState;
  const BudgetAccount = projectAccounts[0] || null;

  // ========================================
  // DIALOG STATES
  // ========================================
  const [addFundDialogOpen, setAddFundDialogOpen] = useState(false);
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] = useState(false);
  const [openCreateAccountDialog, setOpenCreateAccountDialog] = useState(false);
  const [initialBudget, setInitialBudget] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [creating, setCreating] = useState(false);

  // ========================================
  // CHART STATES - SIMPLE
  // ========================================
  const [timeRange, setTimeRange] = useState("90d");

  // STATIC - NO RECREATE
  const CHART_CONFIG = {
    categories: { label: "Categories", color: "#16a34a" },
    transactions: { label: "Transactions", color: "#22c55e" },
    requests: { label: "Requests", color: "#4ade80" },
  };

  // ========================================
  // SINGLE API CALL - NEVER INFINITE
  // ========================================
  useEffect(() => {
    // ONLY CALL ONCE - NO DEPENDENCIES
    if (projectId && projectAccounts.length === 0) {
      dispatch(fetchBudgetAccountsByProject(projectId));
    }
  }, []); // EMPTY DEPENDENCY ARRAY = RUNS ONCE

  // ========================================
  // CREATE ACCOUNT - SIMPLE
  // ========================================
  const handleCreateBudgetAccount = async () => {
    if (!initialBudget || !agreed) return;
    const amount = parseFloat(initialBudget);
    if (isNaN(amount) || amount <= 0) return;

    setCreating(true);
    
    try {
      await dispatch(
        createBudgetAccount({
          projectId,
          accountData: { initialAmount: amount },
        })
      ).unwrap();
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setOpenCreateAccountDialog(false);
        setInitialBudget("");
        setAgreed(false);
      }, 1500);
    } catch (err) {
      alert(err.message || "Failed to create account");
    } finally {
      setCreating(false);
    }
  };

  // ========================================
  // CHART DATA - SIMPLE MEMO
  // ========================================
  const chartData = useMemo(() => {
    if (!BudgetAccount || loading) return [{ date: "2025-01-01", categories: 0, transactions: 0, requests: 0 }];
    
    const endDate = new Date();
    const startDate = new Date(endDate);
    const days = { "7d": 7, "30d": 30, "90d": 90 }[timeRange];
    startDate.setDate(endDate.getDate() - days);
    
    const dateMap = new Map();
    
    // Simple data processing
    const allItems = [...(BudgetAccount.categories || []), ...(BudgetAccount.transactions || []), ...(BudgetAccount.requests || [])];
    
    allItems.forEach((item) => {
      const date = new Date(item.createdAt || item.created_at);
      if (date >= startDate && date <= endDate) {
        const key = date.toISOString().split("T")[0];
        const current = dateMap.get(key) || { date: key, categories: 0, transactions: 0, requests: 0 };
        if (item.category) dateMap.set(key, { ...current, categories: current.categories + 1 });
        if (item.amount) dateMap.set(key, { ...current, transactions: current.transactions + 1 });
        if (item.requestId) dateMap.set(key, { ...current, requests: current.requests + 1 });
      }
    });
    
    // Fill dates
    let current = new Date(startDate);
    while (current <= endDate) {
      const key = current.toISOString().split("T")[0];
      if (!dateMap.has(key)) dateMap.set(key, { date: key, categories: 0, transactions: 0, requests: 0 });
      current.setDate(current.getDate() + 1);
    }
    
    return Array.from(dateMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [BudgetAccount, timeRange, loading]);

  // STATIC GRADIENTS
  const gradients = (
    <>
      <linearGradient id="fillCategories" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#16a34aff" stopOpacity="1" />
        <stop offset="95%" stopColor="#16a34aff" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="fillTransactions" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#22c55eff" stopOpacity="0.8" />
        <stop offset="95%" stopColor="#22c55eff" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#4ade80ff" stopOpacity="0.6" />
        <stop offset="95%" stopColor="#4ade80ff" stopOpacity="0.1" />
      </linearGradient>
    </>
  );

  // STATIC AREAS
  const areas = (
    <>
      <Area dataKey="requests" type="natural" fill="url(#fillRequests)" stroke="#4ade80ff" stackId="a" />
      <Area dataKey="transactions" type="natural" fill="url(#fillTransactions)" stroke="#22c55eff" stackId="a" />
      <Area dataKey="categories" type="natural" fill="url(#fillCategories)" stroke="#16a34aff" stackId="a" />
    </>
  );

  // ========================================
  // FULL PAGE SKELETON
  // ========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* ACTION BUTTONS SKELETON */}
        <div className="flex justify-end gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>

        {/* ROW 1: CHART SKELETON */}
        <Card className="h-[300px]">
          <CardHeader className="pb-3 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <div className="flex justify-end">
              <Skeleton className="h-7 w-24" />
            </div>
          </CardHeader>
          <CardContent className="px-3 pt-2">
            <Skeleton className="h-full rounded-xl" />
          </CardContent>
        </Card>

        {/* ROW 2: 2-COLUMNS SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="h-[400px]">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card className="h-[400px]">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ROW 3: TABS SKELETON */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ========================================
  // EMPTY STATE
  // ========================================
  if (!BudgetAccount) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 p-4 text-center">
        <h1 className="text-2xl font-bold">{projectName || "Project"}</h1>
        <p className="text-muted-foreground">Client Budget INR: 50cr</p>
        <Button onClick={() => setOpenCreateAccountDialog(true)}>
          Create Budget Account
        </Button>

        {openCreateAccountDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-md w-96 space-y-4">
              <h2 className="text-xl font-bold">Create Project Budget Account</h2>
              
              {!success ? (
                <>
                  <Input
                    type="number"
                    placeholder="Initial Budget Amount in INR"
                    value={initialBudget}
                    onChange={(e) => setInitialBudget(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox checked={agreed} onCheckedChange={setAgreed} />
                    <span>I agree to create this account</span>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpenCreateAccountDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateBudgetAccount}
                      disabled={!agreed || !initialBudget || creating}
                    >
                      {creating ? "Creating..." : "Create Account"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                  <p className="text-green-600 font-medium">Budget Account Created!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========================================
  // MAIN LAYOUT - NO SKELETONS
  // ========================================
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-end gap-2">
        <Button onClick={() => setAddFundDialogOpen(true)}>
          <Wallet className="h-4 w-4 mr-2" />
          Add Funds
        </Button>
        <Button onClick={() => setCreateCategoryDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* ROW 1: CHART */}
      <Card className="h-[300px]">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-sm font-medium">Budget Activity</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Categories, transactions, and requests over time
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-24 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90d" className="text-xs">3 months</SelectItem>
                <SelectItem value="30d" className="text-xs">30 days</SelectItem>
                <SelectItem value="7d" className="text-xs">7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-3 pt-2 h-[calc(100%-3.75rem)]">
          <ChartContainer config={CHART_CONFIG} className="h-full w-full">
            <AreaChart data={chartData}>
              <defs>{gradients}</defs>
              <CartesianGrid vertical={false} strokeOpacity={0.3} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                fontSize={10}
                minTickGap={25}
                tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    indicator="dot"
                    classNames={{ label: "text-xs" }}
                  />
                }
              />
              {areas}
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* ROW 2: 2-COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[400px]">
          <CardContent className="p-6 h-full">
            <FundOverview
              BudgetAccount={BudgetAccount}
              mainAccount={BudgetAccount.balance || 0}
              totalAllocated={BudgetAccount.totalAllocated || 0}
              totalSpent={BudgetAccount.totalSpent || 0}
            />
          </CardContent>
        </Card>

        <Card className="h-[400px]">
          <CardContent className="p-6 h-full">
            <TransactionHistory
              transactions={BudgetAccount.transactions}
              projectId={projectId}
            />
          </CardContent>
        </Card>
      </div>

      {/* ROW 3: TABS */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="categories" className="space-y-2">
            <TabsList>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            <TabsContent value="categories" className="p-6">
              <CategoryList BudgetAccount={BudgetAccount} projectId={projectId} />
            </TabsContent>
            <TabsContent value="requests" className="p-6">
              <BudgetRequestsPanel projectId={projectId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* DIALOGS */}
      <AddFundDialog
        accountId={BudgetAccount.accountId}
        open={addFundDialogOpen}
        onOpenChange={setAddFundDialogOpen}
      />
      <CreateCategoryDialog
        BudgetAccount={BudgetAccount}
        open={createCategoryDialogOpen}
        onOpenChange={setCreateCategoryDialogOpen}
        onCreateCategory={() => {}}
        availableFunds={BudgetAccount.balance || 0}
      />
    </div>
  );
}