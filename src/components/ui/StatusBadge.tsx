import React from 'react';
import { OrderStatus, HarvestAvailabilityStatus } from '../../types';
import {
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  Navigation,
  ShieldCheck,
  XCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, size = 'md' }) => {
  const styles: Record<
    OrderStatus,
    { bg: string; text: string; border: string; dot: string; icon: React.ReactNode }
  > = {
    Pending: {
      bg: 'bg-amber-50/90',
      text: 'text-amber-900',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      icon: <Clock className="w-3.5 h-3.5 text-amber-700" />,
    },
    Confirmed: {
      bg: 'bg-[#F0FDF4]',
      text: 'text-[#166534]',
      border: 'border-[#BBF7D0]',
      dot: 'bg-[#22C55E]',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]" />,
    },
    'Awaiting transportation': {
      bg: 'bg-orange-50/90',
      text: 'text-orange-900',
      border: 'border-orange-200',
      dot: 'bg-orange-500',
      icon: <Truck className="w-3.5 h-3.5 text-orange-700" />,
    },
    'Transporter assigned': {
      bg: 'bg-sky-50/90',
      text: 'text-sky-900',
      border: 'border-sky-200',
      dot: 'bg-sky-600',
      icon: <Truck className="w-3.5 h-3.5 text-sky-700" />,
    },
    Collected: {
      bg: 'bg-indigo-50/90',
      text: 'text-indigo-900',
      border: 'border-indigo-200',
      dot: 'bg-indigo-600',
      icon: <PackageCheck className="w-3.5 h-3.5 text-indigo-700" />,
    },
    'In transit': {
      bg: 'bg-blue-50/90',
      text: 'text-blue-900',
      border: 'border-blue-200',
      dot: 'bg-blue-600 animate-pulse',
      icon: <Navigation className="w-3.5 h-3.5 text-blue-700" />,
    },
    Delivered: {
      bg: 'bg-[#F0FDF4]',
      text: 'text-[#166534]',
      border: 'border-[#86EFAC]',
      dot: 'bg-[#22C55E]',
      icon: <PackageCheck className="w-3.5 h-3.5 text-[#166534]" />,
    },
    Completed: {
      bg: 'bg-[#17251C]',
      text: 'text-white',
      border: 'border-[#17251C]',
      dot: 'bg-[#22C55E]',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />,
    },
    Cancelled: {
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-700" />,
    },
  };

  const cfg = styles[status] || styles.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md ${cfg.bg} ${cfg.text} ${cfg.border} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {cfg.icon}
      <span>{status}</span>
    </span>
  );
};

export const HarvestStatusBadge: React.FC<{
  status: HarvestAvailabilityStatus;
  compact?: boolean;
}> = ({ status, compact = false }) => {
  if (status === 'Ready for Immediate Collection') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
        {compact ? 'Ready Now' : 'Ready for Collection'}
      </span>
    );
  }
  if (status === 'Harvesting in 3–7 Days') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 rounded-md">
        <Calendar className="w-3 h-3 text-amber-700" />
        {compact ? '3–7 Days' : 'Harvesting in 3–7 Days'}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-white text-[#17251C] border border-[#E5EAE5] rounded-md">
      <Sparkles className="w-3 h-3 text-[#166534]" />
      {compact ? 'Pre-Harvest' : 'Scheduled Pre-Harvest'}
    </span>
  );
};

export function getNextActionGuidance(status: OrderStatus, viewerRole: 'farmer' | 'buyer' | 'transporter'): {
  headline: string;
  subtext: string;
  actionRequiredBy: 'farmer' | 'buyer' | 'transporter' | 'none';
} {
  switch (status) {
    case 'Pending':
      return {
        headline:
          viewerRole === 'farmer'
            ? 'Action Required: Confirm or Decline Reservation'
            : 'Awaiting Farmer Confirmation',
        subtext:
          viewerRole === 'farmer'
            ? 'Verify harvest availability and confirm this buyer allocation to lock farm-gate pricing.'
            : 'The farmer is verifying harvest volume and loading window at the farm gate.',
        actionRequiredBy: 'farmer',
      };
    case 'Confirmed':
      return {
        headline:
          viewerRole === 'buyer'
            ? 'Action Required: Arrange Haulage / Request Transport'
            : 'Reservation Confirmed — Awaiting Transport Arrangement',
        subtext:
          viewerRole === 'buyer'
            ? 'Assign a verified HarvestLink transporter or schedule your own pickup vehicle.'
            : 'Buyer is scheduling a truck for farm-gate collection.',
        actionRequiredBy: 'buyer',
      };
    case 'Awaiting transportation':
      return {
        headline:
          viewerRole === 'transporter'
            ? 'Available Haulage Job: Accept & Assign Truck'
            : 'Broadcasted to Verified Transporters',
        subtext:
          viewerRole === 'transporter'
            ? 'Review tonnage and route corridor to accept this farm-to-buyer dispatch.'
            : 'Matching your lot with a verified agro-haulage vehicle on this corridor.',
        actionRequiredBy: 'transporter',
      };
    case 'Transporter assigned':
      return {
        headline:
          viewerRole === 'transporter'
            ? 'Action Required: Arrive at Farm Gate & Confirm Collection'
            : 'Transporter Assigned — En Route to Farm Collection Point',
        subtext:
          viewerRole === 'farmer'
            ? 'Stage produce crates/bags at the collection point and verify Collection Code with driver.'
            : 'Assigned vehicle is heading to the farm collection bay for loading.',
        actionRequiredBy: 'transporter',
      };
    case 'Collected':
      return {
        headline: 'Produce Weighed & Loaded at Farm Gate',
        subtext: 'Transporter has verified collection code and is commencing interstate transit.',
        actionRequiredBy: 'transporter',
      };
    case 'In transit':
      return {
        headline: 'Shipment Actively In Transit',
        subtext:
          viewerRole === 'transporter'
            ? 'Mark as Delivered once offloaded at the buyer warehouse.'
            : 'Live corridor tracking active. Prepare receiving bay for offloading.',
        actionRequiredBy: 'transporter',
      };
    case 'Delivered':
      return {
        headline:
          viewerRole === 'buyer'
            ? 'Action Required: Confirm Final Receipt & Quality'
            : 'Offloaded at Buyer Depot — Awaiting Final Sign-off',
        subtext:
          viewerRole === 'buyer'
            ? 'Inspect offloaded quantity and mark order Completed to release settlement.'
            : 'Buyer is completing final weighbridge verification.',
        actionRequiredBy: 'buyer',
      };
    case 'Completed':
      return {
        headline: 'Order Completed & Settled',
        subtext: 'Full chain of custody verified. Settlement disbursed to farmer and transporter.',
        actionRequiredBy: 'none',
      };
    case 'Cancelled':
      return {
        headline: 'Order Cancelled',
        subtext: 'Reserved produce volume has been returned to the active marketplace listing.',
        actionRequiredBy: 'none',
      };
  }
}
