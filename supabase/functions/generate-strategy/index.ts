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

    const { profile, systems } = await req.json()

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                phase: { type: Type.INTEGER },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                timelineWeeks: { type: Type.STRING },
                deliverables: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        }
    };

    // Uses gemini-3-pro-preview for strategic planning
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create a 3-phase implementation strategy for ${profile.companyName} implementing ${systems.join(', ')}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });

    return new Response(response.text, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
  }
})