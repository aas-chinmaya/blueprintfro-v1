import { useState } from "react";
import { FundOverview } from "./FundOverview";
import { CategoryCard } from "./CategoryCard";
import { BudgetRequestsPanel } from "./BudgetRequestsPanel";
import { TransactionHistory } from "./TransactionHistory";
import { AddFundDialog } from "./AddFundDialog";
import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { AddEntityDialog } from "./AddEntityDialog";
import { CreateBudgetRequestDialog } from "./CreateBudgetRequestDialog";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Plus, Wallet } from "lucide-react";
import type {
  FundManagementState,
  Category,
  BudgetRequest,
  Transaction,
  Entity,
} from "./fund-management";

export default function App() {
  const [state, setState] = useState<FundManagementState>({
    mainAccount: 100000,
    categories: [
      {
        id: "1",
        name: "Development",
        allocated: 30000,
        spent: 18500,
        entities: [
          {
            id: "e1",
            name: "Backend API Development",
            amount: 12000,
            date: "2025-10-01",
          },
          {
            id: "e2",
            name: "Frontend Development",
            amount: 6500,
            date: "2025-10-05",
          },
        ],
      },
      {
        id: "2",
        name: "Testing",
        allocated: 15000,
        spent: 8200,
        entities: [
          {
            id: "e3",
            name: "QA Testing Services",
            amount: 5000,
            date: "2025-10-03",
          },
          {
            id: "e4",
            name: "Automated Testing Tools",
            amount: 3200,
            date: "2025-10-08",
          },
        ],
      },
      {
        id: "3",
        name: "Marketing",
        allocated: 25000,
        spent: 14300,
        entities: [
          {
            id: "e5",
            name: "Social Media Campaigns",
            amount: 8000,
            date: "2025-10-02",
          },
          {
            id: "e6",
            name: "Content Creation",
            amount: 6300,
            date: "2025-10-07",
          },
        ],
      },
      {
        id: "4",
        name: "Operations",
        allocated: 20000,
        spent: 11200,
        entities: [
          {
            id: "e7",
            name: "Cloud Infrastructure",
            amount: 7500,
            date: "2025-10-04",
          },
          {
            id: "e8",
            name: "Office Supplies",
            amount: 3700,
            date: "2025-10-09",
          },
        ],
      },
    ],
    budgetRequests: [
      {
        id: "r1",
        title: "Q4 Marketing Expansion",
        description:
          "Additional budget needed for holiday season marketing campaigns",
        requestedAmount: 15000,
        currency: "USD",
        status: "Pending",
        requestedBy: "Marketing Team",
        date: "2025-10-12",
      },
      {
        id: "r2",
        title: "Development Tools License",
        description:
          "Annual renewal for development software licenses",
        requestedAmount: 85000,
        currency: "INR",
        status: "Approved",
        requestedBy: "Dev Team",
        date: "2025-10-10",
      },
    ],
    transactions: [
      {
        id: "t1",
        amount: 100000,
        type: "Add Fund",
        status: "Success",
        method: "Bank Transfer",
        payee: "Initial Investment",
        date: "2025-09-30",
        time: "09:00 AM",
      },
      {
        id: "t2",
        amount: 30000,
        type: "Allocate",
        status: "Success",
        method: "Bank Transfer",
        payee: "System",
        category: "Development",
        date: "2025-10-01",
        time: "10:15 AM",
      },
      {
        id: "t3",
        amount: 12000,
        type: "Spend",
        status: "Success",
        method: "UPI",
        payee: "Vendor A",
        category: "Development",
        date: "2025-10-01",
        time: "02:30 PM",
      },
      {
        id: "t4",
        amount: 15000,
        type: "Allocate",
        status: "Success",
        method: "Bank Transfer",
        payee: "System",
        category: "Testing",
        date: "2025-10-03",
        time: "11:00 AM",
      },
      {
        id: "t5",
        amount: 5000,
        type: "Spend",
        status: "Success",
        method: "Card",
        payee: "QA Services Inc",
        category: "Testing",
        date: "2025-10-03",
        time: "03:45 PM",
      },
    ],
  });

  const [addFundDialogOpen, setAddFundDialogOpen] =
    useState(false);
  const [
    createCategoryDialogOpen,
    setCreateCategoryDialogOpen,
  ] = useState(false);
  const [addEntityDialogOpen, setAddEntityDialogOpen] =
    useState(false);
  const [createRequestDialogOpen, setCreateRequestDialogOpen] =
    useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | null
  >(null);

  const totalAllocated = state.categories.reduce(
    (sum, cat) => sum + cat.allocated,
    0,
  );
  const totalSpent = state.categories.reduce(
    (sum, cat) => sum + cat.spent,
    0,
  );
  const availableFunds = state.mainAccount - totalSpent;

  const handleAddFund = (
    amount: number,
    method: string,
    source: string,
  ) => {
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      amount,
      type: "Add Fund",
      status: "Success",
      method: method as Transaction["method"],
      payee: source,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setState({
      ...state,
      mainAccount: state.mainAccount + amount,
      transactions: [newTransaction, ...state.transactions],
    });
  };

  const handleCreateCategory = (
    name: string,
    allocatedAmount: number,
  ) => {
    const newCategory: Category = {
      id: `cat${Date.now()}`,
      name,
      allocated: allocatedAmount,
      spent: 0,
      entities: [],
    };

    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      amount: allocatedAmount,
      type: "Allocate",
      status: "Success",
      method: "Bank Transfer",
      payee: "System",
      category: name,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setState({
      ...state,
      categories: [...state.categories, newCategory],
      transactions: [newTransaction, ...state.transactions],
    });
  };

  const handleAddEntity = (
    categoryId: string,
    name: string,
    amount: number,
    payee: string,
    method: string,
  ) => {
    const newEntity: Entity = {
      id: `e${Date.now()}`,
      name,
      amount,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    };

    const updatedCategories = state.categories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            spent: cat.spent + amount,
            entities: [...cat.entities, newEntity],
          }
        : cat,
    );

    const category = state.categories.find(
      (c) => c.id === categoryId,
    );

    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      amount,
      type: "Spend",
      status: "Success",
      method: method as Transaction["method"],
      payee,
      category: category?.name,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setState({
      ...state,
      categories: updatedCategories,
      transactions: [newTransaction, ...state.transactions],
    });
  };

  const handleCreateRequest = (
    title: string,
    description: string,
    requestedAmount: number,
    currency: "INR" | "USD",
    requestedBy: string,
  ) => {
    const newRequest: BudgetRequest = {
      id: `r${Date.now()}`,
      title,
      description,
      requestedAmount,
      currency,
      status: "Pending",
      requestedBy,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    };

    setState({
      ...state,
      budgetRequests: [newRequest, ...state.budgetRequests],
    });
  };

  const handleUpdateRequestStatus = (
    id: string,
    status: "Approved" | "Rejected",
  ) => {
    const updatedRequests = state.budgetRequests.map((req) =>
      req.id === id ? { ...req, status } : req,
    );

    setState({
      ...state,
      budgetRequests: updatedRequests,
    });
  };

  const handleOpenAddEntity = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setAddEntityDialogOpen(true);
  };

  const selectedCategory = state.categories.find(
    (cat) => cat.id === selectedCategoryId,
  );

  return (
    <div className="min-h-screen bg-background ">
      <div className=" mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>Fund Management System</h1>
            <p className="text-muted-foreground">
              Track and manage your project budget across
              categories
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setAddFundDialogOpen(true)}>
              <Wallet className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
            <Button
              onClick={() => setCreateCategoryDialogOpen(true)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </div>
        </div>

        <FundOverview
          mainAccount={state.mainAccount}
          totalAllocated={totalAllocated}
          totalSpent={totalSpent}
        />

        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">
              Categories
            </TabsTrigger>
            <TabsTrigger value="requests">
              Budget Requests
            </TabsTrigger>
            <TabsTrigger value="transactions">
              Transaction History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {state.categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onAddEntity={handleOpenAddEntity}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <BudgetRequestsPanel
              budgetRequests={state.budgetRequests}
              onCreateRequest={() =>
                setCreateRequestDialogOpen(true)
              }
              onUpdateRequestStatus={handleUpdateRequestStatus}
            />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionHistory
              transactions={state.transactions}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AddFundDialog
        open={addFundDialogOpen}
        onOpenChange={setAddFundDialogOpen}
        onAddFund={handleAddFund}
      />

      <CreateCategoryDialog
        open={createCategoryDialogOpen}
        onOpenChange={setCreateCategoryDialogOpen}
        onCreateCategory={handleCreateCategory}
        availableFunds={availableFunds}
      />

      <AddEntityDialog
        open={addEntityDialogOpen}
        onOpenChange={setAddEntityDialogOpen}
        categoryId={selectedCategoryId}
        categoryName={selectedCategory?.name || ""}
        categoryRemaining={
          selectedCategory
            ? selectedCategory.allocated -
              selectedCategory.spent
            : 0
        }
        onAddEntity={handleAddEntity}
      />

      <CreateBudgetRequestDialog
        open={createRequestDialogOpen}
        onOpenChange={setCreateRequestDialogOpen}
        onCreateRequest={handleCreateRequest}
      />
    </div>
  );
}