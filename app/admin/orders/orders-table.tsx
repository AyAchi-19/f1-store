"use client"

import { useState, useMemo, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Package, Clock, CheckCircle, Truck, XCircle, Search, Filter } from "lucide-react"
import Link from "next/link"

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

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />
    case 'processing':
      return <Package className="h-4 w-4 text-blue-500" />
    case 'shipped':
      return <Truck className="h-4 w-4 text-orange-500" />
    case 'delivered':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

function getStatusBadge(status: string) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    'pending': 'outline',
    'processing': 'default',
    'shipped': 'secondary',
    'delivered': 'default',
    'cancelled': 'destructive'
  }

  return (
    <Badge variant={variants[status] || 'outline'} className="flex items-center gap-1">
      {getStatusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export function OrdersTable({ orders: initialOrders }: { orders: OrderWithItems[] }) {
  const [orders, setOrders] = useState<OrderWithItems[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('admin_orders_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async (payload) => {
          // If it's a new order or update, we fetch the full details for that order
          // to include the profiles and items which are not in the raw payload
          const { data: updatedOrder } = await supabase
            .from('orders')
            .select(`
              id,
              user_id,
              total_amount,
              status,
              created_at,
              profiles:user_id (full_name, avatar_url),
              order_items (
                id,
                quantity,
                price_at_purchase,
                products (name, image_url)
              )
            `)
            .eq('id', (payload.new as any)?.id || (payload.old as any)?.id)
            .single()

          if (updatedOrder) {
            const formatted = {
              ...updatedOrder,
              profiles: Array.isArray(updatedOrder.profiles) ? updatedOrder.profiles[0] : updatedOrder.profiles,
              order_items: (updatedOrder.order_items || []).map((item: any) => ({
                ...item,
                products: Array.isArray(item.products) ? item.products[0] : item.products
              }))
            }

            setOrders(current => {
              if (payload.eventType === 'INSERT') {
                return [formatted, ...current]
              }
              if (payload.eventType === 'UPDATE') {
                return current.map(o => o.id === formatted.id ? formatted : o)
              }
              if (payload.eventType === 'DELETE') {
                return current.filter(o => o.id !== (payload.old as any).id)
              }
              return current
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = !searchTerm ||
        order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, searchTerm, statusFilter])

  const statuses = ['all', ...Array.from(new Set(orders.map(order => order.status)))]

  return (
    <Card className="border-violet-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold uppercase italic">All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by customer email, name, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!filteredOrders || filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 italic">
              {searchTerm || statusFilter !== 'all' ? 'No orders match your filters.' : 'No orders yet. Get the race started!'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold uppercase text-xs tracking-wider">Order ID</TableHead>
                <TableHead className="font-bold uppercase text-xs tracking-wider">Customer</TableHead>
                <TableHead className="font-bold uppercase text-xs tracking-wider">Items</TableHead>
                <TableHead className="font-bold uppercase text-xs tracking-wider">Total</TableHead>
                <TableHead className="font-bold uppercase text-xs tracking-wider">Status</TableHead>
                <TableHead className="font-bold uppercase text-xs tracking-wider">Date</TableHead>
                <TableHead className="font-bold uppercase text-xs tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-slate-900">
                        {order.profiles?.full_name || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.order_items.slice(0, 2).map((item, index) => (
                        <div key={item.id} className="text-sm text-slate-600">
                          {item.products?.name || 'Unknown Product'} <span className="text-xs text-slate-400">x{item.quantity}</span>
                        </div>
                      ))}
                      {order.order_items.length > 2 && (
                        <div className="text-xs text-slate-400">
                          +{order.order_items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-violet-950 italic">
                    ${order.total_amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm" className="h-8">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
