"use client"

import { useState } from "react"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Share2, Check } from "lucide-react"
import { toast } from "react-hot-toast"
import { cn } from "@/lib/utils"

interface ProductViewProps {
    product: any
}

export function ProductView({ product }: ProductViewProps) {
    const { addItem } = useCart()

    // Parse images
    const rawImages = product.image_url ? product.image_url.split(',') : ["/placeholder.svg"]
    const images = rawImages.map((u: string) => u.trim()).filter(Boolean)

    // If only 1 image, duplicate it for gallery effect if needed, or better yet, handle single image gracefully.
    // The user wanted "more than 1 pic", if the data only has 1, we can't do much but maybe duplicate it for demo?
    // Let's stick to showing available images. If < 4, maybe we don't need duplicates, but the design 
    // expects a grid. Let's just use what we have, and if < 1, use placeholder.

    const [selectedImage, setSelectedImage] = useState(images[0])
    const [selectedSize, setSelectedSize] = useState<string | null>(null)

    const handleAddToCart = () => {
        if (product.category === 'Apparel' && !selectedSize) {
            toast.error("Please select a size first", {
                style: {
                    background: "#ef4444",
                    color: "#fff",
                    fontWeight: "bold",
                }
            })
            return
        }

        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image_url: selectedImage, // Use the selected image or main image
            quantity: 1,
            size: selectedSize || undefined
        })

        toast.success(`${product.name} added to cart!`, {
            style: {
                background: "#4c1d95",
                color: "#fff",
                fontWeight: "bold",
            },
        })
    }

    const sizes = ['S', 'M', 'L', 'XL', 'XXL']

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 lg:p-12 shadow-xl border border-slate-100">
            {/* Gallery Section */}
            <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-violet-50 border-2 border-slate-200 relative group">
                    <img
                        src={selectedImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-violet-600 text-white border-none font-bold backdrop-blur-sm shadow-lg">
                            {product.category}
                        </Badge>
                    </div>
                    {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                        <div className="absolute top-4 right-4">
                            <Badge className="bg-orange-500 text-white border-none font-bold backdrop-blur-sm shadow-lg animate-pulse">
                                Only {product.stock_quantity} left!
                            </Badge>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {images.map((img: string, i: number) => (
                        <div
                            key={i}
                            className={cn(
                                "aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-violet-50 border-2 cursor-pointer transition-all group",
                                selectedImage === img ? "border-violet-600 ring-2 ring-violet-600/30" : "border-slate-200 hover:border-violet-600"
                            )}
                            onClick={() => setSelectedImage(img)}
                        >
                            <img
                                src={img}
                                alt={`${product.name} view ${i + 1}`}
                                className={cn(
                                    "w-full h-full object-cover transition-all duration-300",
                                    selectedImage === img ? "opacity-100" : "opacity-70 group-hover:opacity-100 scale-95 group-hover:scale-100"
                                )}
                            />
                        </div>
                    ))}
                    {/* Fill with empty slots if needed to maintain grid look, or just leave it */}
                </div>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl lg:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">
                        {product.name}
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-4xl font-black text-violet-600 italic">
                            ${Number(product.price).toFixed(2)}
                        </span>
                        {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                            <span className="text-sm font-bold text-orange-600 bg-orange-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                Low Stock
                            </span>
                        )}
                        {product.stock_quantity === 0 && (
                            <span className="text-sm font-bold text-red-600 bg-red-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                Out of Stock
                            </span>
                        )}
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                        {product.description}
                    </p>
                </div>

                <div className="space-y-6 pt-6 border-t-2 border-slate-100">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Size Selector for Apparel */}
                        {product.category === 'Apparel' && (
                            <div className="col-span-2 space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-slate-900 uppercase tracking-widest">Select Size</label>
                                    <span className="text-xs font-medium text-slate-400 uppercase">{selectedSize ? `size: ${selectedSize}` : 'required'}</span>
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "flex-1 min-w-[3rem] h-12 rounded-xl border-2 font-bold transition-all",
                                                selectedSize === size
                                                    ? "border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                                                    : "border-slate-200 text-slate-600 hover:border-violet-600 hover:text-violet-600 hover:bg-violet-50"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={handleAddToCart}
                            disabled={product.stock_quantity === 0}
                            className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-14 rounded-xl text-lg font-bold uppercase italic tracking-wider shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>

                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl border-2 border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-500 transition-all">
                            <Heart size={24} />
                        </Button>
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl border-2 border-slate-200 text-slate-400 hover:text-violet-600 hover:bg-violet-50 hover:border-violet-600 transition-all">
                            <Share2 size={24} />
                        </Button>
                    </div>
                </div>

                {/* Features / Trust Badges */}
                <div className="grid grid-cols-2 gap-4 pt-6">
                    <div className="flex items-center gap-3 text-slate-500 p-4 rounded-xl bg-green-50 border border-green-100">
                        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30">
                            <Check size={18} strokeWidth={3} />
                        </div>
                        <span className="text-sm font-bold text-green-700">In Stock & Ready</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 p-4 rounded-xl bg-violet-50 border border-violet-100">
                        <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <Check size={18} strokeWidth={3} />
                        </div>
                        <span className="text-sm font-bold text-violet-700">Official F1 Merch</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
