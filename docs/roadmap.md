# Sun AI Agency Platform — Strategic Roadmap

**Version:** 1.0  
**Status:** Active  
**Scope:** Core Setup (Wizard) + Client Delivery (Dashboard)

---

## Progress Tracker: Core Modules

| Module | Feature | AI Agent | Gemini 3 Feature | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Foundation** | Project Setup & Repo | - | - | ✅ Complete |
| **Foundation** | UI Component Library | - | - | ✅ Complete |
| **Foundation** | Database Schema (Supabase) | - | - | ❌ Missing |
| **Foundation** | Auth & RLS Policies | - | - | ❌ Missing |
| **Wizard** | Step 1: Business Analysis | **Researcher + Analyst** | Search Grounding | ✅ Complete |
| **Wizard** | Step 2: Bottleneck Discovery | **Consultant** | Thinking Config | ✅ Complete |
| **Wizard** | Step 3: System Mapping | **Architect** | Reasoning | ✅ Complete |
| **Wizard** | Step 4: Readiness Check | **Auditor** | Critical Scoring | ✅ Complete |
| **Wizard** | Step 5: Strategy Gen | **Strategist** | Planning | ✅ Complete |
| **Dashboard** | Data Persistence (Save State) | - | - | ❌ Missing |
| **Dashboard** | Dynamic Deliverables | **Planner** | Structured Output | ⚠️ Partial (Mock) |
| **Dashboard** | Live Intelligence Feed | **Project Monitor** | Search + Reasoning | ⚠️ Static UI Only |

---

## Gemini 3 Tools & Agents Matrix

| AI Agent Role | Responsibility | Gemini 3 Features Used |
| :--- | :--- | :--- |
| **The Researcher** | Verifies entity existence & context | `googleSearch` Grounding, URL Context |
| **The Analyst** | Infers business model & maturity | Structured Outputs (JSON) |
| **The Consultant** | Diagnoses high-value pain points | `thinkingConfig` (Budget: 2048), Context Injection |
| **The Architect** | Maps problems to system solutions | Reasoning, Knowledge Retrieval |
| **The Auditor** | Validates feasibility & risks | `thinkingConfig` (Budget: 4096), Critical Scoring |
| **The Strategist** | Plans timelines & deliverables | Temporal Reasoning, Structured Outputs |
| **The Monitor** | Tracks project health (Post-launch) | `googleSearch` (News/Trends), RAG |

---

# Phase 0 — Foundation (Must-Have)

### Purpose
To establish the technical "bedrock" that ensures security, data persistence, and scalability. Without this, the application is just a demo.

### What’s Included
*   **Supabase Project Setup:** Postgres Database, Auth, Edge Functions environment.
*   **Database Schema:** Tables for `profiles`, `projects`, `assessments`, `strategies`.
*   **Authentication:** Sign Up / Login flow (protecting dashboard routes).
*   **Security:** Row Level Security (RLS) policies to ensure clients only see their own data.
*   **Environment Config:** Secure handling of `API_KEY` and Supabase secrets.

### What’s Explicitly NOT Included
*   Any AI generation (logic is handled in Phase 1).
*   Fancy UI animations.

### Gemini 3 Features Used
*   *None in this phase (Infrastructure focus).*

### AI Agents Involved
*   *None.*

### Deliverables
*   Live Supabase URL.
*   `schema.sql` file.
*   Functional Login Screen.

### Success Criteria
*   A user can sign up, log in, and refresh the page without being logged out.
*   Database tables exist and are writable.

### Risks
*   Improper RLS policies exposing client data.

### Dependencies
*   Vercel / Hosting account.
*   Supabase account.

---

# Phase 1 — Core Wizard (MVP)

### Purpose
To deliver the core "Consultative" value proposition. This is the "Hook" that convinces a client to work with the agency.

### What’s Included
*   **Screens 1-5 Logic:** Full end-to-end flow from context to strategy.
*   **Edge Functions:** 5 distinct functions wrapping Gemini API calls.
*   **State Management:** Saving wizard progress to the database after each step.
*   **Error Handling:** UI feedback when AI calls fail or timeout.

### What’s Explicitly NOT Included
*   PDF Export of the strategy.
*   Editing the strategy manually (Read-only for MVP).

### Gemini 3 Features Used
*   **Google Search Grounding:** For verifying business details in Step 1.
*   **Thinking Config:** For generating "Consultant-grade" questions in Step 2 and rigorous auditing in Step 4.
*   **Structured Outputs:** Enforcing JSON schemas for all steps to ensure UI compatibility.

