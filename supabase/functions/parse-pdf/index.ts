import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - pdf-parse for Deno
import * as pdfParse from "https://cdn.skypack.dev/pdf-parse";

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
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file uploaded" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (file.type !== "application/pdf") {
      return new Response(
        JSON.stringify({ error: "Only PDF files are supported" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 20MB limit
    if (file.size > 20 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "File too large. Maximum size is 20MB." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Use pdf-parse to extract text
    let text = "";
    try {
      const pdfData = await pdfParse.default(uint8Array);
      text = pdfData.text || "";
    } catch (pdfErr) {
      console.error("pdf-parse failed, falling back to basic extraction:", pdfErr);
      // Fallback: basic text extraction from binary
      const decoder = new TextDecoder("utf-8", { fatal: false });
      const rawText = decoder.decode(uint8Array);
      // Extract readable text between BT/ET markers or stream objects
      const matches = rawText.match(/\(([^)]+)\)/g);
      if (matches) {
        text = matches.map(m => m.slice(1, -1)).join(" ");
      }
    }

    if (!text.trim()) {
      return new Response(
        JSON.stringify({ error: "Could not extract text from PDF. The file may be scanned/image-based. Please paste the text manually." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ text: text.trim() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("parse-pdf error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Failed to parse PDF" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
