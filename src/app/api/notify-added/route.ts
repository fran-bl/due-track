import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { inserted_data } = await request.json()

    // Fetch all user emails
    const { data: users, error } = await supabase.from("auth.users").select("email")

    if (error) throw error

    // Send email to each user
    for (const user of users) {
      await resend.emails.send({
        from: "noreply@fran-blazevic.from.hr",
        to: user.email,
        subject: "New Record Inserted",
        html: `<p>A new record has been inserted:</p><pre>${JSON.stringify(inserted_data, null, 2)}</pre>`,
      })
    }

    return NextResponse.json({ message: "Emails sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error sending emails:", error)
    return NextResponse.json({ message: "Error sending emails", error: error }, { status: 500 })
  }
}

