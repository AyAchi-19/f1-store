"use client"

import type React from "react"

import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { CreditCard, Truck, CheckCircle2, Phone, MapPin, Globe, ExternalLink } from "lucide-react"

export function CheckoutForm({ user }: { user: any }) {
  const { items, totalPrice, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Shipping details state
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    mapsLink: ''
  })

  const router = useRouter()
  const supabase = createClient()

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setIsProcessing(true)

    try {
      // 1. Create Order with all shipping details
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          status: "pending",
          phone: shippingDetails.phone,
          city: shippingDetails.city,
          shipping_address: shippingDetails.address,
          maps_link: shippingDetails.mapsLink
        })
        .select()
        .single()

      if (orderError) {
        console.error("Order creation error:", orderError)
        throw orderError
      }

      // 2. Create Order Items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
        // We omit size for now to match the current schema, 
        // or you can add a 'size' column to order_items in Supabase
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        console.error("Order items error:", itemsError)
        throw itemsError
      }

      // 3. Success
      toast.success("Order placed successfully! 🏁", {
        icon: "🏎️",
        style: {
          background: "#4c1d95",
          color: "#fff",
          fontWeight: "bold",
          padding: "16px",
          borderRadius: "12px"
        },
        duration: 4000,
      })
      clearCart()
      setIsSuccess(true)
    } catch (error: any) {
      console.error("Checkout Error:", error)

      toast.error(error.message || "Failed to place order. Please try again.", {
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "bold",
          padding: "16px",
          borderRadius: "12px"
        },
        duration: 5000,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase italic">Victory!</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Your order has been placed. You'll receive a confirmation email shortly. See you at the finish line!
        </p>
        <Button asChild className="bg-violet-600 hover:bg-violet-700 font-bold uppercase italic">
          <button onClick={() => router.push("/")}>Return to Store</button>
        </Button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
        <p className="text-slate-400 italic mb-4">Your garage is empty.</p>
        <Button asChild variant="outline" className="text-violet-600 border-violet-100 bg-transparent">
          <button onClick={() => router.push("/")}>Go Shop</button>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-violet-100 shadow-sm overflow-hidden rounded-3xl">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg font-bold uppercase italic flex items-center gap-2">
              <Truck size={20} className="text-violet-600" /> Shipping Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Lewis Hamilton"
                  className="bg-slate-50 border-slate-100"
                  required
                  value={shippingDetails.fullName}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={user.email} disabled className="bg-slate-100 border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" /> Phone Number
                </Label>
                <Input
                  type="tel"
                  placeholder="+216 -- --- ---"
                  className="bg-slate-50 border-slate-100"
                  required
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe size={14} className="text-slate-400" /> City
                </Label>
                <Input
                  placeholder="Tunis, Sousse, etc."
                  className="bg-slate-50 border-slate-100"
                  required
                  value={shippingDetails.city}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400" /> Shipping Address
                </Label>
                <Input
                  placeholder="Street name, Apartment number, Floor..."
                  className="bg-slate-50 border-slate-100"
                  required
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Google Maps Link (Recommended)</Label>
                  <Button
                    variant="link"
                    type="button"
                    className="h-auto p-0 text-[10px] font-bold text-violet-600 uppercase italic flex items-center gap-1"
                    onClick={() => window.open('https://www.google.com/maps', '_blank')}
                  >
                    Open Google Maps <ExternalLink size={10} />
                  </Button>
                </div>
                <Input
                  placeholder="Paste your Google Maps location link here for faster delivery"
                  className="bg-violet-50/50 border-violet-100 text-sm"
                  value={shippingDetails.mapsLink}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, mapsLink: e.target.value })}
                />
                <p className="text-[10px] text-slate-400 italic">Finding your exact spot helps our delivery team reach you at record speed! 🏎️</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-violet-100 shadow-sm overflow-hidden rounded-3xl">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg font-bold uppercase italic flex items-center gap-2">
              <CreditCard size={20} className="text-violet-600" /> Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100 mb-6">
              <p className="text-xs text-violet-700 font-medium">
                Your payment is processed securely via our encrypted payment gateway.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input placeholder="4242 4242 4242 4242" className="bg-slate-50 border-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input placeholder="MM/YY" className="bg-slate-50 border-slate-100" />
                </div>
                <div className="space-y-2">
                  <Label>CVC</Label>
                  <Input placeholder="123" className="bg-slate-50 border-slate-100" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="border-violet-100 shadow-lg shadow-violet-500/5 rounded-3xl sticky top-24">
          <CardHeader>
            <CardTitle className="text-lg font-bold uppercase italic tracking-tight">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${item.id}-${item.size || 'default'}`} className="flex justify-between text-sm">
                  <div className="flex flex-col flex-1 pr-4">
                    <span className="text-slate-600 line-clamp-1">
                      {item.name} <span className="text-xs font-bold text-slate-400 ml-1">x{item.quantity}</span>
                    </span>
                    {item.size && (
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Size: {item.size}</span>
                    )}
                  </div>
                  <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-900">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium text-green-600 uppercase text-xs font-bold tracking-widest">Free</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-black text-violet-950 italic uppercase">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-violet-600 hover:bg-violet-700 h-12 text-lg font-bold italic uppercase transition-all"
            >
              {isProcessing ? "Processing..." : "Complete Order"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
