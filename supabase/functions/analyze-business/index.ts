
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { GoogleGenAI, Type } from "npm:@google/genai@^1.0.0"
import process from "node:process"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })

    const { company_name, website_url, industry_hint, description } = await req.json()

    const schema = {
      type: Type.OBJECT,
      properties: {
        detectedIndustry: { type: Type.STRING },
        businessModel: { type: Type.STRING, enum: ['B2B', 'B2C', 'Services', 'SaaS', 'Hybrid', 'Marketplace', 'Other'] },
        digitalReadiness: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
        observations: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['detectedIndustry', 'businessModel', 'digitalReadiness', 'observations']
    };

    const prompt = `
      ROLE:
      You are an expert Market Researcher and Business Analyst. Your job is to verify a company's existence and analyze its business model using real-time web data.

      INPUTS:
      - Company Name: ${company_name}
      - Website: ${website_url || 'Not provided'}
      - User Description: ${description}
      - Industry Hint: ${industry_hint}

      INSTRUCTIONS:
      1. **Verification (Google Search):**
         - If a URL is provided, search specifically for the "About Us", "Pricing", and "Services" pages of that domain to extract ground truth.
         - If NO URL is provided, search the Company Name + Industry Hint to find the most likely entity.

      2. **Analysis:**
         - **Industry Classification:** Do not use generic tags like "Retail". Be specific. (e.g., "Fashion E-Commerce", "B2B SaaS - Fintech", "Local Service - HVAC").
         - **Business Model:** Infer the primary model (B2B, B2C, Marketplace, Agency).
         - **Digital Readiness:** Assess their maturity based on web signals (e.g., modern stack vs legacy, active social presence vs dormant).

      3. **Output Generation:**
         - Return a JSON object matching the output schema.
         - 'observations' must be 3 specific facts found during search, not generic statements.

      FALLBACK RULES:
      - If the company cannot be found, fallback to the User Description and mark confidence as 'Low' in internal metadata, but generate a plausible profile based on the description.
    `

    // Streaming response setup
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        tools: [{googleSearch: {}}],
        temperature: 0.2
      }
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
        } catch (e) {
          console.error("Stream error", e);
          controller.error(e);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
