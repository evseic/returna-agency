import { NextResponse } from "next/server";
import { addLead, readLeads } from "@/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// POST handler: Saves new lead submissions
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, website, answers, status } = body;

    // Server-side validation
    if (!name || !email || !phone || !website) {
      return NextResponse.json(
        { error: "Trūksta privalomų laukų (vardas, el. paštas, telefonas, svetainė)." },
        { status: 400 }
      );
    }

    const newLead = await addLead({
      name,
      email,
      phone,
      website,
      answers: answers || {},
      status: status || "qualified",
    });

    // Send emails using Resend if configured
    if (resend) {
      // 1. Send notification to admin
      try {
        const quizSummary = Object.entries(answers || {})
          .map(([key, val]) => `<li><strong>${key}:</strong> ${val}</li>`)
          .join("");

        await resend.emails.send({
          from: "EmailFlow Leads <onboarding@resend.dev>",
          to: "info@emailflow.eu",
          subject: `⚡️ Nauja užklausa iš EmailFlow: ${website}`,
          html: `
            <h2>Gauta nauja kvalifikacinės viktorinos užklausa</h2>
            <p><strong>Vardas:</strong> ${name}</p>
            <p><strong>El. paštas:</strong> ${email}</p>
            <p><strong>Telefonas:</strong> ${phone}</p>
            <p><strong>Svetainė:</strong> ${website}</p>
            <p><strong>Statusas:</strong> ${status || "qualified"}</p>
            <h3>Viktorinos atsakymai:</h3>
            <ul>${quizSummary || "<li>Atsakymų nėra</li>"}</ul>
          `,
        });
      } catch (adminEmailError) {
        console.error("Failed to send admin notification email:", adminEmailError);
      }

      // 2. Send follow-up to client
      try {
        await resend.emails.send({
          from: "EmailFlow <onboarding@resend.dev>",
          to: email,
          subject: "Sužinokite, kiek papildomų pajamų gali generuoti jūsų el. pašto kanalas",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #0F172A;">
               <h2 style="color: #0F172A;">Sveiki, ${name}!</h2>
               <p>Per 15–20 minučių parodysime, kur šiuo metu prarandate potencialius pardavimus ir kokios galimybės gali atnešti didžiausią grąžą jūsų el. parduotuvei.</p>
               <p style="font-weight: bold; margin-top: 24px;">📅 Rezervuokite strateginį pokalbį dabar:</p>
               <p style="margin: 16px 0;">
                 <a href="https://calendly.com/emailflow/emailflow" style="display: inline-block; background-color: #10B981; color: #0B0F14; font-weight: bold; padding: 12px 28px; border-radius: 9999px; text-decoration: none;">Rezervuoti konsultaciją</a>
               </p>
               <p style="font-size: 14px; color: #64748B;">Vietų skaičius ribotas, todėl rekomenduojame rezervuoti laiką kuo anksčiau.</p>
               <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 30px 0;" />
               <p style="font-size: 12px; color: #64748B;">Pagarbiai,<br /><strong>EmailFlow komanda</strong><br />www.emailflow.lt</p>
            </div>
          `,
        });
      } catch (clientEmailError) {
        console.error("Failed to send client follow-up email:", clientEmailError);
      }
    }

    // Send Telegram Notification if configured
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
      try {
        const quizDetails = Object.entries(answers || {})
          .map(([key, val]) => `*${key}:* ${val}`)
          .join("\n");

        const text = `⚡️ *Nauja užklausa iš EmailFlow!*

👤 *Vardas:* ${name}
📧 *El. paštas:* ${email}
📞 *Telefonas:* ${phone}
🌐 *Svetainė:* ${website}
🎯 *Statusas:* ${status || "qualified"}

*Viktorinos atsakymai:*
${quizDetails || "Atsakymų nėra"}`;

        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: text,
            parse_mode: "Markdown",
          }),
        });
      } catch (telegramError) {
        console.error("Failed to send Telegram notification:", telegramError);
      }
    }

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error: any) {
    console.error("API error in POST /api/leads:", error);
    return NextResponse.json(
      { error: `Nepavyko išsaugoti užklausos: ${error?.message || error}` },
      { status: 500 }
    );
  }
}

// GET handler: Returns all leads (protected by simple token or custom authorization header)
export async function GET(request: Request) {
  try {
    // Simple environment password/header verification (Basic Auth-like or token check)
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    // Retrieve the admin token securely from environment variables
    const adminToken = process.env.ADMIN_TOKEN;
    const isDev = process.env.NODE_ENV === "development";
    
    // In production, we require ADMIN_TOKEN to be configured for safety
    if (!adminToken && !isDev) {
      console.error("Saugumo klaida: ADMIN_TOKEN nėra sukonfigūruotas aplinkos kintamuosiuose.");
      return NextResponse.json(
        { error: "Serverio konfigūracijos klaida (Authentication not configured)." },
        { status: 500 }
      );
    }

    // Default fallback allowed ONLY in local development
    const effectiveToken = adminToken || "Tudasudaimillion28$";

    if (token !== effectiveToken) {
      return NextResponse.json({ error: "Nėra prieigos (Unauthorized)" }, { status: 401 });
    }

    const leads = await readLeads();
    return NextResponse.json({ leads });
  } catch (error: any) {
    console.error("API error in GET /api/leads:", error);
    return NextResponse.json(
      { error: `Nepavyko nuskaityti užklausų: ${error?.message || error}` },
      { status: 500 }
    );
  }
}
