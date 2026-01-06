"use client"

import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { toast } from "react-hot-toast"
import Link from "next/link"

export function ProductGrid({ products }: { products: any[] }) {
  const { addItem } = useCart()

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
      quantity: 1,
    })
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: "#4c1d95",
        color: "#fff",
        fontWeight: "bold",
      },
    })
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2 hover:border-violet-300"
        >

          <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
            <Link href={`/product/${product.id}`} className="block h-full w-full">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </Link>
            {product.stock_quantity < 10 && product.stock_quantity > 0 && (
              <Badge className="absolute top-3 left-3 bg-orange-500 text-white border-none font-bold uppercase tracking-tight text-[10px] px-2 py-1 shadow-lg">
                Low Stock
              </Badge>
            )}
            <Badge className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-900 border-none font-bold text-xs px-3 py-1 shadow-md">
              {product.category}
            </Badge>
          </div>


          <div className="p-5">
            <h3 className="font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-violet-600 transition-colors text-base">
              {product.name}
            </h3>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed h-10">{product.description}</p>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-2xl font-black text-violet-600 italic">${Number(product.price).toFixed(2)}</span>
              <Button
                size="icon"
                className="bg-slate-900 hover:bg-violet-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-violet-500/50 hover:scale-110 active:scale-95 h-11 w-11"
                onClick={() => handleAddToCart(product)}
              >
                <Plus size={20} strokeWidth={2.5} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