### AI Agents Involved
*   **Researcher & Analyst:** Step 1.
*   **Consultant:** Step 2.
*   **Architect:** Step 3.
*   **Auditor:** Step 4.
*   **Strategist:** Step 5.

### Deliverables
*   Fully functional `/wizard` route.
*   5 deployed Edge Functions.

### Success Criteria
*   A user can complete the wizard in <5 minutes.
*   The generated strategy feels "tailored" and not generic.
*   All data is persisted to Supabase `projects` table.

### Risks
*   **Latency:** Gemini calls taking >10s causing user drop-off.
*   **Hallucination:** AI inventing systems that don't exist.

### Dependencies
*   Phase 0 (Database).

---

# Phase 2 — Client Dashboard

### Purpose
To transition the user from "Prospect" to "Client". This is where value is delivered over time.

### What’s Included
*   **Dashboard UI:** Overview, Phase Tracker, Deliverables list.
*   **Real Data Binding:** Displaying the *actual* strategy generated in Phase 1 (not mock data).
*   **Project State:** Tracking "Current Phase" and "Progress %".
*   **User Management:** Profile settings (Name, Company Logo).

### What’s Explicitly NOT Included
*   Chat interface with AI.
*   Billing/Stripe integration.
*   Task management (Drag and drop).

### Gemini 3 Features Used
*   **Structured Outputs:** Transforming the stored strategy JSON into dashboard widgets.

### AI Agents Involved
*   **The Planner:** Breaks down the high-level roadmap into a viewable list of deliverables.

### Deliverables
*   Functional `/dashboard` route.
*   Persistent "Project Overview" widget.

### Success Criteria
*   The dashboard accurately reflects the strategy generated in the Wizard.
*   Refreshing the page retains all project data.

### Risks
*   UI complexity on mobile.

### Dependencies
*   Phase 1 (Wizard Data).

---

# Phase 3 — Advanced AI & Automation

### Purpose
To turn the static dashboard into a "Living" system that actively monitors and advises the client.

### What’s Included
*   **Live Intelligence Feed:** A right-panel widget that updates daily.
*   **Streaming Responses:** Making AI calls feel instant in the UI.
*   **Regenerate/Edit:** Allowing users to refine the strategy if requirements change.
*   **Notifications:** Email/In-app alerts for phase completion.

### What’s Explicitly NOT Included
*   Full autonomous execution (AI actually *doing* the marketing).

### Gemini 3 Features Used
*   **Interactions API / Streaming:** For real-time feedback.
*   **Google Search (News):** Monitoring industry news relevant to the client.
*   **Function Calling:** Triggering external tools (e.g., sending an email via Resend).

### AI Agents Involved
*   **The Project Monitor:** Runs daily to check for risks or industry shifts.
*   **The Controller:** Approves changes to the roadmap.

### Deliverables
*   "Intelligence" Panel active on Dashboard.
*   Streaming implementations for all Wizard steps.

### Success Criteria
*   Dashboard provides new value every login (not static).
*   AI latency perceived as <1s due to streaming.

### Risks
*   High API costs from daily monitoring.

### Dependencies
*   Phase 2 (Dashboard).

---

## Timeline Overview

| Phase | Duration | Primary Outcome |
| :--- | :--- | :--- |
| **Phase 0** | 1 Week | **Infrastructure Ready** (Auth + DB) |
| **Phase 1** | 2 Weeks | **Sales Tool Ready** (Wizard generates SOWs) |
| **Phase 2** | 2 Weeks | **Client Portal Ready** (Viewable Roadmap) |
| **Phase 3** | 3 Weeks | **Retention Engine** (Active Monitoring) |

---

## How the Phases Work Together

1.  **Phase 0** builds the secure vault where client data lives.
2.  **Phase 1** fills that vault with high-value, AI-generated strategic data (the "Plan").
3.  **Phase 2** visualizes that Plan, giving the client a window into the work being done.
4.  **Phase 3** keeps the client engaged by constantly updating the Plan based on new external data (News/Trends).

---

## What Can Be Sold at Each Phase

*   **After Phase 1:** You can sell **"AI Strategy Audits"**. Use the Wizard to generate a report, export it (manually), and sell the PDF/Consultation for $500–$2,000.
*   **After Phase 2:** You can sell **"Retainers"**. Clients get login access to track the implementation of the strategy.
*   **After Phase 3:** You can sell **"Premium Monitoring"**. Up-sell clients on having an AI actively watch their industry and adjust their strategy 24/7.
