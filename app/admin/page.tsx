import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Package, ShoppingCart, DollarSign } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch summary stats
  const { count: productCount } = await supabase.from("products").select("*", { count: "exact", head: true })
  const { count: orderCount } = await supabase.from("orders").select("*", { count: "exact", head: true })
  const { data: salesData } = await supabase.from("orders").select("total_amount")

  const totalRevenue = salesData?.reduce((sum: number, order: any) => sum + Number(order.total_amount), 0) || 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-950 uppercase italic tracking-tight">Overview</h2>
        <p className="text-slate-500 font-medium">Real-time performance of your F1 store.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-violet-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-violet-950 italic">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-slate-400 mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-violet-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-violet-950 italic">{orderCount || 0}</div>
            <p className="text-xs text-slate-400 mt-1">+4 new today</p>
          </CardContent>
        </Card>
        <Card className="border-violet-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Live Products</CardTitle>
            <Package className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-violet-950 italic">{productCount || 0}</div>
            <p className="text-xs text-slate-400 mt-1">Across 4 categories</p>
          </CardContent>
        </Card>
        <Card className="border-violet-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Top Team</CardTitle>
            <Trophy className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-violet-950 italic uppercase">Red Bull</div>
            <p className="text-xs text-slate-400 mt-1">45% of total sales</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-violet-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold uppercase italic">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-400 italic">No sales yet. Get on the starting grid!</div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-violet-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold uppercase italic">Inventory Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-400 italic">All items well stocked.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
