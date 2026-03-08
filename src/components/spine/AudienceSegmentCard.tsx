import { Users, DollarSign, Building2, Signal } from 'lucide-react';

interface AudienceSegmentCardProps {
  name: string;
  description: string;
  size: number;
  estimatedCPM: number;
  annualValue: number;
  interestedPartners: string[];
  dataSignals: string[];
}

export default function AudienceSegmentCard({
  name,
  description,
  size,
  estimatedCPM,
  annualValue,
  interestedPartners,
  dataSignals,
}: AudienceSegmentCardProps) {
  return (
    <div className="bg-card-dark rounded-2xl p-5 text-white border border-border-dark">
      {/* Header */}
      <h3 className="text-base font-bold mb-1">{name}</h3>
      <p className="text-xs text-gray-400 mb-4">{description}</p>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-bg-dark rounded-lg p-3 text-center">
          <Users className="w-4 h-4 text-data-blue mx-auto mb-1" />
          <p className="text-lg font-bold text-accent-light">{size.toLocaleString('en-US')}</p>
          <p className="text-[10px] text-gray-400 uppercase">Audience</p>
        </div>
        <div className="bg-bg-dark rounded-lg p-3 text-center">
          <DollarSign className="w-4 h-4 text-warm-amber mx-auto mb-1" />
          <p className="text-lg font-bold text-accent-light">${estimatedCPM.toFixed(2)}</p>
          <p className="text-[10px] text-gray-400 uppercase">Est. CPM</p>
        </div>
        <div className="bg-bg-dark rounded-lg p-3 text-center">
          <DollarSign className="w-4 h-4 text-accent mx-auto mb-1" />
          <p className="text-lg font-bold text-accent-light">${annualValue.toLocaleString('en-US')}</p>
          <p className="text-[10px] text-gray-400 uppercase">Annual Value</p>
        </div>
      </div>

      {/* Interested partners */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Building2 className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-xs text-gray-400 uppercase tracking-wider">Interested Partners</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {interestedPartners.map((partner) => (
            <span
              key={partner}
              className="text-[10px] font-medium bg-border-dark text-gray-300 px-2 py-0.5 rounded-full"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>

      {/* Data signals */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Signal className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-xs text-gray-400 uppercase tracking-wider">Data Signals</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {dataSignals.map((signal) => (
            <span
              key={signal}
              className="text-[10px] font-medium bg-accent/10 text-accent-light px-2 py-0.5 rounded-full"
            >
              {signal}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
