import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DollarSign, Plus, Trash2, TrendingDown, TrendingUp, Calendar } from "lucide-react";
import { translations as t } from "@/lib/translations";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  description: string | null;
  expense_date: string;
  created_at: string;
}

const categories = [
  { value: "marketing", label: "تسويق" },
  { value: "operations", label: "عمليات" },
  { value: "prizes", label: "جوائز" },
  { value: "salaries", label: "رواتب" },
  { value: "technical", label: "تقني" },
  { value: "other", label: "أخرى" },
];

const getCategoryLabel = (value: string) => {
  return categories.find(c => c.value === value)?.label || value;
};

export function ExpensesTab() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "other",
    description: "",
    expense_date: new Date().toISOString().split('T')[0],
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const thisMonthExpenses = expenses
    .filter(e => {
      const expDate = new Date(e.expense_date);
      const now = new Date();
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount) {
      toast.error("يرجى إدخال العنوان والمبلغ");
      return;
    }

    try {
      const { error } = await supabase.from('expenses').insert({
        title: newExpense.title,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        description: newExpense.description || null,
        expense_date: newExpense.expense_date,
      });

      if (error) throw error;

      toast.success("تم إضافة المصروف بنجاح");
      setNewExpense({
        title: "",
        amount: "",
        category: "other",
        description: "",
        expense_date: new Date().toISOString().split('T')[0],
      });
      fetchExpenses();
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة المصروف");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
      toast.success("تم حذف المصروف");
      fetchExpenses();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalExpenses.toLocaleString()} {t.currency}</p>
                <p className="text-sm text-muted-foreground">إجمالي المصروفات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{thisMonthExpenses.toLocaleString()} {t.currency}</p>
                <p className="text-sm text-muted-foreground">مصروفات هذا الشهر</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{expenses.length}</p>
                <p className="text-sm text-muted-foreground">عدد العمليات</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Form */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            إضافة مصروف جديد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>العنوان</Label>
              <Input
                value={newExpense.title}
                onChange={(e) => setNewExpense(prev => ({ ...prev, title: e.target.value }))}
                placeholder="عنوان المصروف"
              />
            </div>
            <div className="space-y-2">
              <Label>المبلغ ({t.currency})</Label>
              <Input
                type="number"
                min="0"
                value={newExpense.amount}
                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>الفئة</Label>
              <Select 
                value={newExpense.category} 
                onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>التاريخ</Label>
              <Input
                type="date"
                value={newExpense.expense_date}
                onChange={(e) => setNewExpense(prev => ({ ...prev, expense_date: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddExpense} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                إضافة
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Label>الوصف (اختياري)</Label>
            <Textarea
              value={newExpense.description}
              onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
              placeholder="وصف إضافي..."
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            سجل المصروفات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الوصف</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      لا توجد مصروفات مسجلة
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.title}</TableCell>
                      <TableCell className="text-destructive font-bold">
                        -{expense.amount.toLocaleString()} {t.currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{getCategoryLabel(expense.category)}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(expense.expense_date).toLocaleDateString('ar-EG')}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {expense.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}