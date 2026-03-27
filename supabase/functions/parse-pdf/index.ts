import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Extract text from a PDF by parsing the binary content.
 * This handles text-based PDFs (not scanned images).
 */
function extractTextFromPdf(bytes: Uint8Array): string {
  const raw = new TextDecoder("latin1").decode(bytes);
  const textParts: string[] = [];

  // Method 1: Extract text from BT...ET blocks (standard PDF text objects)
  const btEtRegex = /BT\s([\s\S]*?)ET/g;
  let match;
  while ((match = btEtRegex.exec(raw)) !== null) {
    const block = match[1];
    // Extract strings in parentheses (Tj/TJ operators)
    const strRegex = /\(([^)]*)\)/g;
    let strMatch;
    while ((strMatch = strRegex.exec(block)) !== null) {
      const decoded = strMatch[1]
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\\\/g, "\\")
        .replace(/\\([()])/g, "$1");
      if (decoded.trim()) {
        textParts.push(decoded);
      }
    }
    // Extract hex strings <>
    const hexRegex = /<([0-9a-fA-F]+)>/g;
    let hexMatch;
    while ((hexMatch = hexRegex.exec(block)) !== null) {
      const hex = hexMatch[1];
      let str = "";
      for (let i = 0; i < hex.length; i += 2) {
        const code = parseInt(hex.substring(i, i + 2), 16);
        if (code >= 32 && code < 127) {
          str += String.fromCharCode(code);
        }
      }
      if (str.trim()) {
        textParts.push(str);
      }
    }
  }

  // Method 2: If no BT/ET blocks found, try stream content
  if (textParts.length === 0) {
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    while ((match = streamRegex.exec(raw)) !== null) {
      const content = match[1];
      // Only extract readable ASCII text
      const readable = content.replace(/[^\x20-\x7E\n\r\t]/g, " ");
      const cleaned = readable.replace(/\s+/g, " ").trim();
      if (cleaned.length > 10) {
        textParts.push(cleaned);
      }
    }
  }

  return textParts.join(" ").replace(/\s+/g, " ").trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    
    let fileBytes: Uint8Array;
    let fileName = "upload.pdf";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return new Response(
          JSON.stringify({ error: "No file uploaded" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      fileName = file.name;
      fileBytes = new Uint8Array(await file.arrayBuffer());
    } else {
      // Handle raw binary upload
      fileBytes = new Uint8Array(await req.arrayBuffer());
    }

    // Verify PDF magic bytes
    const header = new TextDecoder("latin1").decode(fileBytes.slice(0, 5));
    if (!header.startsWith("%PDF")) {
      return new Response(
        JSON.stringify({ error: "Invalid PDF file" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (fileBytes.length > 20 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "File too large. Maximum size is 20MB." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const text = extractTextFromPdf(fileBytes);

    if (!text || text.length < 10) {
      // Fallback: Send the PDF to AI to describe what it can see
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) {
        return new Response(
          JSON.stringify({ error: "Could not extract text from this PDF. It may be a scanned document. Please paste the text manually." }),
          { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Use AI to extract text from the raw content
      const base64 = btoa(String.fromCharCode(...fileBytes.slice(0, 50000)));
      
      return new Response(
        JSON.stringify({ error: "Could not extract text from this PDF. It may be scanned or image-based. Please paste the text manually instead." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ text, fileName }),
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
