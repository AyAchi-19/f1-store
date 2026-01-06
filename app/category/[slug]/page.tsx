import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { StoreLayout } from "@/components/store-layout"
import { CartProvider } from "@/components/cart-provider"
import { ProductGrid } from "@/components/product-grid"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category", slug)
    .order("created_at", { ascending: false })

  return (
    <CartProvider>
      <StoreLayout user={user?.user}>
        <div className="bg-slate-50 min-h-screen">
          {/* Breadcrumbs */}
          <div className="bg-white border-b py-4">
            <div className="container mx-auto px-4 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Link href="/" className="hover:text-violet-600 transition-colors">
                Store
              </Link>
              <ChevronRight size={14} />
              <span className="text-violet-600 italic">Category</span>
              <ChevronRight size={14} />
              <span className="text-slate-900">{slug}</span>
            </div>
          </div>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-l-4 border-violet-600 pl-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-950 uppercase italic tracking-tighter">
                      {slug}
                    </h1>
                    <Badge variant="outline" className="h-7 px-3 border-violet-200 text-violet-600 font-bold italic">
                      {products?.length || 0} ITEMS
                    </Badge>
                  </div>
                  <p className="text-slate-500 font-medium max-w-xl">
                    High-performance gear for the ultimate race fan. Authentic {slug.toLowerCase()} from the paddock to
                    your doorstep.
                  </p>
                </div>
              </div>

              {products && products.length > 0 ? (
                <ProductGrid products={products} />
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 border-dashed py-32 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                    <Flag size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 italic uppercase">No items in the paddock</h3>
                  <p className="text-slate-500 max-w-xs mb-8">
                    We haven't uploaded any products for this category yet. Check back after the next Grand Prix!
                  </p>
                  <Button asChild className="bg-violet-600">
                    <Link href="/">Back to Store</Link>
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
      </StoreLayout>
    </CartProvider>
  )
}

function Flag({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  )
}
