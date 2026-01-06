import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Strict Admin Check
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    console.warn(`Unauthorized access attempt by user ${user.id}`)
    redirect("/")
  }

  // The original `profile` declaration for 'role' is now redundant and would cause a redeclaration error.
  // The new `profile` constant already holds the necessary admin status.
  // The commented-out `role` check is also superseded by the `is_admin` check.

  return (
    <SidebarProvider>
      <AdminSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-tighter text-violet-950 italic leading-none">
                TUNISIA <span className="text-violet-950">F</span><span className="text-red-600">1</span><span className="text-violet-950">97</span>
              </span>
              <span className="text-[10px] font-medium tracking-widest text-slate-500 uppercase leading-none mt-0.5">store</span>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 bg-slate-50/50">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
