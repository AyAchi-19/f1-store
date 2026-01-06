import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="border-violet-200/50 shadow-lg shadow-violet-500/5 text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight text-violet-950">Check your inbox</CardTitle>
              <CardDescription>We've sent you a confirmation email</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-sm text-muted-foreground">
                You've successfully signed up. Please click the link in your email to confirm your account before
                signing in.
              </p>
              <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
