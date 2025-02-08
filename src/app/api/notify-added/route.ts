import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const { inserted_data } = await request.json()

    // Initialize Supabase client
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Fetch all user emails
    const { data: users, error } = await supabase.from("user_emails").select("email")

    if (error) throw error

    // Send email to each user
    for (const user of users) {
      await resend.emails.send({
        from: "noreply@fran-blazevic.from.hr",
        to: user.email,
        subject: "Dodan novi račun u DueTrack",
        html: `
          <p>Dodan je novi račun u aplikaciju DueTrack:</p>
          <pre>${JSON.stringify(inserted_data, null, 2)}</pre>
        `,
      })
    }

    return NextResponse.json({ message: "Emails sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error sending emails:", error)
    return NextResponse.json({ message: "Error sending emails", error: error }, { status: 500 })
  }
}

