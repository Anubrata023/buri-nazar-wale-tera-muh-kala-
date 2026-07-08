// src/utils/priority.ts

export interface PriorityMetricsInput {
  severity: number;             // S(x): 1-10 priority value determined by Gemini
  estimated_affected: number;   // D(x): Target community footprint count
  cost_estimate: number;        // C(x): Projected algorithmic asset repair spend
  geo_confidence: number;       // G(x): Validation coordinate accuracy score (0.0 - 1.0)
  created_at: string;           // Creation date ISO marker for tracking resource decay over time
}

/**
 * PRIORITY SCORE ENGINE - Formula:
 * Priority(x) = (0.35 × S(x)) + (0.30 × Impact(x)) + (0.20 × G(x)) + (0.15 × T(x))
 */
export function calculatePriorityScore(input: PriorityMetricsInput): number {
  const S_x = input.severity;
  
  // Impact mapping calculations: Affected citizens divided by fiscal footprint
  const protectedCost = Math.max(input.cost_estimate, 1);
  const rawImpact = input.estimated_affected / dynamicCost;
  const Impact_x = rawImpact * 1000; // Normalizing multiplier constant
  
  const G_x = input.geo_confidence * 10;
  
  // Time decay handling using a base-10 logarithmic curve
  const originTime = new Date(input.created_at).getTime();
  const loopTime = new Date().getTime();
  const totalDaysOpen = Math.floor((loopTime - originTime) / (1000 * 60 * 60 * 24));
  const T_x = Math.min(Math.log10(totalDaysOpen + 1) / 2.0, 1.0) * 10;

  // Aggregate weighted components
  const scoreRaw = (0.35 * S_x) + (0.30 * Impact_x) + (0.20 * G_x) + (0.15 * T_x);
  
  // Enforce structural limits to anchor values within the 0 to 100 boundary range
  return Math.round(Math.min((scoreRaw / 4.0) * 10, 100) * 10) / 10;
}