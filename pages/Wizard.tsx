
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { analyzeBusiness, generateQuestions, recommendSystems, assessReadiness, generateStrategy } from '../services/geminiService';
import { BusinessProfile, BusinessAnalysis, BottleneckQuestion, SystemRecommendation, ReadinessAssessment, StrategyPhase } from '../types';

// Modular Component Imports
import { WizardLayout } from '../components/wizard/WizardLayout';
import { LeftPanel } from '../components/wizard/LeftPanel';
import { RightPanel } from '../components/wizard/RightPanel';
import { Step1Context } from '../components/wizard/Step1Context';
import { Step2DeepDive } from '../components/wizard/Step2DeepDive';
import { Step3Systems } from '../components/wizard/Step3Systems';
import { Step4Readiness } from '../components/wizard/Step4Readiness';
import { Step5Strategy } from '../components/wizard/Step5Strategy';

const INDUSTRIES = ['E-Commerce', 'SaaS', 'Healthcare', 'Real Estate', 'Legal Services', 'Marketing Agency', 'Manufacturing', 'Fintech', 'Other'];

export default function Wizard() {
  const navigate = useNavigate();
  const { setAppState } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [streamData, setStreamData] = useState("");

  // Data State
  const [profile, setProfile] = useState<BusinessProfile>({ fullName: '', companyName: '', industry: '', description: '', website: '' });
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(null);
  const [questions, setQuestions] = useState<BottleneckQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [systems, setSystems] = useState<SystemRecommendation[]>([]);
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [readiness, setReadiness] = useState<ReadinessAssessment | null>(null);
  const [strategy, setStrategy] = useState<StrategyPhase[]>([]);

  // --- Handlers ---

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleStreamChunk = (chunk: string) => {
    setStreamData(prev => prev + chunk);
  };

  const handleStep1 = async () => {
    if (!profile.fullName || !profile.companyName || !profile.industry || !profile.description) return;
    setLoading(true);
    setLoadingText("Analyzing your business...");
    setStreamData("");
    
    // UI Loading simulation for UX, still runs alongside stream
    const timer1 = setTimeout(() => setLoadingText("Researching your industry via Google..."), 1500);
    const timer2 = setTimeout(() => setLoadingText("Identifying key growth signals..."), 3500);

    try {
      const result = await analyzeBusiness(profile, handleStreamChunk);
      setAnalysis(result);
      
      setLoadingText("Generating deep-dive questions...");
      setStreamData(""); // Reset for next call
      const qs = await generateQuestions(result, profile, handleStreamChunk);
      setQuestions(qs);
      
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setLoading(false);
      setLoadingText("");
      setStreamData("");
    }
  };

  const handleStep2 = async () => {
    setLoading(true);
    setLoadingText("Mapping AI systems to your needs...");
    setStreamData("");
    try {
        const recs = await recommendSystems(analysis?.detectedIndustry || profile.industry, answers, handleStreamChunk);
        setSystems(recs);
        // Auto-select recommended
        setSelectedSystems(recs.filter(r => r.isRecommended).map(r => r.id));
        setStep(3);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
        setStreamData("");
    }
  };

  const handleStep3 = async () => {
    if (selectedSystems.length === 0) return;
    setLoading(true);
    setLoadingText("Checking implementation readiness...");
    setStreamData("");
    try {
        const selectedSystemNames = systems.filter(s => selectedSystems.includes(s.id)).map(s => s.title);
        const assessment = await assessReadiness(profile, selectedSystemNames, handleStreamChunk);
        setReadiness(assessment);
        setStep(4);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
        setStreamData("");
    }
  };

  const handleStep4 = async () => {
    setLoading(true);
    setLoadingText("Architecting execution plan...");
    setStreamData("");
    try {
        const selectedSystemNames = systems.filter(s => selectedSystems.includes(s.id)).map(s => s.title);
        const plan = await generateStrategy(profile, selectedSystemNames, handleStreamChunk);
        setStrategy(plan);
        setStep(5);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
        setStreamData("");
    }
  };

  const handleFinish = () => {
    setAppState({
      hasCompletedWizard: true,
      businessName: profile.companyName,
      phases: strategy
    });
    navigate('/dashboard');
  };

  // --- Header/Title Logic ---
  const getHeaderContent = () => {
    switch (step) {
      case 1: return { title: "Tell us about your business", sub: "We use this to understand your business and design a practical AI plan." };
      case 2: return { title: "Identify Business Bottlenecks", sub: "Let's identify where we can increase revenue, reduce costs, and save time." };
      case 3: return { title: "Architect your system", sub: "Select systems based on problems, not tools." };
      case 4: return { title: "Readiness Check", sub: "Set expectations and build trust." };
      case 5: return { title: "Your Execution Plan", sub: "Turn insight into a concrete plan." };
      default: return { title: "", sub: "" };
    }
  };

  const header = getHeaderContent();

  return (
    <WizardLayout
      leftPanel={<LeftPanel step={step} profile={profile} analysis={analysis} />}
      rightPanel={<RightPanel step={step} loading={loading} loadingText={loadingText} analysis={analysis} streamData={streamData} />}
    >
      {/* Mobile Step Indicator */}
      <div className="lg:hidden mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-brand-600">Step {step} of 5</span>
          <span className="text-xs text-slate-500">{step === 1 ? 'Context' : 'Analysis'}</span>
        </div>
        <div className="h-1 bg-slate-200 rounded-full w-full">
          <div className="h-1 bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${(step/5)*100}%` }} />
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-display text-slate-900 mb-4 animate-fade-in">
          {header.title}
        </h1>
        <p className="text-lg text-slate-500 animate-fade-in">
          {header.sub}
        </p>
      </div>

      {step === 1 && (
        <Step1Context 
          profile={profile} 
          setProfile={setProfile} 
          onNext={handleStep1} 
          loading={loading}
          industries={INDUSTRIES}
        />
      )}

      {step === 2 && (
        <Step2DeepDive 
          questions={questions} 
          answers={answers} 
          setAnswers={setAnswers} 
          onNext={handleStep2} 
          onBack={handleBack}
          loading={loading} 
        />
      )}

      {step === 3 && (
        <Step3Systems 
          systems={systems} 
          selectedSystems={selectedSystems} 
          setSelectedSystems={setSelectedSystems} 
          onNext={handleStep3} 
          onBack={handleBack}
          loading={loading} 
        />
      )}

      {step === 4 && (
        <Step4Readiness 
          readiness={readiness} 
          onNext={handleStep4} 
          onBack={handleBack}
          loading={loading} 
        />
      )}

      {step === 5 && (
        <Step5Strategy 
          strategy={strategy} 
          onFinish={handleFinish}
          onBack={handleBack}
          loading={loading}
        />
      )}

    </WizardLayout>
  );
}
