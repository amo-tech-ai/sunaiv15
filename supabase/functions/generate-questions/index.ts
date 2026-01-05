
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

    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING, enum: ['Business Focus', 'Operational Friction', 'Speed to Execution', 'Priority'] },
          text: { type: Type.STRING },
          rationale: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['single'] },
          options: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['id', 'category', 'text', 'rationale', 'type', 'options']
      }
    };

    const prompt = `
      You are a Senior Business Consultant. Design a consulting conversation for this client.
      
      Client Context:
      Company: ${profile.companyName}
      Industry: ${analysis.detectedIndustry}
      Model: ${analysis.businessModel}
      Description: ${profile.description}

      Task: Generate exactly 4 questions to identify where AI can increase revenue, reduce costs, or save time.
      Structure the 4 questions exactly as follows:
      1. Category: 'Business Focus'
      2. Category: 'Operational Friction'
      3. Category: 'Speed to Execution'
      4. Category: 'Priority'

      Ensure options are specific to the ${analysis.detectedIndustry} industry.
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
