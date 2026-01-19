// supabase/functions/send-whatsapp-reminders/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import twilio from "npm:twilio@5.4.3";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    },
  });
}

function requireEnv(name: string) {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function normalizeWhatsappPhone(phone: string) {
  // aceita "11999999999", "+5511999999999", "whatsapp:+5511999999999"
  let p = phone.trim();
  if (p.startsWith("whatsapp:")) p = p.replace("whatsapp:", "");
  if (p.startsWith("+")) p = p.slice(1);
  p = p.replace(/\D/g, "");

  // se vier sem 55, adiciona
  if (!p.startsWith("55")) p = "55" + p;

  return `whatsapp:+${p}`;
}

function formatDateBR(dateStr: string) {
  // dateStr: YYYY-MM-DD
  const [y, m, d] = dateStr.split("-").map((x) => Number(x));
  const dd = String(d).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${dd}/${mm}/${y}`;
}

function formatTimeBR(timeStr: string) {
  // pode vir "09:00:00"
  return timeStr.slice(0, 5);
}

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") return json({ ok: true }, 200);

    // Segurança: se você estiver rodando com --no-verify-jwt, não precisa do header.
    // Se estiver com verify_jwt=true, aí precisa do Authorization do supabase.
    // Vamos aceitar os dois cenários.
    const SUPABASE_URL = requireEnv("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

    const TWILIO_ACCOUNT_SID = requireEnv("TWILIO_ACCOUNT_SID");
    const TWILIO_AUTH_TOKEN = requireEnv("TWILIO_AUTH_TOKEN");
    const TWILIO_WHATSAPP_FROM = requireEnv("TWILIO_WHATSAPP_FROM");

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    // calcula "amanhã" (pela data do servidor)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    const tomorrowStr = `${yyyy}-${mm}-${dd}`;

    // 1) buscar consultas de amanhã
    const apptRes = await fetch(
      `${SUPABASE_URL}/rest/v1/appointments?select=id,clinic_id,patient_id,date,time,status&date=eq.${tomorrowStr}&status=eq.scheduled`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      },
    );

    if (!apptRes.ok) {
      const t = await apptRes.text();
      return json({ ok: false, step: "fetch_appointments", error: t }, 500);
    }

    const appointments: Array<{
      id: string;
      clinic_id: string;
      patient_id: string;
      date: string;
      time: string;
      status: string;
    }> = await apptRes.json();

    if (!appointments.length) {
      return json({ ok: true, message: "No appointments for tomorrow." });
    }

    let sent = 0;
    let skipped = 0;
    const errors: Array<{ appointment_id: string; error: string }> = [];

    for (const appt of appointments) {
      // 2) não mandar duas vezes: checa whatsapp_reminders
      const alreadyRes = await fetch(
        `${SUPABASE_URL}/rest/v1/whatsapp_reminders?select=id&appointment_id=eq.${appt.id}&limit=1`,
        {
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
        },
      );

      if (!alreadyRes.ok) {
        const t = await alreadyRes.text();
        errors.push({ appointment_id: appt.id, error: `check_reminder: ${t}` });
        continue;
      }

      const already = await alreadyRes.json();
      if (already.length) {
        skipped++;
        continue;
      }

      // 3) buscar telefone/nome do paciente
      const patRes = await fetch(
        `${SUPABASE_URL}/rest/v1/patients?select=id,name,phone&clinic_id=eq.${appt.clinic_id}&id=eq.${appt.patient_id}&limit=1`,
        {
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
        },
      );

      if (!patRes.ok) {
        const t = await patRes.text();
        errors.push({ appointment_id: appt.id, error: `fetch_patient: ${t}` });
        continue;
      }

      const pats = await patRes.json();
      if (!pats.length || !pats[0].phone) {
        errors.push({ appointment_id: appt.id, error: "patient_not_found_or_no_phone" });
        continue;
      }

      const patientName = pats[0].name ?? "Paciente";
      const to = normalizeWhatsappPhone(String(pats[0].phone));

      const msg =
        `Olá, ${patientName}! 😊\n` +
        `Lembrete da sua consulta na OdontoFlow.\n` +
        `📅 Data: ${formatDateBR(appt.date)}\n` +
        `🕒 Horário: ${formatTimeBR(appt.time)}\n\n` +
        `Se precisar reagendar, responda esta mensagem.`;

      // 4) criar registro pendente
      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/whatsapp_reminders`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify([{
          clinic_id: appt.clinic_id,
          appointment_id: appt.id,
          patient_id: appt.patient_id,
          phone: to,
          message: msg,
          scheduled_for: new Date(`${appt.date}T${formatTimeBR(appt.time)}:00`).toISOString(),
          status: "pending",
        }]),
      });

      if (!insertRes.ok) {
        const t = await insertRes.text();
        errors.push({ appointment_id: appt.id, error: `insert_reminder: ${t}` });
        continue;
      }

      let reminderRow;
      try {
        const rows = await insertRes.json();
        reminderRow = rows?.[0];
      } catch {
        reminderRow = null;
      }

      // 5) enviar no Twilio
      try {
        await client.messages.create({
          from: TWILIO_WHATSAPP_FROM,
          to,
          body: msg,
        });

        sent++;

        // 6) marcar como enviado
        if (reminderRow?.id) {
          await fetch(`${SUPABASE_URL}/rest/v1/whatsapp_reminders?id=eq.${reminderRow.id}`, {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "sent",
              sent_at: new Date().toISOString(),
              error: null,
            }),
          });
        }
      } catch (e) {
        const err = String(e?.message ?? e);

        // salvar erro
        if (reminderRow?.id) {
          await fetch(`${SUPABASE_URL}/rest/v1/whatsapp_reminders?id=eq.${reminderRow.id}`, {
            method: "PATCH",
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "error",
              error: err,
            }),
          });
        }

        errors.push({ appointment_id: appt.id, error: `twilio: ${err}` });
      }
    }

    return json({
      ok: true,
      tomorrow: tomorrowStr,
      total: appointments.length,
      sent,
      skipped,
      errors,
    });
  } catch (e) {
    return json({ ok: false, error: String(e?.message ?? e) }, 500);
  }
});
