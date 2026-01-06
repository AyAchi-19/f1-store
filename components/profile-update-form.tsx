"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface ProfileUpdateFormProps {
  user: User
}

export function ProfileUpdateForm({ user }: ProfileUpdateFormProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState(user.email || "")

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    if (email === user.email) {
      toast.info("No changes made")
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      email: email,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Check your email to confirm the change")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleUpdateEmail} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <p className="text-xs text-slate-500 italic">Changing your email requires verification.</p>
      </div>
      <Button
        type="submit"
        className="bg-violet-600 hover:bg-violet-700 font-bold uppercase italic text-xs h-10 px-8"
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Update Email
      </Button>
    </form>
  )
}
