"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil } from "lucide-react"
import { toast } from "react-hot-toast"

interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    stock_quantity: number
    image_url: string
}

export function EditProductDialog({ product }: { product: Product }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState(product.image_url)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const price = Number(formData.get("price"))
        const category = formData.get("category") as string
        const stock_quantity = Number(formData.get("stock"))
        const image_url = formData.get("image_url") as string

        try {
            const { error } = await supabase
                .from("products")
                .update({
                    name,
                    description,
                    price,
                    category,
                    stock_quantity,
                    image_url: image_url || "/placeholder.svg",
                })
                .eq("id", product.id)

            if (error) throw error

            toast.success("Product updated successfully!")
            setOpen(false)
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Failed to update product")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-violet-600">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-violet-100 max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tight text-violet-950">
                            Edit Product
                        </DialogTitle>
                        <DialogDescription>Update the details for {product.name}.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={product.name}
                                required
                                className="border-violet-100"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={product.description}
                                className="border-violet-100 min-h-[100px]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={product.price}
                                    required
                                    className="border-violet-100"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    defaultValue={product.stock_quantity}
                                    required
                                    className="border-violet-100"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category" defaultValue={product.category}>
                                <SelectTrigger className="border-violet-100">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Apparel">Apparel</SelectItem>
                                    <SelectItem value="Headwear">Headwear</SelectItem>
                                    <SelectItem value="Accessories">Accessories</SelectItem>
                                    <SelectItem value="Collectibles">Collectibles</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="image_url">Image URLs (comma separated for multiple)</Label>
                            <Input
                                id="image_url"
                                name="image_url"
                                defaultValue={product.image_url}
                                onChange={(e) => setImageUrl(e.target.value.split(',')[0].trim())}
                                className="border-violet-100"
                            />
                        </div>
                        {imageUrl && (
                            <div className="mt-2 rounded-lg overflow-hidden border border-violet-100 aspect-video">
                                <img
                                    src={imageUrl.split(',')[0].trim() || "/placeholder.svg"}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        )}

                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-700 font-bold uppercase italic h-12"
                        >
                            {loading ? "Updating..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
