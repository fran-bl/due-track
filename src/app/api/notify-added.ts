import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { inserted_data } = req.body

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

    res.status(200).json({ message: "Emails sent successfully" })
  } catch (error) {
    console.error("Error sending emails:", error)
    res.status(500).json({ message: "Error sending emails", error: error })
  }
}
