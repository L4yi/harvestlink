import React from 'react';
import { ProduceListing } from '../../types';
import { formatNaira, formatDateHuman, daysUntilDate } from '../../data/mockData';
import { HarvestStatusBadge } from './StatusBadge';
import { MapPin, Calendar, ShieldCheck, ArrowUpRight, Scale } from 'lucide-react';

interface ProduceCardProps {
  produce: ProduceListing;
  onSelect: (produceId: string) => void;
  actionLabel?: string;
}

export const ProduceCard: React.FC<ProduceCardProps> = ({
  produce,
  onSelect,
  actionLabel = 'Inspect & Reserve',
}) => {
  const harvestTiming = daysUntilDate(produce.expectedHarvestDate);
  const totalTonnes = ((produce.quantityAvailable * produce.unitWeightKg) / 1000).toFixed(1);

  return (
    <article
      onClick={() => onSelect(produce.id)}
      className="group bg-white border border-[#E5EAE5] hover:border-[#166534]/50 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-elevated flex flex-col cursor-pointer"
    >
      {/* Top Photograph Container — 16:10 Balanced Ratio */}
      <div className="relative h-48 w-full bg-[#F8FAF7] overflow-hidden border-b border-[#E5EAE5]">
        <img
          src={produce.images[0]}
          alt={produce.cropName}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17251C]/65 via-transparent to-transparent" />

        {/* Top Bar: Availability Status & Lot Code */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <HarvestStatusBadge status={produce.harvestStatus} compact />
          <span className="px-2 py-0.5 text-[11px] font-mono font-medium bg-[#17251C]/80 text-white backdrop-blur-sm rounded">
            {produce.lotCode}
          </span>
        </div>

        {/* Bottom Overlay: Location & Expected Harvest Date Callout */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
            <span className="font-medium truncate">
              {produce.community}, {produce.state}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-white/95 text-[#17251C] font-mono text-[11px] font-semibold shrink-0">
            {totalTonnes}t avail
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Grade */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-[#647067] mb-1">
            <span className="font-medium uppercase tracking-wider">{produce.category}</span>
            <span className="text-[#166534] font-medium">{produce.qualityGrade}</span>
          </div>

          {/* Produce Title */}
          <h3 className="text-base font-display font-bold text-[#17251C] group-hover:text-[#166534] transition-colors line-clamp-1">
            {produce.cropName}
          </h3>
          <p className="text-xs text-[#647067] mt-0.5 line-clamp-1">{produce.variety}</p>

          {/* Price & Available Volume Architectural Split Box */}
          <div className="mt-4 pt-3.5 border-t border-[#E5EAE5] grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-[#647067] block">Farm-Gate Price</span>
              <div className="text-lg font-display font-extrabold text-[#17251C] tabular-nums mt-0.5">
                {formatNaira(produce.pricePerUnit)}
              </div>
              <span className="text-[11px] text-[#647067] block truncate">
                per {produce.unit}
              </span>
            </div>

            <div className="border-l border-[#E5EAE5] pl-3">
              <span className="text-[11px] text-[#647067] block">Available Volume</span>
              <div className="text-base font-display font-bold text-[#17251C] tabular-nums mt-0.5 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                <span>{produce.quantityAvailable} units</span>
              </div>
              <span className="text-[11px] text-[#647067] block">
                Min. order: {produce.minimumReservation} units
              </span>
            </div>
          </div>

          {/* Prominent Expected Harvest Date Strip */}
          <div className="mt-3.5 px-3 py-2 rounded-md bg-[#F8FAF7] border border-[#E5EAE5] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#17251C]">
              <Calendar className="w-3.5 h-3.5 text-[#166534] shrink-0" />
              <span className="text-[#647067]">Harvest Date:</span>
              <strong className="font-semibold tabular-nums">
                {formatDateHuman(produce.expectedHarvestDate)}
              </strong>
            </div>
            <span
              className={`text-[11px] font-medium ${
                harvestTiming.isUrgent ? 'text-[#166534] font-semibold' : 'text-[#647067]'
              }`}
            >
              {harvestTiming.label}
            </span>
          </div>
        </div>

        {/* Footer: Farmer Identity & Action */}
        <div className="mt-4 pt-3 border-t border-[#E5EAE5] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={produce.farmer.avatarUrl}
              alt={produce.farmer.name}
              className="w-6 h-6 rounded-full object-cover border border-[#E5EAE5] shrink-0"
            />
            <div className="truncate">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-[#17251C] truncate">
                  {produce.farmer.farmName}
                </span>
                {produce.farmer.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                )}
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#166534] group-hover:translate-x-0.5 transition-transform shrink-0">
            {actionLabel}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
