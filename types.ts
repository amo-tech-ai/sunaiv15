// Business Context
export interface BusinessProfile {
  fullName: string;
  companyName: string;
  website?: string;
  industry: string;
  description: string;
}

// AI Analysis Result (Step 1)
export interface BusinessAnalysis {
  detectedIndustry: string;
  businessModel: 'B2B' | 'B2C' | 'Services' | 'SaaS' | 'Hybrid' | 'Marketplace' | 'Other';
  digitalReadiness: 'Low' | 'Medium' | 'High';
  observations: string[];
}

// Industry Deep Dive (Step 2)
export interface BottleneckQuestion {
  id: string;
  category: 'Business Focus' | 'Operational Friction' | 'AI Leverage';
  text: string;
  rationale: string; // "Why this matters"
  type: 'single' | 'multi' | 'slider';
  options?: string[];
}

// System Selection (Step 3)
export interface SystemRecommendation {
  id: string;
  title: string;
  benefit: string;
  isRecommended: boolean;
  category: 'Growth' | 'Operations' | 'Intelligence';
}

// Readiness (Step 4)
export interface ReadinessAssessment {
  score: number; // 0-100
  breakdown: {
    tech: number;
    process: number;
    data: number;
    team: number;
  };
  criticalGaps: string[];
  quickWins: string[];
}

// Strategy (Step 5)
export interface StrategyPhase {
  phase: number;
  name: string;
  description: string;
  timelineWeeks: string;
  deliverables: string[];
}

// Global App State
export interface AppState {
  step: number;
  profile: BusinessProfile;
  analysis: BusinessAnalysis | null;
  selectedBottlenecks: Record<string, any>;
  selectedSystems: string[];
  readiness: ReadinessAssessment | null;
  strategy: StrategyPhase[];
}
