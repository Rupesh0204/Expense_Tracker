import { TrendingUp, PieChart, Calendar } from "lucide-react";

export interface Expense {
  _id?: string;
  id?: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

interface SummaryProps {
  expenses: Expense[];
}

export default function Summary({ expenses }: SummaryProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter for current month’s expenses
  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  // Total spent this month
  const totalMonthly = monthlyExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  // Totals grouped by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + Number(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-orange-500",
      Travel: "bg-blue-500",
      Entertainment: "bg-pink-500",
      Shopping: "bg-purple-500",
      Bills: "bg-red-500",
      Healthcare: "bg-green-500",
      Education: "bg-cyan-500",
      Other: "bg-slate-500",
    };
    return colors[category] || colors["Other"];
  };

  const monthName = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Monthly Summary Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">Monthly Total</h3>
          </div>
        </div>
        <p className="text-4xl font-bold mb-2">{formatAmount(totalMonthly)}</p>
        <p className="text-emerald-100 text-sm">{monthName}</p>
        <div className="mt-4 pt-4 border-t border-white border-opacity-20">
          <p className="text-sm text-emerald-100">
            {monthlyExpenses.length}{" "}
            {monthlyExpenses.length === 1 ? "transaction" : "transactions"} this
            month
          </p>
        </div>
      </div>

      {/* Top Categories Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <PieChart className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            Top Categories
          </h3>
        </div>

        {sortedCategories.length > 0 ? (
          <div className="space-y-4">
            {sortedCategories.map(([category, amount]) => {
              const percentage =
                totalMonthly > 0 ? (amount / totalMonthly) * 100 : 0;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      {category}
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {formatAmount(amount)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${getCategoryColor(
                        category
                      )} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No data to display yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
