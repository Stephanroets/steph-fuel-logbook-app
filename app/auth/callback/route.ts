import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"
  const error_code = searchParams.get("error")
  const error_description = searchParams.get("error_description")

  console.log("[v0] Auth callback received:", {
    code: code ? "present" : "missing",
    error_code,
    error_description,
    origin,
  })

  if (error_code) {
    console.error("[v0] Supabase auth error:", error_code, error_description)
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error_code}`)
  }

  if (code) {
    const supabase = await createClient()

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("[v0] Code exchange failed:", error.message)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?reason=exchange_failed`)
      }

      if (!data.session) {
        console.error("[v0] No session created after code exchange")
        return NextResponse.redirect(`${origin}/auth/auth-code-error?reason=no_session`)
      }

      console.log("[v0] Session created successfully for user:", data.user?.id)

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single()

      if (profileError || !profile) {
        console.error("[v0] Profile not found, creating manually:", profileError?.message)

        const { error: createError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: data.user.user_metadata?.full_name || null,
        })

        if (createError) {
          console.error("[v0] Failed to create profile:", createError.message)
          // Continue anyway, they can complete profile later
        } else {
          console.log("[v0] Profile created successfully")
        }
      } else {
        console.log("[v0] Profile exists for user")
      }

      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"

      let redirectUrl: string
      if (isLocalEnv) {
        redirectUrl = `${origin}${next}`
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`
      } else {
        redirectUrl = `${origin}${next}`
      }

      console.log("[v0] Redirecting to:", redirectUrl)
      return NextResponse.redirect(redirectUrl)
    } catch (error) {
      console.error("[v0] Unexpected error during callback:", error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?reason=unexpected_error`)
    }
  }

  console.error("[v0] No authorization code provided")
  return NextResponse.redirect(`${origin}/auth/auth-code-error?reason=no_code`)
}
