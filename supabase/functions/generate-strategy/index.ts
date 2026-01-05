
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

    const prompt = `
      ROLE:
      You are a Senior Project Manager. You organize work into logical phases to ensure successful delivery.

      INPUTS:
      - Company: ${profile.companyName} (${profile.description})
      - Selected Systems: ${systems.join(', ')}

      INSTRUCTIONS:
      1. **Sequence the Work (3 Phases):**
         - **Phase 1 (Foundation):** Must address "Critical Gaps" (e.g., Data Cleanup, Setup).
         - **Phase 2 (Implementation):** Deploy the core "Recommended" systems.
         - **Phase 3 (Optimization):** Scale, reporting, and advanced features.

      2. **Estimate Timelines:**
         - Be conservative. Double the standard timelines if maturity looks low.
         - Format: "X-Y Weeks".

      3. **Define Deliverables:**
         - For each phase, list 3-4 tangible assets (e.g., "CRM Integration", "Playbook PDF", "Live Agent").

      OUTPUT:
      - Return valid JSON matching the schema.
    `;

    const response = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 2048 }
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
