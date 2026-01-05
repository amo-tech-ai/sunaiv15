
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
      Analyze this business:
      Name: ${company_name}
      URL: ${website_url || 'Not provided'}
      Self-described Industry: ${industry_hint}
      Description: ${description}

      INSTRUCTIONS:
      1. Use Google Search to verify the company. 
      2. If a URL is provided, specifically search for and analyze their 'About Us' and 'Products/Services' pages to extract specific industry keywords and actual offerings.
      3. Infer the specific industry niche (be precise, e.g., "Fintech - Payment Processing" instead of just "Fintech" or "Technology"), their primary business model (B2B/B2C/etc), and their apparent digital maturity.
      4. Provide 3 key strategic observations based on their specific product features or service claims found in the search results.
    `

    // Streaming response setup
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        tools: [{googleSearch: {}}],
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
