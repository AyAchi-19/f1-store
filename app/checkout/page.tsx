import { createClient } from "@/lib/supabase/server"
import { StoreLayout } from "@/components/store-layout"
import { CheckoutForm } from "@/components/checkout-form"
import { redirect } from "next/navigation"

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    redirect("/auth/login?redirect=/checkout")
  }

  return (
    <StoreLayout user={user.user}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black text-slate-950 uppercase italic tracking-tight mb-8">
            Final <span className="text-violet-600">Lap</span>
          </h1>
          <CheckoutForm user={user.user} />
        </div>
      </div>
    </StoreLayout>
  )
}
