"use client"

import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { toast } from "react-hot-toast"

export function AddToCartButton({ product }: { product: any }) {
    const { addItem } = useCart()

    const handleAddToCart = () => {
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
        <Button
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-14 rounded-xl text-lg font-bold uppercase italic tracking-wider shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
        >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
        </Button>
    )
}
