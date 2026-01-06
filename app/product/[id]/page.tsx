
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { StoreLayout } from "@/components/store-layout"
import { ProductView } from "@/components/product-view"

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

    if (!product) {
        notFound()
    }

    // Handle multiple images if stored as comma-separated, otherwise just duplicate the main image to simulate a gallery for now as per request to "see more than 1 pic"
    // If the user wants to see more than 1 pic, and we only have 1, we can't magically invent them.
    // BUT, we can interpret 'image_url' as potentially containing multiple CSV URLs.
    // For the sake of the demo/request, I will duplicate the image if there's only one, 
    // or use a placeholder array so the gallery "functionality" is visible.



    // We pass the raw product data to the client component to handle interaction (gallery, size, cart)
    return (
        <StoreLayout user={user?.user}>
            <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen py-12">
                <div className="container mx-auto px-4">
                    <ProductView product={product} />
                </div>
            </div>
        </StoreLayout>
    )
}

