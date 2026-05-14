// Scores an inbound creator application as "hot" or "medium".
// Bad leads are gated in the frontend and never reach this function.
//
// Signals (max 10 points):
//   followers:        2 = 20k+     | 1 = 5k-20k
//   engagement:       2 = 6%+      | 1 = 3-6% or consistent
//   brand experience: 2 = multiple | 1 = few/UGC
//   availability:     2 = fully    | 1 = mostly
//   content type:     2 = travel/lifestyle | 1 = mix/party/fitness
//
// Thresholds:  7-10 pts = "hot" (value 100) | 0-6 pts = "medium" (value 30)

export type LeadScore = "hot" | "medium";

export interface ScoringResult {
  score: LeadScore;
  value: number; // monetary value for Meta CAPI Value-Based Optimization
  points: number;
}

export function scoreCreatorLead(
  payload: Record<string, string>
): ScoringResult {
  let points = 0;

  const followers = payload.follower_count ?? "";
  if (["20k\u2013100k", "100k+"].includes(followers)) points += 2;
  else if (followers === "5k\u201320k") points += 1;

  const engagement = payload.engagement_rate ?? "";
  if (["6\u201310%", "10%+"].includes(engagement)) points += 2;
  else if (
    ["3\u20136%", "Not sure but I get consistent engagement"].includes(
      engagement
    )
  )
    points += 1;

  const brand = payload.brand_experience ?? "";
  if (brand === "Yes, multiple collaborations") points += 2;
  else if (
    [
      "Yes, a few collaborations",
      "Not officially, but I've created UGC-style content",
    ].includes(brand)
  )
    points += 1;

  const availability = payload.availability ?? "";
  if (availability === "Yes, fully available") points += 2;
  else if (availability.startsWith("Mostly available")) points += 1;

  const contentType = payload.content_type ?? "";
  if (["Travel", "Lifestyle"].includes(contentType)) points += 2;
  else if (
    ["Party / social", "Fitness / Wellness", "A mix of the above"].includes(
      contentType
    )
  )
    points += 1;

  const score: LeadScore = points >= 7 ? "hot" : "medium";
  const value = score === "hot" ? 100 : 30;

  return { score, value, points };
}
