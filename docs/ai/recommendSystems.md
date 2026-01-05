# recommendSystems

**Service Function:** `recommendSystems(industry: string, bottlenecks: any)`  
**Edge Function:** `recommend-systems`

## Executive Summary

| Feature | Description |
| :--- | :--- |
| **Core Capability** | Solution Architecture & System Mapping |
| **AI Agent** | **The Solutions Architect** |
| **Gemini 3 Model** | `gemini-3-pro-preview` |
| **Key Workflow** | Problem-to-Solution Reasoning |
| **Business Outcome** | A concrete Scope of Work (SOW) based on value, not features. |

## Purpose
Acts as the "Solutions Architect". It maps the specific pain points identified in Step 2 to concrete "Systems" (Outcomes) rather than just tools. It prioritizes systems that offer the highest leverage for the specific industry.

## Workflow Logic (Mermaid)

```mermaid
graph LR
    Answers[User Answers (Pain Points)] --> Architect[Architect Agent (Gemini 3)]
    
    subgraph "Mapping Logic"
        P1[Pain: Manual Data Entry] --> S1[System: Ops Automation]
        P2[Pain: High CAC] --> S2[System: Lead Nurture Engine]
        P3[Pain: Slow Reporting] --> S3[System: Data Dashboard]
    end
    
    Architect --> P1 & P2 & P3
    S1 & S2 & S3 --> Rank[Ranking Algorithm]
    Rank --> Output[Top 5 Recommendations]
```

## Gemini 3 Configuration & Logic

### Models & Config
*   **Model:** `gemini-3-pro-preview`
    *   *Reasoning:* Complex mapping is required. The model must understand that a user complaining about "Leads" needs a "CRM/Growth System", while a user complaining about "Chaos" needs an "Operating System".
*   **Thinking Config:** `thinkingBudget: 1024`
    *   *Usage:* Used to determine the *highest impact* system. If a user has 3 problems, which one solves the biggest financial pain?

### Logic & Agents
1.  **The Architect (Core):** Uses a mental library of standard Business AI Systems (Growth, Ops, Intelligence).
2.  **The Prioritizer (Advanced):** It marks specific systems as `isRecommended: true`. The logic favors systems that solve the bottleneck identified as "Priority" in Step 2.

## Inputs & Outputs

**Input Payload:**
```json
{
  "industry": "Real Estate",
  "bottlenecks": {
    "q1": ["Lead response time is too slow"],
    "q2": ["Paperwork errors"]
  }
}
```

**Output Schema (SystemRecommendation[]):**
```json
[
  {
    "id": "sys_auto_response",
    "title": "24/7 Lead Response Agent",
    "benefit": "Instantly engages inbound leads via SMS/Email to prevent drop-off.",
    "isRecommended": true,
    "category": "Growth"
  },
  {
    "id": "sys_doc_ai",
    "title": "Contract Analysis Engine",
    "benefit": "Parses contracts and flags errors automatically.",
    "isRecommended": false,
    "category": "Operations"
  }
]
```

## Real World Examples
*   **Input:** User selects "I have no visibility into profits."
    *   *Recommendation:* "Financial Intelligence Dashboard" (Category: Intelligence).
*   **Input:** User selects "I spend 4 hours a day on email."
    *   *Recommendation:* "Inbox Triaging Agent" (Category: Operations).
