
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

    const response = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: `Assess readiness for implementing ${systems.join(', ')} for ${profile.companyName} (${profile.description}). Be critical but encouraging.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 4096 }
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
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
  }
})
