import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BudgetRequest } from "./fund-management";
import { Clock, DollarSign, IndianRupee } from "lucide-react";

interface BudgetRequestsPanelProps {
  budgetRequests: BudgetRequest[];
  onCreateRequest: () => void;
  onUpdateRequestStatus: (id: string, status: 'Approved' | 'Rejected') => void;
}

export function BudgetRequestsPanel({
  budgetRequests,
  onCreateRequest,
  onUpdateRequestStatus,
}: BudgetRequestsPanelProps) {
  const formatCurrency = (amount: number, currency: 'INR' | 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'default';
      case 'Approved':
        return 'outline';
      case 'Rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Budget Requests</CardTitle>
          <Button onClick={onCreateRequest} size="sm">
            New Request
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {budgetRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No budget requests yet
            </p>
          ) : (
            budgetRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-lg border bg-card"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm mb-1">{request.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {request.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {request.currency === 'INR' ? (
                          <IndianRupee className="h-3 w-3" />
                        ) : (
                          <DollarSign className="h-3 w-3" />
                        )}
                        {formatCurrency(request.requestedAmount, request.currency)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {request.date}
                      </span>
                      <span>By {request.requestedBy}</span>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
                {request.status === 'Pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateRequestStatus(request.id, 'Approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateRequestStatus(request.id, 'Rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
