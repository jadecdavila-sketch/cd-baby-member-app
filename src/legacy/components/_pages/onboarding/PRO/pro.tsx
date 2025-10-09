'use client';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import { useState } from 'react';

const ProAccordion = () => {
  const [performanceRightsOrg, setPerformanceRightsOrg] = useState<string>('');
  const [otherPro, setOtherPro] = useState('');
  const [ipiNumber, setIpiNumber] = useState('');
  const [isniNumber, setIsniNumber] = useState('');

  // PRO options
  const proOptions = [
    { value: 'ascap', label: 'ASCAP' },
    { value: 'bmi', label: 'BMI' },
    { value: 'sesac', label: 'SESAC' },
    { value: 'socan', label: 'SOCAN' },
    { value: 'prs', label: 'PRS for Music' },
    { value: 'gema', label: 'GEMA' },
    { value: 'sacem', label: 'SACEM' },
    { value: 'apra', label: 'APRA AMCOS' },
    { value: 'other', label: 'Other' },
    { value: 'none', label: 'None' },
  ];

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="pro">Performance Rights Organization</Label>
        <Select
          value={performanceRightsOrg}
          onValueChange={setPerformanceRightsOrg}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your PRO" />
          </SelectTrigger>
          <SelectContent>
            {proOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {performanceRightsOrg === 'other' && (
        <div className="space-y-2">
          <Label htmlFor="other-pro">Other PRO</Label>
          <Input
            id="other-pro"
            placeholder="Enter your PRO"
            value={otherPro}
            onChange={(e) => setOtherPro(e.target.value)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="ipi">IPI Number</Label>
        <Input
          id="ipi"
          placeholder="Enter your IPI number"
          value={ipiNumber}
          onChange={(e) => setIpiNumber(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="isni">ISNI Number</Label>
        <Input
          id="isni"
          placeholder="Enter your ISNI number"
          value={isniNumber}
          onChange={(e) => setIsniNumber(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProAccordion;
