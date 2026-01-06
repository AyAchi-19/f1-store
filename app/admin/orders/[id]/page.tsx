"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Mail, Calendar, DollarSign, Package, Clock, CheckCircle, Truck, XCircle, Phone, MapPin, Globe, ExternalLink } from "lucide-react"
import { toast } from "react-hot-toast"

interface OrderWithDetails {
  id: string
  user_id: string
  total_amount: number
  status: string
  created_at: string
  phone?: string
  city?: string
  shipping_address?: string
  maps_link?: string
  profiles: {
    full_name?: string
    avatar_url?: string
  } | null
  order_items: Array<{
    id: string
    quantity: number
    price_at_purchase: number
    products: {
      id: string
      name: string
      image_url?: string
      description?: string
    } | null
  }>
}

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock },
  { value: 'processing', label: 'Processing', icon: Package },
  { value: 'shipped', label: 'Shipped', icon: Truck },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle },
]

function getStatusIcon(status: string) {
  const option = statusOptions.find(opt => opt.value === status)
  if (!option) return Clock
  return option.icon
}

function getStatusBadge(status: string) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    'pending': 'outline',
    'processing': 'default',
    'shipped': 'secondary',
    'delivered': 'default',
    'cancelled': 'destructive'
  }

  const Icon = getStatusIcon(status)

  return (
    <Badge variant={variants[status] || 'outline'} className="flex items-center gap-1">
      <Icon className="h-4 w-4" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    if (!params.id) return

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          total_amount,
          status,
          created_at,
          phone,
          city,
          shipping_address,
          maps_link,
          profiles:user_id (
            full_name,
            avatar_url
          ),
          order_items (
            id,
            quantity,
            price_at_purchase,
            products (
              id,
              name,
              image_url,
              description
            )
          )
        `)
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error fetching order:', error)
        toast.error('Failed to load order details')
        return
      }

      const formattedOrder = {
        ...data,
        profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
        order_items: (data.order_items || []).map((item: any) => ({
          ...item,
          products: Array.isArray(item.products) ? item.products[0] : item.products
        }))
      }

      setOrder(formattedOrder as OrderWithDetails)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return

    setUpdating(true)
    try {
      console.log(`Attempting to update order ${order.id} status to ${newStatus}`)
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id)

      if (error) {
        console.error('Database update error:', error)
        toast.error(`Failed: ${error.message || 'Check database permissions'}`)
        return
      }

      setOrder({ ...order, status: newStatus })
      toast.success(`Order status updated to ${newStatus}!`)
    } catch (error: any) {
      console.error('Unexpected error:', error)
      toast.error('Unexpected error during update')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="text-slate-500 mt-4">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-red-500">Order not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-black text-slate-950 uppercase italic tracking-tight">
          Order #{order.id.slice(0, 8)}
        </h2>
        <p className="text-slate-500 font-medium">Order details and management.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-violet-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold uppercase italic flex items-center justify-between">
                Order Summary
                {getStatusBadge(order.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="font-bold uppercase text-sm tracking-wider text-slate-500">Items Ordered</h4>
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                      {item.products?.image_url ? (
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-slate-900">{item.products?.name || 'Unknown Product'}</h5>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {item.products?.description || 'No description available'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">
                        ${item.price_at_purchase.toFixed(2)} × {item.quantity}
                      </div>
                      <div className="text-sm text-slate-500">
                        ${(item.price_at_purchase * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Order Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold uppercase italic text-slate-900">Total</span>
                <span className="text-2xl font-black text-violet-950 italic">${order.total_amount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Actions & Customer Info */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card className="border-violet-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold uppercase italic">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {statusOptions.map((status) => {
                  const Icon = status.icon
                  return (
                    <Button
                      key={status.value}
                      variant={order.status === status.value ? "default" : "outline"}
                      className="justify-start uppercase italic font-bold text-xs tracking-wider"
                      onClick={() => updateOrderStatus(status.value)}
                      disabled={updating}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {status.label}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="border-violet-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold uppercase italic">Customer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="font-medium text-slate-900">
                      {order.profiles?.full_name || 'N/A'}
                    </div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Full Name</div>
                  </div>
                </div>

                {order.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="font-medium text-slate-900">{order.phone}</div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phone</div>
                    </div>
                  </div>
                )}

                {order.city && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="font-medium text-slate-900">{order.city}</div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">City</div>
                    </div>
                  </div>
                )}

                {order.shipping_address && (
                  <div className="flex items-center gap-4 border-t pt-3">
                    <MapPin className="h-5 w-5 text-violet-600 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">{order.shipping_address}</div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Delivery Address</div>
                    </div>
                  </div>
                )}

                {order.maps_link && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-violet-200 text-violet-700 hover:bg-violet-50 font-bold uppercase italic text-[10px]"
                  >
                    <a href={order.maps_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={12} className="mr-2" />
                      View On Google Maps
                    </a>
                  </Button>
                )}

                <div className="flex items-center gap-3 border-t pt-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="font-medium text-slate-900 text-sm">
                      {new Date(order.created_at).toLocaleDateString()} at{' '}
                      {new Date(order.created_at).toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order Date</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="font-black text-violet-950 italic">
                      ${order.total_amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Charge</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
