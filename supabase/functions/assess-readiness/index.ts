
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

    const prompt = `
      ROLE:
      You are a Risk Auditor. Your job is to prevent project failure by identifying gaps between the client's current state and their desired systems.

      INPUTS:
      - Current State: ${profile.industry} (Readiness: Unknown, please infer from context below)
      - Business Context: ${profile.description}
      - Desired Systems: ${systems.join(', ')}

      INSTRUCTIONS:
      1. **Calculate Readiness Score (0-100):**
         - Start at 100.
         - Deduct 20 points if digital maturity seems Low based on context and they want "Advanced AI".
         - Deduct 10 points for every "Data Silo" risk detected.
         - Deduct 10 points if they lack a technical team but want "Custom Engineering".

      2. **Identify Critical Gaps:**
         - If score < 80, list specific reasons why (e.g., "Your data is not centralized enough for a Predictive Dashboard").
         - Be honest. Do not be "nice". It is better to warn them now than fail later.

      3. **Identify Quick Wins:**
         - List 2 low-effort actions to improve readiness (e.g., "Export customer list to CSV").

      OUTPUT:
      - Return valid JSON matching the schema.
    `;

    const response = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: prompt,
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
