
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

    const { analysis, profile } = await req.json()

    // Schema matching BottleneckQuestion interface
    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING, enum: ['Business Focus', 'Operational Friction', 'Speed to Execution', 'Priority'] },
          text: { type: Type.STRING },
          rationale: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['single', 'multi'] },
          options: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: {
                text: { type: Type.STRING },
                system_hint: { type: Type.STRING }
              },
              required: ['text', 'system_hint']
            } 
          }
        },
        required: ['id', 'category', 'text', 'rationale', 'type', 'options']
      }
    };

    const prompt = `
      ROLE:
      You are a Senior Industry Consultant. You are interviewing a business owner to find their most expensive problems.

      CONTEXT:
      - Industry: ${analysis.detectedIndustry}
      - Model: ${analysis.businessModel}
      - Readiness: ${analysis.digitalReadiness}
      - Description: ${profile.description}

      INSTRUCTIONS:
      1. **Analyze the Industry:**
         - Identify the specific "currency" of this industry (e.g., Agencies = Hours, Retail = Inventory/Margins, SaaS = MRR/Churn).
         - Retrieve the specific jargon used by experts in this field.

      2. **Generate 4 Diagnostic Sections:**
         - **Section 1 (Growth):** Ask about the biggest revenue blocker. Options MUST be specific outcomes (e.g., "Reduce Cart Abandonment" vs "Get more sales").
         - **Section 2 (Time):** Ask about manual work. Describe the actual task (e.g., "Manually copy-pasting leads").
         - **Section 3 (Velocity):** Ask how long a key action takes (e.g., "Launching a campaign").
         - **Section 4 (Priority):** Ask for the "North Star" goal.

      3. **Map to Systems (Crucial):**
         - For every option provided, assign a 'system_hint' tag in snake_case.
         - This tag determines which software we recommend in the next step.
         - Examples: 'lead_gen_ai', 'inventory_prediction', 'support_autobot'.

      NEGATIVE CONSTRAINTS:
      - NEVER use the words: "bottleneck", "friction", "optimization", "landscape", "leverage".
      - Instead of "Operational Friction", ask "Where is time wasted?".
      - Instead of "Business Focus", ask "What is slowing growth?".

      OUTPUT:
      - Return valid JSON matching the schema.
    `

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
