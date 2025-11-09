import { useState, useEffect } from "react";
import { Plus, LogOut, Wallet, RefreshCw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AddExpenseModal from "./AddExpenseModal";
import EditExpenseModal from "./EditExpenseModal";
import ExpenseList from "./ExpenseList";
import Summary from "./Summary";
import { Expense } from "../types/Expense"; // unified type file recommended

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // -----------------------------------------------------
  // FETCH EXPENSES
  // -----------------------------------------------------
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found. User not logged in.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch expenses");

      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      alert("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // -----------------------------------------------------
  // DELETE EXPENSE
  // -----------------------------------------------------
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete expense");

      await fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense");
    }
  };

  // -----------------------------------------------------
  // EDIT EXPENSE (open modal)
  // -----------------------------------------------------
  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  // -----------------------------------------------------
  // Refresh on success (after add/edit)
  // -----------------------------------------------------
  const handleSuccess = () => {
    fetchExpenses();
  };

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-3 rounded-xl shadow-lg">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Expense Tracker
                </h1>
                <p className="text-slate-600 text-sm mt-1">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchExpenses}
                className="p-3 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Summary Section */}
        <Summary expenses={expenses} />

        {/* Expense List Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">All Expenses</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-500/30"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-500">Loading expenses...</p>
            </div>
          ) : (
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <EditExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleSuccess}
        expense={selectedExpense}
      />
    </div>
  );
}
