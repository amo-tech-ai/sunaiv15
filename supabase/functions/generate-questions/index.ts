
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

      3. Agencies & Professional Services (including Legal, Marketing)
      Context: Billable hours, utilization, feast/famine.
      - Business Focus: Scaling block (Lead Flow, Founder Selling, LTV, Margins).
      - Operational Friction: Non-billable time (Reporting, Proposals, Onboarding, Invoicing).
      - Speed: Delivery bottlenecks (QA/Review, Client Delays, Resourcing, Hiring).

      4. Real Estate
      Context: Speed-to-lead, transaction coordination, local presence.
      - Business Focus: Deal loss (Speed to Lead, Nurturing Cold Leads, New Listings, Referrals).
      - Operational Friction: Admin (Transaction Coord, Showings, CRM Updates, Marketing Flyers).
      - Speed: Closing speed (Signatures, Vendor Coord, Client Comms, Market Research).

      5. Fintech
      Context: Compliance, trust, user acquisition, transaction volume.
      - Business Focus: User trust (Security), CAC, Transaction volume, Fraud rates.
      - Operational Friction: KYC/AML checks, Customer support (sensitive), Reconciliation, Compliance reporting.
      - Speed: Feature rollout vs Compliance, Settlement speed.

      6. Healthcare
      Context: Patient care, privacy (HIPAA), admin burden.
      - Business Focus: Patient volume, Billing efficiency, Care quality, No-show rates.
      - Operational Friction: EMR data entry, Appointment scheduling, Insurance claims, Transcription.
      - Speed: Patient intake, Diagnosis support, Lab result processing.

      7. Manufacturing
      Context: Supply chain, production efficiency, margins, safety.
      - Business Focus: Output efficiency, Supply chain resilience, Order accuracy, Yield rates.
      - Operational Friction: Quality control, Inventory tracking, Machine maintenance, Shift scheduling.
      - Speed: Production cycles, Quote-to-cash, Prototype to production.
      
      8. General / Other / Unsure
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
      1. Analyze the input industry: '${analysis.detectedIndustry}'.
      
      2. CLARIFICATION RULE: 
         If the industry is generic (e.g., 'Technology', 'Services', 'Other', 'Business', 'Consulting') OR if you are unsure of the specific niche, 
         Question 1 MUST be a Clarifying Question.
         Text: "Which specific model best describes your business?"
         Options: Provide 4 distinct business model options relevant to the generic category (e.g., "SaaS", "Agency", "Marketplace", "Consulting Firm").
         System Hint: Use 'model_identification' for these options.
      
      3. OTHERWISE (if industry is specific):
         Match it to the closest Blueprint: [SaaS, E-Commerce, Agency, Real Estate, Fintech, Healthcare, Manufacturing].
         Generate 4 questions based on the Blueprint structure:
         - Question 1 (Business Focus): Revenue/Growth bottlenecks.
         - Question 2 (Operational Friction): Manual work/Time sinks.
         - Question 3 (Speed to Execution): Velocity blockers.
         - Question 4 (Priority): The "North Star" fix.

      4. CRITICAL RULES:
         - Use industry jargon (e.g., "KYC" for Fintech, "EMR" for Healthcare, "SKU" for Retail, "Billable Hours" for Agencies).
         - 'system_hint' tags MUST be snake_case and imply a specific software solution category (e.g. 'kyc_auto', 'inventory_sync', 'lead_scoring_ai', 'predictive_maintenance'). 
         - Do not use generic tags like 'growth' or 'ops'. Be specific: 'invoice_processing', 'fraud_detection', 'patient_scheduling_ai'.

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
