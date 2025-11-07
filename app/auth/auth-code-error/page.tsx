import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, Mail } from "lucide-react"
import { Suspense } from "react"

function ErrorContent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted/30">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold">Email Confirmation Issue</CardTitle>
            <CardDescription>Let's get you back on track</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">This can happen if:</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                <li>The confirmation link has expired (they expire after 24 hours)</li>
                <li>The link has already been used</li>
                <li>You opened the link in a different browser</li>
              </ul>
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Quick Fix:</p>
                  <p className="text-sm text-muted-foreground">
                    Check your email for the confirmation link and try clicking it again. If it still doesn't work,
                    request a new confirmation email.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/auth/sign-up">Request New Confirmation</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
