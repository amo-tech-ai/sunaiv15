
import React from 'react';
import { Button, Input, Select, TextArea } from '../ui';
import { BusinessProfile } from '../../types';
import { ArrowRight } from 'lucide-react';

interface Step1ContextProps {
  profile: BusinessProfile;
  setProfile: React.Dispatch<React.SetStateAction<BusinessProfile>>;
  onNext: () => void;
  loading: boolean;
  industries: string[];
}

export const Step1Context: React.FC<Step1ContextProps> = ({ profile, setProfile, onNext, loading, industries }) => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid grid-cols-2 gap-6">
        <Input 
          label="Full Name" 
          placeholder="Jane Doe" 
          value={profile.fullName} 
          onChange={e => setProfile({...profile, fullName: e.target.value})}
          disabled={loading} 
        />
        <Input 
          label="Company Name" 
          placeholder="Acme Inc." 
          value={profile.companyName} 
          onChange={e => setProfile({...profile, companyName: e.target.value})} 
          disabled={loading}
        />
      </div>
      <Input 
        label="Website URL (Recommended)" 
        placeholder="https://acme.com" 
        value={profile.website} 
        onChange={e => setProfile({...profile, website: e.target.value})} 
        disabled={loading}
      />
      <Select 
        label="Industry" 
        options={industries} 
        value={profile.industry} 
        onChange={e => setProfile({...profile, industry: e.target.value})} 
        disabled={loading}
      />
      <TextArea 
        label="Business Description & Challenges" 
        placeholder="What do you sell, who do you sell to, and what slows growth today?"
        value={profile.description}
        onChange={e => setProfile({...profile, description: e.target.value})} 
        disabled={loading}
      />
      <div className="pt-6">
        <Button 
          loading={loading}
          onClick={onNext} 
          disabled={!profile.fullName || !profile.companyName || !profile.industry || !profile.description}
          className="w-full text-lg"
        >
          Continue <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
