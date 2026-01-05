
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
        type: Type.OBJECT,
        properties: {
            score: { type: Type.INTEGER },
            breakdown: { 
                type: Type.OBJECT,
                properties: {
                    tech: { type: Type.INTEGER },
                    process: { type: Type.INTEGER },
                    data: { type: Type.INTEGER },
                    team: { type: Type.INTEGER }
                }
            },
            criticalGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            quickWins: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Assess readiness for implementing ${systems.join(', ')} for ${profile.companyName} (${profile.description}). Be critical but encouraging.`,
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