
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

    // 1. Definition of Industry Blueprints (The "Ground Truth")
    const blueprints = `
      1. Startups & SaaS
      Context: High growth pressure, churn sensitivity, CAC/LTV focus.
      - Business Focus: Barrier to ARR growth (Lead Vol, Conversion, Churn, ACV).
      - Operational Friction: Manual work (Support Tickets, Onboarding, CRM Entry, Debugging).
      - Speed: Growth loops (Content Production, Feature Launches, Sales Cycles, Data Silos).

      2. E-Commerce & Retail
      Context: Inventory, margins, returns, omnichannel.
      - Business Focus: Margin killers (CAC, AOV, Returns, Cart Abandonment).
      - Operational Friction: Time sinks (Inventory/SKU, CS Orders, Refunds, Product Uploads).
      - Speed: Campaign velocity (Creative Prod, Influencer Coord, Ad Testing, Agency Turnaround).

      3. Agencies & Professional Services
      Context: Billable hours, utilization, feast/famine.
      - Business Focus: Scaling block (Lead Flow, Founder Selling, LTV, Margins).
      - Operational Friction: Non-billable time (Reporting, Proposals, Onboarding, Invoicing).
      - Speed: Delivery bottlenecks (QA/Review, Client Delays, Resourcing, Hiring).

      4. Real Estate
      Context: Speed-to-lead, transaction coordination, local presence.
      - Business Focus: Deal loss (Speed to Lead, Nurturing Cold Leads, New Listings, Referrals).
      - Operational Friction: Admin (Transaction Coord, Showings, CRM Updates, Marketing Flyers).
      - Speed: Closing speed (Signatures, Vendor Coord, Client Comms, Market Research).
      
      5. General / Other (Fallback)
      Context: Fundamental business health.
      - Business Focus: Revenue blocker (New Leads, Closing Deals, Repeat Business, Pricing).
      - Operational Friction: Manual admin (Data Entry, Scheduling, Email/Comms, Paperwork).
      - Speed: Project completion (Decision Making, Resource Availability, Process Clarity, Tech Issues).
    `;

    // 2. Updated Schema with system_hint
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
      You are an expert Industry Consultant. Your goal is to diagnose business bottlenecks.
      
      INPUT CONTEXT:
      Industry: ${analysis.detectedIndustry} (Confidence: ${analysis.detectedIndustry === 'Other' ? 'Low' : 'High'})
      Model: ${analysis.businessModel}
      Description: ${profile.description}

      INSTRUCTIONS:
      1. Analyze the input industry. Match it to one of the following Blueprints: 
         [Startups/SaaS, E-Commerce, Agencies, Real Estate]. 
         If no strong match, use 'General'.
      
      2. Generate exactly 4 questions based on the selected Blueprint structure:
         - Question 1 (Business Focus): Revenue/Growth bottlenecks.
         - Question 2 (Operational Friction): Manual work/Time sinks.
         - Question 3 (Speed to Execution): Velocity blockers.
         - Question 4 (Priority): The "North Star" fix (e.g. "Automate everything" vs "Fix Data").

      3. CRITICAL RULES:
         - Do NOT use generic AI language like "optimize synergies". Use industry jargon (e.g. "SKU", "Churn", "Billable Hours").
         - If the Industry is vague or 'Other', make Question 1 a clarification question: "Which model best describes your business?" with options mapping to the blueprint categories.
         - Each option MUST have a 'system_hint' tag (snake_case) that implies a software solution (e.g. 'crm_auto', 'inventory_sync').

      REFERENCE BLUEPRINTS:
      ${blueprints}
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
