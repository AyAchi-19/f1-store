import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="border-red-100 shadow-lg shadow-red-500/5">
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight text-red-950 text-center">
                Authentication Error
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-center">
              {params?.error ? (
                <p className="text-sm text-muted-foreground">{params.error}</p>
              ) : (
                <p className="text-sm text-muted-foreground">An unspecified authentication error occurred.</p>
              )}
              <Button asChild variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent">
                <Link href="/auth/login">Try Again</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
