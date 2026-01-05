
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { GoogleGenAI, Type } from "npm:@google/genai@^0.1.1"
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

      Use Google Search to verify the company. 
      If a URL is provided, browse it using the search tool to understand their actual offerings.
      Infer the specific industry niche, their primary business model (B2B/B2C/etc), and their apparent digital maturity based on their web presence.
      Provide 3 key strategic observations.
    `

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp', // Or gemini-3-flash-preview when available/stable
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        tools: [{googleSearch: {}}],
      }
    });

    const result = JSON.parse(response.text || "{}");

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})