
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

    const { industry, bottlenecks } = await req.json()

    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          benefit: { type: Type.STRING },
          isRecommended: { type: Type.BOOLEAN },
          category: { type: Type.STRING, enum: ['Growth', 'Operations', 'Intelligence'] }
        },
        required: ['id', 'title', 'benefit', 'isRecommended', 'category']
      }
    };

    const response = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: `Recommend 5 AI/Business systems for a ${industry} company dealing with: ${JSON.stringify(bottlenecks)}. Mark 2-3 as recommended.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 1024 }
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
