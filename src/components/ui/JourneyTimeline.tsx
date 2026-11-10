import React from 'react';
import { OrderStatus, ReservationOrder } from '../../types';
import { Check, Clock, AlertCircle, ArrowRight } from 'lucide-react';

interface JourneyStage {
  step: number;
  title: string;
  actor: string;
  detail: string;
}

const JOURNEY_STAGES: JourneyStage[] = [
  {
    step: 1,
    title: 'Farmer lists produce',
    actor: 'Farmer',
    detail: 'Harvest lot verified & published',
  },
  {
    step: 2,
    title: 'Buyer reserves',
    actor: 'Buyer',
    detail: 'Quantity locked & escrow initiated',
  },
  {
    step: 3,
    title: 'Farmer confirms',
    actor: 'Farmer',
    detail: 'Farm-gate allocation approved',
  },
  {
    step: 4,
    title: 'Buyer requests transport',
    actor: 'Buyer',
    detail: 'Route & tonnage broadcasted',
  },
  {
    step: 5,
    title: 'Transporter accepts',
    actor: 'Transporter',
    detail: 'Truck & driver assigned',
  },
  {
    step: 6,
    title: 'Produce collected',
    actor: 'Transporter + Farmer',
    detail: 'Weighed & loaded at farm gate',
  },
  {
    step: 7,
    title: 'Delivery confirmed',
    actor: 'Buyer + Transporter',
    detail: 'Offloaded & settlement released',
  },
];

export function getActiveStepFromStatus(status: OrderStatus): {
  completedUpTo: number;
  currentStep: number;
  isCancelled: boolean;
} {
  switch (status) {
    case 'Pending':
      return { completedUpTo: 2, currentStep: 3, isCancelled: false };
    case 'Confirmed':
      return { completedUpTo: 3, currentStep: 4, isCancelled: false };
    case 'Awaiting transportation':
      return { completedUpTo: 4, currentStep: 5, isCancelled: false };
    case 'Transporter assigned':
      return { completedUpTo: 5, currentStep: 6, isCancelled: false };
    case 'Collected':
    case 'In transit':
      return { completedUpTo: 6, currentStep: 7, isCancelled: false };
    case 'Delivered':
      return { completedUpTo: 6, currentStep: 7, isCancelled: false };
    case 'Completed':
      return { completedUpTo: 7, currentStep: 8, isCancelled: false };
    case 'Cancelled':
      return { completedUpTo: 2, currentStep: 3, isCancelled: true };
  }
}

export const JourneyTimeline: React.FC<{
  order: ReservationOrder;
  compact?: boolean;
}> = ({ order, compact = false }) => {
  const { completedUpTo, currentStep, isCancelled } = getActiveStepFromStatus(order.status);

  if (compact) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between text-[11px] text-[#647067] mb-1.5">
          <span className="font-medium text-[#17251C]">
            Stage {Math.min(7, completedUpTo)} of 7
          </span>
          <span>
            {isCancelled
              ? 'Order Cancelled'
              : completedUpTo === 7
              ? 'Full Chain Completed'
              : `Next: ${JOURNEY_STAGES[currentStep - 1]?.title || 'Completion'}`}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {JOURNEY_STAGES.map((s) => {
            const isDone = s.step <= completedUpTo && !isCancelled;
            const isCurr = s.step === currentStep && !isCancelled;
            return (
              <div
                key={s.step}
                title={`${s.step}. ${s.title}`}
                className={`h-1.5 rounded-sm transition-colors ${
                  isCancelled
                    ? 'bg-rose-200'
                    : isDone
                    ? 'bg-[#166534]'
                    : isCurr
                    ? 'bg-[#22C55E] animate-pulse'
                    : 'bg-[#E5EAE5]'
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5EAE5] rounded-lg p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-[#E5EAE5]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#166534]">
            Chain of Custody & Logistics Pipeline
          </span>
          <h3 className="text-base font-display font-bold text-[#17251C] mt-0.5">
            7-Stage Farm-to-Buyer Verification Journey
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#647067] font-mono bg-[#F8FAF7] px-3 py-1.5 rounded border border-[#E5EAE5]">
          <span>Collection Code:</span>
          <strong className="text-[#17251C]">{order.collectionCode}</strong>
        </div>
      </div>

      {/* Desktop / Tablet Horizontal + Mobile Vertical Responsive Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
        {JOURNEY_STAGES.map((stage, idx) => {
          const isCompleted = stage.step <= completedUpTo && !isCancelled;
          const isCurrent = stage.step === currentStep && !isCancelled;

          let actorDetail = stage.detail;
          if (stage.step === 1) actorDetail = `${order.farmerName} (${order.pickupState})`;
          if (stage.step === 2)
            actorDetail = `${order.buyerOrganization} (${order.quantityReserved} units)`;
          if (stage.step === 5 && order.transporterCompany)
            actorDetail = `${order.transporterCompany} (${order.vehiclePlate})`;
          if (stage.step === 6 && (order.status === 'Collected' || order.status === 'In transit'))
            actorDetail = order.status === 'In transit' ? 'In Transit on Corridor' : 'Loaded at Farm Gate';

          return (
            <div
              key={stage.step}
              className={`relative flex lg:flex-col justify-between p-3.5 rounded-lg border transition-all ${
                isCompleted
                  ? 'bg-[#F0FDF4]/60 border-[#BBF7D0]'
                  : isCurrent
                  ? 'bg-white border-[#166534] ring-1 ring-[#166534]/20 shadow-subtle'
                  : isCancelled && stage.step === 3
                  ? 'bg-rose-50/60 border-rose-200'
                  : 'bg-[#F8FAF7]/70 border-[#E5EAE5] opacity-75'
              }`}
            >
              <div className="flex items-start lg:flex-col gap-3 lg:gap-2.5">
                <div className="flex items-center justify-between w-auto lg:w-full">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-semibold shrink-0 ${
                      isCompleted
                        ? 'bg-[#166534] text-white'
                        : isCurrent
                        ? 'bg-[#22C55E] text-[#17251C]'
                        : isCancelled && stage.step === 3
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-[#E5EAE5] text-[#647067]'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : isCancelled && stage.step === 3 ? (
                      <AlertCircle className="w-3.5 h-3.5" />
                    ) : isCurrent ? (
                      <Clock className="w-3.5 h-3.5" />
                    ) : (
                      stage.step
                    )}
                  </div>
                  {idx < JOURNEY_STAGES.length - 1 && (
                    <ArrowRight
                      className={`hidden lg:block w-3.5 h-3.5 ${
                        isCompleted ? 'text-[#166534]' : 'text-[#647067]/40'
                      }`}
                    />
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#647067] block">
                    {stage.actor}
                  </span>
                  <p className="text-xs font-display font-bold text-[#17251C] leading-snug mt-0.5">
                    {stage.title}
                  </p>
                  <p className="text-[11px] text-[#647067] leading-relaxed mt-1">{actorDetail}</p>
                </div>
              </div>

              <div className="mt-2 lg:mt-3 pt-2 border-t border-[#E5EAE5]/70 flex items-center justify-between">
                <span
                  className={`text-[10px] font-medium ${
                    isCompleted
                      ? 'text-[#166534]'
                      : isCurrent
                      ? 'text-amber-700 font-semibold'
                      : 'text-[#647067]'
                  }`}
                >
                  {isCompleted
                    ? 'Verified'
                    : isCurrent
                    ? 'Active Step'
                    : isCancelled && stage.step === 3
                    ? 'Declined'
                    : 'Pending'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
