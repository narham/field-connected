import { useState } from "react";
import { CreditCard, CheckCircle2, Clock, AlertCircle, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const invoices = [
  { id: 1, player: "Ahmad Fauzi", month: "Maret 2026", amount: 350000, status: "paid", paidAt: "2 Mar 2026" },
  { id: 2, player: "Budi Santoso", month: "Maret 2026", amount: 350000, status: "pending", dueDate: "15 Mar 2026" },
  { id: 3, player: "Cahyo Prasetyo", month: "Maret 2026", amount: 350000, status: "overdue", dueDate: "1 Mar 2026" },
  { id: 4, player: "Dimas Ramadhan", month: "Maret 2026", amount: 350000, status: "paid", paidAt: "5 Mar 2026" },
  { id: 5, player: "Eko Wijaya", month: "Maret 2026", amount: 350000, status: "pending", dueDate: "15 Mar 2026" },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const statusConfig = {
  paid: { label: "Lunas", icon: CheckCircle2, variant: "default" as const, color: "text-primary" },
  pending: { label: "Menunggu", icon: Clock, variant: "secondary" as const, color: "text-warning" },
  overdue: { label: "Terlambat", icon: AlertCircle, variant: "destructive" as const, color: "text-destructive" },
};

const SSBPayments = () => {
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? invoices : invoices.filter((i) => i.status === tab);

  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">Pembayaran</h1>
        <Button size="sm" className="gap-1">
          <Plus className="w-4 h-4" /> Buat Tagihan
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="bg-secondary border-0">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Terbayar</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(totalPaid)}</p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-0">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Belum Bayar</p>
            <p className="text-lg font-bold text-destructive">{formatCurrency(totalPending)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">Semua</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
          <TabsTrigger value="overdue" className="flex-1">Terlambat</TabsTrigger>
          <TabsTrigger value="paid" className="flex-1">Lunas</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2 mt-4">
        {filtered.map((inv) => {
          const config = statusConfig[inv.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;
          return (
            <Card key={inv.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-secondary`}>
                  <StatusIcon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{inv.player}</p>
                  <p className="text-muted-foreground text-xs">{inv.month}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(inv.amount)}</p>
                  <Badge variant={config.variant} className="text-[10px]">{config.label}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SSBPayments;
