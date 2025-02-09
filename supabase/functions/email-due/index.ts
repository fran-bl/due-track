import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

serve(async (req) => {
  const { bills } = await req.json();

  if (!bills || bills.length === 0) {
    return new Response("No bills found", { status: 404 });
  }

  const supabase = createClient(Deno.env.get("DB_URL")!, Deno.env.get("SERVICE_ROLE_KEY")!);
  const { data: users } = await supabase.from("user_emails").select("email");

  const emails = users?.map(user => user.email);

  if (!emails || emails.length === 0) {
    return new Response("No users found to notify", { status: 404 });
  }

  // Format the bills into HTML
  const billList = bills.map(
    (bill: { description: string; amount: number; due_date: string }) => `
      <li style="margin-bottom: 8px;">
        <strong>Opis:</strong> ${bill.description} <br>
        <strong>Iznos:</strong> ${bill.amount} €<br>
        <strong>Datum dospijeća:</strong> ${new Date(bill.due_date).toLocaleDateString('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          timeZone: 'Europe/Zagreb'
        })}.
      </li>
    `
  ).join("");

  const emailContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="font-size: 24px; color: #2a2a2a;">Računi kojima je datum dospijeća za manje od 2 dana:</h2>
      <ul style="font-size: 18px; list-style-type: none; padding-left: 0;">
        ${billList}
      </ul>
      <p style="font-size: 18px;">Detalje možete pogledati u aplikaciji 
        <a href="https://due-track.vercel.app" style="color: #007bff;">DueTrack</a>
      </p>
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
        subject: `Računima ističe rok`,
        html: emailContent,
      }),
    });

    const data = await res.json();
    console.log(`Email sent to ${email}:`, data);
  });

  // Wait for all emails to be sent
  await Promise.all(emailPromises);

  return new Response("Emails sent successfully!", { status: 200 });
});
