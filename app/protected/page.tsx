import { createClient } from "@/lib/supabase/server"
import { StoreLayout } from "@/components/store-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, User, Settings, CreditCard, LogOut } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { PasswordUpdateForm } from "@/components/password-update-form"
import { ProfileUpdateForm } from "@/components/profile-update-form"
import { UserOrdersList } from "@/components/user-orders-list"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <StoreLayout user={user}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Sidebar-style Profile Navigation */}
            <div className="w-full md:w-64 space-y-4">
              <div className="bg-white border rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-xl uppercase">
                    {user.email?.[0]}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-900 truncate">{user.email}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                      {profile?.role === "admin" ? "Team Principal" : "Paddock Member"}
                    </p>
                  </div>
                </div>
                {profile?.role === "admin" && (
                  <Button
                    asChild
                    className="w-full bg-violet-600 hover:bg-violet-700 font-bold uppercase italic text-xs"
                  >
                    <Link href="/admin">Go to Dashboard</Link>
                  </Button>
                )}
              </div>

              <div className="bg-white border rounded-2xl p-2 shadow-sm">
                <nav className="flex flex-col gap-1">
                  <Button variant="ghost" className="justify-start text-violet-600 bg-violet-50">
                    <User className="mr-2 h-4 w-4" /> Profile Overview
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Package className="mr-2 h-4 w-4" /> Order History
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <CreditCard className="mr-2 h-4 w-4" /> Payment Methods
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Button>
                </nav>
              </div>

              <form action="/auth/sign-out" method="post">
                <Button
                  variant="outline"
                  className="w-full border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </form>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 space-y-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-slate-100 p-1 rounded-xl w-full flex">
                  <TabsTrigger value="overview" className="flex-1 rounded-lg font-bold italic uppercase text-xs">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="flex-1 rounded-lg font-bold italic uppercase text-xs">
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex-1 rounded-lg font-bold italic uppercase text-xs">
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  <Card className="border-none shadow-none bg-slate-50">
                    <CardHeader>
                      <CardTitle className="text-lg font-black uppercase italic tracking-tight">
                        Recent Activity
                      </CardTitle>
                      <CardDescription>Your latest interactions with the paddock.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UserOrdersList initialOrders={orders?.slice(0, 2) || []} userId={user.id} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-black uppercase italic tracking-tight">
                        Order History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <UserOrdersList initialOrders={orders || []} userId={user.id} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-black uppercase italic tracking-tight">
                        Account Security
                      </CardTitle>
                      <CardDescription>Update your password and manage your account settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <PasswordUpdateForm />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-black uppercase italic tracking-tight">
                        Profile Information
                      </CardTitle>
                      <CardDescription>Update your email and personal details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProfileUpdateForm user={user} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  )
}
