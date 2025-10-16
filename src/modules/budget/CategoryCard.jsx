

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Plus, ChevronDown, ChevronUp } from "lucide-react";
// import { AddEntityDialog } from "./AddEntityDialog"; // import your dialog

// export function CategoryCard({BudgetAccount}) {
//   const dummyCategories = [
//     {
//       id: "cat-1",
//       name: "Operations Fund",
//       allocated: 5000,
//       spent: 2000,
//       entities: [
//         { id: "e1", name: "Laptop Purchase", amount: 1000, date: "2025-10-10" },
//         { id: "e2", name: "Office Rent", amount: 1000, date: "2025-10-12" },
//       ],
//     },
//     {
//       id: "cat-2",
//       name: "Marketing",
//       allocated: 3000,
//       spent: 1500,
//       entities: [
//         { id: "e3", name: "Facebook Ads", amount: 500, date: "2025-10-11" },
//         { id: "e4", name: "Google Ads", amount: 1000, date: "2025-10-13" },
//       ],
//     },
//     {
//       id: "cat-3",
//       name: "R&D",
//       allocated: 2000,
//       spent: 500,
//       entities: [
//         { id: "e5", name: "Prototype", amount: 500, date: "2025-10-14" },
//       ],
//     },
//   ];

//   const [categories, setCategories] = useState(dummyCategories);
//   const [expandedCategories, setExpandedCategories] = useState({});
//   const [addEntityDialogOpen, setAddEntityDialogOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const formatCurrency = (amount) =>
//     new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);

//   const toggleExpand = (categoryId) => {
//     setExpandedCategories((prev) => ({
//       ...prev,
//       [categoryId]: !prev[categoryId],
//     }));
//   };

//   const handleOpenAddEntity = (category) => {
//     setSelectedCategory(category);
//     setAddEntityDialogOpen(true);
//   };

//   const handleAddEntity = (categoryId, name, amount, payee, method) => {
//     setCategories((prev) =>
//       prev.map((cat) =>
//         cat.id === categoryId
//           ? {
//               ...cat,
//               spent: cat.spent + amount,
//               entities: [
//                 ...cat.entities,
//                 { id: `e-${Date.now()}`, name, amount, date: new Date().toISOString().split("T")[0], payee, method },
//               ],
//             }
//           : cat
//       )
//     );
//   };

//   return (
//     <div className="space-y-4">
//       {categories.map((category) => {
//         const remaining = category.allocated - category.spent;
//         const progress = category.allocated > 0 ? (category.spent / category.allocated) * 100 : 0;
//         const isExpanded = expandedCategories[category.id] || false;

//         return (
//           <Card key={category.id}>
//             <CardHeader>
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <CardTitle>{category.name}</CardTitle>
//                   <div className="flex gap-4 mt-3">
//                     <div>
//                       <p className="text-xs text-muted-foreground">Allocated</p>
//                       <p className="text-sm">{formatCurrency(category.allocated)}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Spent</p>
//                       <p className="text-sm">{formatCurrency(category.spent)}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">Remaining</p>
//                       <p className="text-sm">{formatCurrency(remaining)}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <Button variant="outline" size="sm" onClick={() => handleOpenAddEntity(category)}>
//                   <Plus className="h-4 w-4 mr-1" />
//                   Add Entity
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Progress</span>
//                   <span>{progress.toFixed(1)}%</span>
//                 </div>
//                 <Progress value={progress} />

//                 {category.entities.length > 0 && (
//                   <div className="mt-4">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="w-full justify-between"
//                       onClick={() => toggleExpand(category.id)}
//                     >
//                       <span>{category.entities.length} Entities</span>
//                       {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//                     </Button>

//                     {isExpanded && (
//                       <div className="mt-2 space-y-2">
//                         {category.entities.map((entity) => (
//                           <div
//                             key={entity.id}
//                             className="flex items-center justify-between p-2 rounded-md bg-muted/50"
//                           >
//                             <div>
//                               <p className="text-sm">{entity.name}</p>
//                               <p className="text-xs text-muted-foreground">{entity.date}</p>
//                             </div>
//                             <Badge variant="secondary">{formatCurrency(entity.amount)}</Badge>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         );
//       })}

//       {/* AddEntityDialog */}
//       {selectedCategory && (
//         <AddEntityDialog
//         BudgetAccount={BudgetAccount}
//           open={addEntityDialogOpen}
//           onOpenChange={setAddEntityDialogOpen}
//           categoryId={selectedCategory.id}
//           categoryName={selectedCategory.name}
//           categoryRemaining={selectedCategory.allocated - selectedCategory.spent}
//           onAddEntity={handleAddEntity}
//         />
//       )}
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { AddEntityDialog } from "./AddEntityDialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchBudgetCategories } from "@/features/budget/budgetCategorySlice";

export function CategoryCard({ BudgetAccount }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.budgetCategory.categories);

  const [expandedCategories, setExpandedCategories] = useState({});
  const [addEntityDialogOpen, setAddEntityDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggleExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleOpenAddEntity = (category) => {
    setSelectedCategory(category);
    setAddEntityDialogOpen(true);
  };

  useEffect(() => {
    if (BudgetAccount?.accountId) {
      dispatch(fetchBudgetCategories(BudgetAccount.accountId));
    }
  }, [BudgetAccount?.accountId, dispatch]);

  return (
    <div className="space-y-4">
      {categories && categories.length > 0 ? (
        categories.map((category) => {
          const isExpanded = expandedCategories[category._id] || false;
          const entityCount = category.entityIds?.length || 0;

          return (
            <Card key={category._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{category.name}</CardTitle>
                   {/* <p className="text-xs text-muted-foreground mt-1 max-h-24 overflow-y-auto break-words">
  {category.description || "No description"}
</p> */}

                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenAddEntity(category)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Entity
                  </Button>
                </div>
              </CardHeader>

              {entityCount >= 0 && (
                <CardContent>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => toggleExpand(category._id)}
                  >
                    <span>{entityCount} Entities</span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  {isExpanded && (
                    <div className="mt-2 space-y-2">
                      {category.entityIds.map((entityId) => (
                        <div
                          key={entityId}
                          className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                        >
                          <p className="text-sm">{entityId}</p>
                          <Badge variant="secondary">Entity</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })
      ) : (
        <p className="text-sm text-muted-foreground">No categories available.</p>
      )}

      {selectedCategory && (
        <AddEntityDialog
          BudgetAccount={BudgetAccount}
          open={addEntityDialogOpen}
          onOpenChange={setAddEntityDialogOpen}
          categoryId={selectedCategory._id}
          categoryName={selectedCategory.name}
        />
      )}
    </div>
  );
}
