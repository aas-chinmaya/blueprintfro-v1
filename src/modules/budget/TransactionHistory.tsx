import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "./fund-management";
import { ArrowDownCircle, ArrowUpCircle, RefreshCw } from "lucide-react";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Add Fund':
        return <ArrowDownCircle className="h-4 w-4 text-green-600" />;
      case 'Spend':
        return <ArrowUpCircle className="h-4 w-4 text-red-600" />;
      case 'Allocate':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Add Fund':
        return 'outline';
      case 'Spend':
        return 'destructive';
      case 'Allocate':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No transactions yet
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <Badge variant={getTypeColor(transaction.type)} className="text-xs">
                          {transaction.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {transaction.method}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.payee}</TableCell>
                    <TableCell>
                      {transaction.category ? (
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{transaction.date}</div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.status === 'Success' ? 'outline' : 'destructive'}
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
