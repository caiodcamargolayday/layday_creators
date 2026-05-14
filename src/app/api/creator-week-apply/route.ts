import { NextRequest, NextResponse } from "next/server";
import { scoreCreatorLead } from "@/lib/leadScoring";
import { sendCapiLeadEvent } from "@/lib/metaCapi";

// POST /api/creator-week-apply
// Forwards form answers to Google Sheets + fires Meta CAPI Lead event.
// Only hot and medium leads reach here — bad leads are gated in the frontend.
export async function POST(req: NextRequest) {
  const APPS_SCRIPT_URL = process.env.CREATOR_WEEK_SHEETS_URL;

  if (!APPS_SCRIPT_URL) {
    console.error("CREATOR_WEEK_SHEETS_URL env var not set");
    return NextResponse.json(
      { ok: false, error: "Server not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    // Score the lead (hot or medium — bad leads never reach this point)
    const { score, value, points } = scoreCreatorLead(body);

    // Extract client context for CAPI matching accuracy
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "";
    const clientUserAgent = req.headers.get("user-agent") ?? "";
    const eventSourceUrl =
      req.headers.get("referer") ?? "https://creators.laydaygilit.com";

    console.log(`[Apply] Received lead — score: ${score} (${points} pts)`);

    // Run Sheets + CAPI in parallel. CAPI failure never blocks the Sheets submission.
    const [sheetsResult, capiResult] = await Promise.allSettled([
      fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, lead_score: score }),
      }),
      sendCapiLeadEvent({
        email: body.email ?? "",
        phone: body.phone ?? "",
        score,
        value,
        clientIp,
        clientUserAgent,
        eventSourceUrl,
      }),
    ]);

    if (sheetsResult.status === "rejected") {
      console.error("[Apply] Sheets submission failed:", sheetsResult.reason);
    }
    if (capiResult.status === "rejected") {
      console.error("[Apply] CAPI submission failed:", capiResult.reason);
    }

    // Sheets is the source of truth — fail if it didn't go through
    if (sheetsResult.status === "rejected") {
      return NextResponse.json(
        { ok: false, error: "Submission failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, score });
  } catch (err) {
    console.error("[Apply] Unhandled error:", err);
    return NextResponse.json(
      { ok: false, error: "Submission failed" },
      { status: 500 }
    );
  }
}
