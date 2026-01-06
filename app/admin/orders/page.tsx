import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrdersTable } from "./orders-table"

interface OrderWithItems {
  id: string
  user_id: string
  total_amount: number
  status: string
  created_at: string
  profiles: {
    full_name?: string
    avatar_url?: string
  } | null
  order_items: Array<{
    id: string
    quantity: number
    price_at_purchase: number
    products: {
      name: string
      image_url?: string
    } | null
  }>
}

async function getOrders(): Promise<OrderWithItems[]> {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      user_id,
      total_amount,
      status,
      created_at,
      profiles:user_id (
        full_name,
        avatar_url
      ),
      order_items (
        id,
        quantity,
        price_at_purchase,
        products (
          name,
          image_url
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', JSON.stringify(error, null, 2))
    throw error
  }

  // Handle the join structure which might return objects instead of arrays depending on relationship
  return (orders as any[] || []).map(order => ({
    ...order,
    profiles: Array.isArray(order.profiles) ? order.profiles[0] : order.profiles,
    order_items: (order.order_items || []).map((item: any) => ({
      ...item,
      products: Array.isArray(item.products) ? item.products[0] : item.products
    }))
  })) as OrderWithItems[]
}


export default async function AdminOrdersPage() {
  try {
    const orders = await getOrders()

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-950 uppercase italic tracking-tight">Orders</h2>
            <p className="text-slate-500 font-medium">Manage customer orders and fulfillment.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">
              Total Orders: <span className="font-bold text-slate-900">{orders?.length || 0}</span>
            </div>
          </div>
        </div>

        <OrdersTable orders={orders} />
      </div>
    )
  } catch (error: any) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-950 uppercase italic tracking-tight">Orders</h2>
            <p className="text-slate-500 font-medium">Manage customer orders and fulfillment.</p>
          </div>
        </div>

        <Card className="border-violet-100 shadow-sm">
          <CardContent className="text-center py-12">
            <p className="text-red-500">Error loading orders: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }
}