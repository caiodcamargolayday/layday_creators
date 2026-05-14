// Meta Conversions API (CAPI) helper — server-side only.
// Hashes PII with SHA-256 and fires a Lead event with value-based scoring.

import { createHash } from "crypto";
import type { LeadScore } from "./leadScoring";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export interface CapiLeadOptions {
  email: string;
  phone: string;
  score: LeadScore;
  value: number;
  clientIp: string;
  clientUserAgent: string;
  eventSourceUrl: string;
}

export async function sendCapiLeadEvent(opts: CapiLeadOptions): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  const testCode = process.env.META_TEST_EVENT_CODE;

  if (!pixelId || !token) {
    console.warn("[CAPI] META_PIXEL_ID or META_CAPI_TOKEN not configured — skipping");
    return;
  }

  const eventTime = Math.floor(Date.now() / 1000);

  const eventData: Record<string, unknown> = {
    event_name: "Lead",
    event_time: eventTime,
    action_source: "website",
    event_source_url: opts.eventSourceUrl,
    user_data: {
      em: [sha256(opts.email)],
      ph: [sha256(opts.phone.replace(/\s+/g, ""))],
      client_ip_address: opts.clientIp,
      client_user_agent: opts.clientUserAgent,
    },
    custom_data: {
      currency: "USD",
      value: opts.value,       // 100 = hot, 30 = medium → Meta optimizes toward high-value
      lead_score: opts.score,  // "hot" | "medium"
    },
  };

  const body: Record<string, unknown> = { data: [eventData] };

  // Attach test event code in development only
  if (testCode) {
    body.test_event_code = testCode;
  }

  const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(`[CAPI] Error ${res.status}: ${JSON.stringify(json)}`);
  }

  console.log(`[CAPI] Lead event sent — score: ${opts.score}, value: ${opts.value}`, json);
}
