import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Category } from "./fund-management";
import { useState } from "react";

interface CategoryCardProps {
  category: Category;
  onAddEntity: (categoryId: string) => void;
}

export function CategoryCard({ category, onAddEntity }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const remaining = category.allocated - category.spent;
  const progress = category.allocated > 0 ? (category.spent / category.allocated) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{category.name}</CardTitle>
            <div className="flex gap-4 mt-3">
              <div>
                <p className="text-xs text-muted-foreground">Allocated</p>
                <p className="text-sm">{formatCurrency(category.allocated)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Spent</p>
                <p className="text-sm">{formatCurrency(category.spent)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="text-sm">{formatCurrency(remaining)}</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddEntity(category.id)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Entity
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} />
          
          {category.entities.length > 0 && (
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span>{category.entities.length} Entities</span>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              
              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {category.entities.map((entity) => (
                    <div
                      key={entity.id}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                    >
                      <div>
                        <p className="text-sm">{entity.name}</p>
                        <p className="text-xs text-muted-foreground">{entity.date}</p>
                      </div>
                      <Badge variant="secondary">{formatCurrency(entity.amount)}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
