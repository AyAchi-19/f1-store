import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import { AddProductDialog } from "./add-product-dialog"
import { EditProductDialog } from "./edit-product-dialog"
import { DeleteProductButton } from "./delete-product-button"

export default async function AdminProducts() {
  const supabase = await createClient()
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-950 uppercase italic tracking-tight">Products</h2>
          <p className="text-slate-500 font-medium">Manage your race gear inventory.</p>
        </div>
        <AddProductDialog />
      </div>

      <div className="rounded-2xl border border-violet-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Product</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Category</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Price</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Stock</TableHead>
              <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-bold text-slate-900">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-violet-50 text-violet-700 hover:bg-violet-100 border-none">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold text-slate-900">${Number(product.price).toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{product.stock_quantity}</span>
                    {product.stock_quantity < 10 && <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditProductDialog product={product} />
                    <DeleteProductButton id={product.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
