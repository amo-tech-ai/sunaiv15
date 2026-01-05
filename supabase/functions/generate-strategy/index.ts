
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Create a 3-phase implementation strategy for ${profile.companyName} implementing ${systems.join(', ')}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    return new Response(response.text, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
  }
})