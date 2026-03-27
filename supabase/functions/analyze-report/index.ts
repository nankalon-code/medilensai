import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportText } = await req.json();

    if (!reportText || typeof reportText !== "string") {
      return new Response(
        JSON.stringify({ error: "reportText is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are MediLens, an AI medical report analyzer. You receive raw medical report text and return a structured JSON analysis.

IMPORTANT: You MUST respond with valid JSON only. No markdown, no code blocks, no explanation outside JSON.

Return this exact JSON structure:
{
  "summary": "A 2-3 sentence plain-language summary of the report",
  "metrics": [
    {
      "name": "Metric Name",
      "value": "numeric value as string",
      "unit": "unit of measurement",
      "normalRange": "low - high",
      "status": "normal" | "warning" | "critical",
      "explanation": "1-2 sentence plain-language explanation of what this means for the patient"
    }
  ],
  "recommendations": ["actionable recommendation 1", "recommendation 2", "recommendation 3"],
  "riskLevel": "low" | "moderate" | "high",
  "riskExplanation": "1-2 sentence explanation of overall risk assessment"
}

Guidelines:
- Extract ALL measurable metrics from the report
- Compare values against standard medical reference ranges
- Mark as "normal" if within range, "warning" if slightly outside, "critical" if significantly outside
- Write explanations in simple, non-medical language a teenager could understand
- Provide actionable, practical recommendations
- If the text doesn't look like a medical report, still try to extract any health-related info, or return a helpful message in the summary`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Analyze this medical report:\n\n${reportText}` },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the AI response (handle potential markdown code blocks)
    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      parsed = {
        summary: content,
        metrics: [],
        recommendations: [],
        riskLevel: "low",
        riskExplanation: "Could not fully parse the report.",
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-report error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
