"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react"

interface Order {
    id: string
    total_amount: number
    status: string
    created_at: string
}

function getStatusIcon(status: string) {
    switch (status) {
        case 'pending': return <Clock className="h-3 w-3" />
        case 'processing': return <Package className="h-3 w-3" />
        case 'shipped': return <Truck className="h-3 w-3" />
        case 'delivered': return <CheckCircle className="h-3 w-3" />
        case 'cancelled': return <XCircle className="h-3 w-3" />
        default: return <Clock className="h-3 w-3" />
    }
}

function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, string> = {
        'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'processing': 'bg-blue-100 text-blue-700 border-blue-200',
        'shipped': 'bg-orange-100 text-orange-700 border-orange-200',
        'delivered': 'bg-green-100 text-green-700 border-green-200',
        'cancelled': 'bg-red-100 text-red-700 border-red-200'
    }

    return (
        <Badge className={`${variants[status] || 'bg-slate-100 text-slate-700'} border flex items-center gap-1.5 font-bold uppercase italic text-[10px] py-1 px-2.5 rounded-full`}>
            {getStatusIcon(status)}
            {status}
        </Badge>
    )
}

export function UserOrdersList({ initialOrders, userId }: { initialOrders: Order[], userId: string }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const [isConnected, setIsConnected] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        console.log('Setting up Realtime for user:', userId)

        const channel = supabase
            .channel(`user_orders_${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen for ALL events (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: 'orders',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    console.log('Order change received:', payload)

                    if (payload.eventType === 'UPDATE') {
                        setOrders((current) =>
                            current.map((order) =>
                                order.id === payload.new.id ? { ...order, ...payload.new } : order
                            )
                        )
                    } else if (payload.eventType === 'INSERT') {
                        setOrders((current) => [payload.new as Order, ...current])
                    } else if (payload.eventType === 'DELETE') {
                        setOrders((current) => current.filter(o => o.id !== (payload.old as any).id))
                    }
                }
            )
            .subscribe((status) => {
                console.log('Realtime Status:', status)
                setIsConnected(status === 'SUBSCRIBED')
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, supabase])

    if (!orders || orders.length === 0) {
        return (
            <div className="text-center py-12">
                <Package className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 italic">No orders yet. Ready to join the grid?</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                        {isConnected ? 'Realtime Connected' : 'Connecting Store...'}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 px-1">
                <div className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">
                    {isConnected ? 'Live Track Status' : 'Connecting to Paddock...'}
                </span>
            </div>
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-violet-200 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-violet-50 transition-colors">
                            <Package className="h-6 w-6 text-slate-400 group-hover:text-violet-600 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-xs text-slate-500 font-medium">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between sm:text-right gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Status</p>
                            <StatusBadge status={order.status} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Total</p>
                            <p className="font-black text-violet-950 italic text-lg leading-none">${order.total_amount.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
