import { createClient } from "@/lib/supabase/server"
import { StoreLayout } from "@/components/store-layout"
import Link from "next/link"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Trophy, Zap, ShieldCheck, ShoppingBag } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  return (
    <StoreLayout user={user?.user}>
      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden bg-slate-950">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/f1-racing-car-on-track-at-night-with-neon-lights.jpg"
            alt="F1 Racing"
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-16 lg:py-24">
          <div className="max-w-4xl mx-auto">
            {/* Center Content */}
            <div className="space-y-6 md:space-y-8 text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <Zap size={14} className="fill-current" />
                <span className="hidden sm:inline">2026 Season Collection</span>
                <span className="sm:hidden">New 2026</span>
              </div>

              {/* Heading */}
              <div className="space-y-3 md:space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight uppercase italic">
                  <span className="block">Premium</span>
                  <span className="block bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent italic">
                    F1 Merchandise
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Official gear from your favorite teams. <span className="text-violet-400 font-semibold">Wear the passion</span>, feel the speed.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base font-bold uppercase shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 transition-all hover:scale-105 active:scale-95 italic"
                >
                  <Link href="#products" className="flex items-center justify-center gap-2">
                    <ShoppingBag size={18} />
                    Shop Now
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 h-12 sm:h-14 px-8 sm:px-10 text-sm sm:text-base font-bold uppercase bg-white/5 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 italic"
                >
                  <Link href="/category/Apparel" className="flex items-center justify-center gap-2">
                    <Trophy size={18} />
                    View Teams
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wide">Authentic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wide">Fast Ship</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wide">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Listing */}
      <section id="products" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 mb-8 sm:mb-10 md:mb-12">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tight italic">
                Featured <span className="text-violet-600">Collection</span>
              </h2>
              <p className="text-slate-500 font-medium text-base sm:text-lg max-w-2xl mx-auto">Curated high-performance gear for every fan.</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-violet-600 text-white border-violet-600 font-bold hover:bg-violet-700 hover:border-violet-700 text-xs sm:text-sm px-4 sm:px-5"
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full font-bold text-slate-500 hover:text-violet-600 hover:bg-violet-50 text-xs sm:text-sm px-4 sm:px-5"
              >
                Apparel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full font-bold text-slate-500 hover:text-violet-600 hover:bg-violet-50 text-xs sm:text-sm px-4 sm:px-5"
              >
                Headwear
              </Button>
            </div>
          </div>

          {products && products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-violet-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Products Yet</h3>
              <p className="text-slate-500 mb-6">Add your first product from the admin dashboard</p>
              {user?.user && (
                <Button asChild className="bg-violet-600 hover:bg-violet-700">
                  <a href="/admin">Go to Admin Dashboard</a>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </StoreLayout>
  )
}
