import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function POST(request: Request) {
    const supabase = await createClient()

    // Flush the session
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error("Logout error:", error)
    }

    // Redirect to home page
    redirect("/")
}
