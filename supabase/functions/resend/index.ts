import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "./types.ts";

type BillRecord = Database["public"]["Tables"]["bills"]["Row"]
interface WebhookPayload {
  type: "INSERT";
  table: string;
  record: null | BillRecord;
  schema: "public";
  old_record: null | BillRecord;
}

serve(async (req) => {
  const payload: WebhookPayload = await req.json();
  const newBill = payload.record;

  const supabase = createClient(Deno.env.get("DB_URL")!, Deno.env.get("SERVICE_ROLE_KEY")!);
  const { data: users } = await supabase.from("user_emails").select("email");

  const emails = users?.map(user => user.email);

  if (!emails || emails.length === 0) {
    return new Response("No users found to notify", { status: 404 });
  }

  // Compose the email content with the new bill data
  const billContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="font-size: 24px; color: #2a2a2a;">Dodan je novi račun:</h2>
      <img src="${newBill.img_url}" alt="image" style="max-width: 300px; max-height: 300px; width: auto; height: auto;"/>
      <ul style="font-size: 18px; list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 8px;"><strong>Opis:</strong> ${newBill.description}</li>
        <li style="margin-bottom: 8px;"><strong>Iznos:</strong> ${newBill.amount} €</li>
        <li style="margin-bottom: 8px;"><strong>Datum dospijeća:</strong> ${new Date(newBill.due_date).toLocaleDateString('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          timeZone: 'Europe/Zagreb'
        })}.</li>
      </ul>
      <p style="font-size: 18px;">Detalje možete pogledati u aplikaciji <a href="https://due-track.vercel.app" style="color: #007bff;">DueTrack</a></p>
    </div>
  `;

  // Send email to all users via Resend API
  const emailPromises = emails.map(async (email) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "DueTrack <noreply@fran-blazevic.from.hr>",
        to: email,
        subject: `Dodan novi račun`,
        html: billContent,
      }),
    });

    const data = await res.json();
    console.log(`Email sent to ${email}:`, data);
  });

  // Wait for all emails to be sent
  await Promise.all(emailPromises);

  return new Response("Emails sent successfully!", { status: 200 });
});
