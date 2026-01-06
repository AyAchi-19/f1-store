"use client"

import type React from "react"
import Link from "next/link"
import { ShoppingBag, User, Trophy, LayoutDashboard, Flag, Shirt, Watch, Share2, Instagram, Twitter, Facebook, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { signOut } from "@/app/auth/actions"

export function StoreLayout({ children, user: initialUser }: { children: React.ReactNode; user: any }) {
  const { items, totalItems, totalPrice, removeItem } = useCart()
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      if (initialUser) {
        const { data } = await supabase.from("profiles").select("role").eq("id", initialUser.id).single()
        setProfile(data)
      }
    }
    fetchProfile()
  }, [initialUser])

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-violet-100 dark:selection:bg-violet-900/30">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-violet-50 rounded-xl w-10 h-10 text-slate-600">
                  <div className="flex flex-col gap-1 items-center">
                    <span className="w-5 h-0.5 bg-current rounded-full" />
                    <span className="w-5 h-0.5 bg-current rounded-full" />
                    <span className="w-5 h-0.5 bg-current rounded-full" />
                  </div>
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] flex flex-col border-r border-slate-100 shadow-2xl">
                <SheetHeader className="pb-8 border-b border-slate-100">
                  <SheetTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-slate-900">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 py-8">
                  {['Store', 'Apparel', 'Collectibles', 'Accessories'].map((item) => (
                    <Link
                      key={item}
                      href={item === "Store" ? "/" : `/category/${item}`}
                      className="text-lg font-black text-slate-900 hover:text-violet-600 transition-colors py-4 px-2 uppercase italic border-b border-slate-50"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-violet-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white overflow-hidden shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-700 to-violet-500 opacity-100 group-hover:opacity-90 transition-opacity" />
                <Trophy size={20} className="relative z-10 group-hover:scale-110 transition-transform duration-300 sm:hidden" />
                <Trophy size={26} className="relative z-10 group-hover:scale-110 transition-transform duration-300 hidden sm:block" />
              </div>
              <div className="flex flex-col -gap-0.5">
                <span className="text-lg sm:text-xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                  TUNISIA <span className="text-slate-950">F</span><span className="text-red-600">1</span><span className="text-slate-950">97</span>
                </span>
                <span className="text-[0.65rem] font-medium tracking-[0.2em] text-slate-500 uppercase leading-none mt-0.5">store</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Store', 'Apparel', 'Collectibles', 'Accessories'].map((item) => (
              <Link
                key={item}
                href={item === "Store" ? "/" : `/category/${item}`}
                className="relative text-sm font-bold text-slate-600 hover:text-violet-600 transition-colors py-2 uppercase tracking-wide group"
              >
                {item}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-violet-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            {profile?.role === "admin" && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden lg:flex text-violet-600 font-bold uppercase italic text-xs hover:bg-violet-50 hover:text-violet-700"
              >
                <Link href="/admin">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group hover:bg-violet-50 rounded-xl w-10 h-10 transition-all text-slate-600 hover:text-violet-600">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-violet-600 text-white border-2 border-white shadow-sm font-bold text-[10px] animate-in zoom-in">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md flex flex-col border-l border-slate-100 shadow-2xl">
                <SheetHeader className="pb-6 border-b border-slate-100">
                  <SheetTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-slate-900">
                    Pit Stop <Badge variant="secondary" className="ml-2 font-bold bg-violet-100 text-violet-700">{totalItems}</Badge>
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1 -mx-6 px-6">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <ShoppingBag size={40} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Your cart is empty</h3>
                      <p className="text-slate-500 font-medium text-sm mb-8 max-w-[200px]">
                        Looks like you haven't added any gear yet.
                      </p>
                      <Button asChild className="bg-slate-900 text-white hover:bg-violet-600 font-bold uppercase italic px-8 py-6 rounded-xl transition-all shadow-xl shadow-slate-200">
                        <Link href="/">Start Shopping</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col gap-8">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.size || 'default'}`} className="flex gap-4 group">
                          <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 group-hover:border-violet-200 transition-colors relative">
                            <img
                              src={item.image_url || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <h4 className="text-base font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{item.name}</h4>
                            {item.size && (
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Size: <span className="text-slate-700">{item.size}</span>
                              </span>
                            )}
                            <div className="flex items-end justify-between mt-auto">
                              <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                                <span className="text-xs font-bold text-slate-500 px-2">Qty: {item.quantity}</span>
                              </div>
                              <span className="text-lg font-black text-violet-600 italic">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="self-start -ml-2 -mt-1 h-8 text-red-500/70 hover:text-red-600 hover:bg-red-50 text-xs font-bold"
                              onClick={() => removeItem(item.id, item.size)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                {items.length > 0 && (
                  <div className="pt-6 space-y-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm font-medium text-slate-500">
                        <span>Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xl font-black text-slate-900 uppercase italic">
                        <span>Total</span>
                        <span className="text-violet-600">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button asChild className="w-full bg-violet-600 hover:bg-violet-700 h-14 text-lg rounded-xl font-bold uppercase italic shadow-lg shadow-violet-600/20 active:scale-95 transition-all">
                      <Link href="/checkout">Checkout Now</Link>
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="group hidden sm:flex hover:bg-violet-50 rounded-xl w-10 h-10 text-slate-600 hover:text-violet-600">
                  <User className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] flex flex-col border-l border-slate-100 shadow-2xl">
                <SheetHeader className="pb-6 border-b border-slate-100">
                  <SheetTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-slate-900">
                    User Account
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 py-6">
                  {initialUser ? (
                    <>
                      <div className="px-2 py-4 border-b border-slate-50 mb-4">
                        <p className="font-bold text-slate-900 truncate">{initialUser.email}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          {profile?.role === "admin" ? "Team Principal" : "Paddock Member"}
                        </p>
                      </div>
                      <Button asChild variant="ghost" className="justify-start font-bold uppercase italic text-xs h-12">
                        <Link href="/protected">
                          <User className="mr-2 h-4 w-4" /> My Profile
                        </Link>
                      </Button>
                      {profile?.role === "admin" && (
                        <Button asChild variant="ghost" className="justify-start font-bold uppercase italic text-xs h-12">
                          <Link href="/admin">
                            <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Panel
                          </Link>
                        </Button>
                      )}
                      <Separator className="my-2" />
                      <form action={signOut}>
                        <Button variant="ghost" className="w-full justify-start font-bold uppercase italic text-xs h-12 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button asChild className="bg-violet-600 hover:bg-violet-700 font-bold uppercase italic text-xs h-12">
                        <Link href="/auth/login">Login</Link>
                      </Button>
                      <Button asChild variant="outline" className="font-bold uppercase italic text-xs h-12">
                        <Link href="/auth/sign-up">Create Account</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-slate-950 text-slate-300 py-20 border-t border-slate-900">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-950 italic font-black shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform">
                F1
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white italic uppercase leading-none">
                  TUNISIA <span>F</span><span className="text-red-600">1</span><span>97</span>
                </span>
                <span className="text-xs font-medium tracking-[0.3em] text-slate-400 uppercase leading-none mt-1">store</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs font-medium">
              The ultimate destination for premium Formula 1 merchandise. Gear up with the elite gear from the fastest sport on earth.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/f197hood?igsh=bXl2Ymc2a2dlZmE3&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-violet-500 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-500 hover:text-white cursor-pointer transition-all duration-300 group"
              >
                <Instagram size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-violet-500 hover:bg-violet-600 hover:text-white cursor-pointer transition-all duration-300 group">
                <Twitter size={18} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-violet-500 hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-300 group">
                <Facebook size={18} className="group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
          <div>
            <h5 className="font-bold text-white mb-8 uppercase tracking-widest text-xs">Shop Categories</h5>
            <ul className="text-sm space-y-4 font-medium">
              {[
                { name: 'Team Apparel', icon: Shirt, href: '/category/Apparel' },
                { name: 'Collectibles', icon: Trophy, href: '/category/Collectibles' },
                { name: 'Accessories', icon: Watch, href: '/category/Accessories' },
                { name: 'Gift Cards', icon: Flag, href: '/category/Gifts' }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-violet-400 transition-colors flex items-center gap-3 group"
                  >
                    <link.icon size={16} className="text-slate-600 group-hover:text-violet-500 transition-colors delay-75" />
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-500 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-8 uppercase tracking-widest text-xs">Support</h5>
            <ul className="text-sm space-y-4 font-medium">
              {['Order Tracking', 'Shipping Policy', 'Returns & Refunds', 'Size Guide', 'FAQ'].map(item => (
                <li key={item}>
                  <Link href="#" className="hover:text-violet-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-8 uppercase tracking-widest text-xs">Join the Paddock</h5>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Subscribe to get race updates, new merch drops, and exclusive fan discounts directly to your inbox.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="driver@f1-paddock.com"
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-sm flex-1 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all text-white placeholder:text-slate-600"
              />
              <Button className="bg-white text-slate-950 hover:bg-violet-400 hover:text-violet-950 h-12 rounded-xl font-black uppercase italic tracking-wider transition-all">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
            © 2026 F1 Merchandise Store. Not affiliated with FIA or Formula 1 Management.
          </p>
          <div className="flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <img src="/payment-logos-visa-mastercard-paypal.jpg" alt="Payments" className="h-6" />
          </div>
        </div>
      </footer>
    </div>
  )
}
