import React, { useState } from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import {
  CURRENT_FARMER,
  formatNaira,
  formatDateHuman,
} from '../../data/mockData';
import {
  OrderStatusBadge,
  HarvestStatusBadge,
  getNextActionGuidance,
} from '../../components/ui/StatusBadge';
import { JourneyTimeline } from '../../components/ui/JourneyTimeline';
import {
  PlusCircle,
  Calendar,
  MapPin,
  Check,
  X,
  ArrowLeft,
  Truck,
  Phone,
  ShieldCheck,
  Edit3,
  Save,
  PackageCheck,
  ChevronRight,
} from 'lucide-react';

export const FarmerProduceView: React.FC = () => {
  const { produceListings, navigate, updateProduceQuantityOrPrice } = useHarvestLink();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editQty, setEditQty] = useState<number>(0);

  const myListings = produceListings.filter((p) => p.farmer.id === CURRENT_FARMER.id);

  const startEditing = (lot: any) => {
    setEditingId(lot.id);
    setEditPrice(lot.pricePerUnit);
    setEditQty(lot.quantityAvailable);
  };

  const saveEdit = (id: string) => {
    updateProduceQuantityOrPrice(id, {
      pricePerUnit: editPrice,
      quantityAvailable: editQty,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
            Farm Lot Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] mt-0.5">
            My Produce Listings ({myListings.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#647067] mt-1">
            Manage available inventory, update farm-gate prices, and monitor buyer reservation
            progress across your lots.
          </p>
        </div>

        <button
          onClick={() => navigate('farmer-create-produce')}
          className="px-4 py-2.5 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors self-start sm:self-auto shadow-subtle"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Produce Lot</span>
        </button>
      </div>

      <div className="space-y-4">
        {myListings.map((lot) => {
          const isEditing = editingId === lot.id;
          const reservedUnits = Math.max(0, lot.totalQuantityListed - lot.quantityAvailable);
          const totalTonnes = ((lot.quantityAvailable * lot.unitWeightKg) / 1000).toFixed(1);

          return (
            <div
              key={lot.id}
              className="bg-white border border-[#E5EAE5] rounded-lg p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                <img
                  src={lot.images[0]}
                  alt={lot.cropName}
                  className="w-full sm:w-28 h-36 sm:h-28 rounded-md object-cover border border-[#E5EAE5] shrink-0"
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#647067]">
                      {lot.lotCode}
                    </span>
                    <HarvestStatusBadge status={lot.harvestStatus} compact />
                    <span className="px-2 py-0.5 text-[11px] font-medium bg-[#F8FAF7] border border-[#E5EAE5] rounded text-[#17251C]">
                      {lot.qualityGrade}
                    </span>
                  </div>

                  <h2 className="text-base font-display font-bold text-[#17251C]">
                    {lot.cropName}
                  </h2>
                  <p className="text-xs text-[#647067]">{lot.variety}</p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#647067]">
                    <span className="inline-flex items-center gap-1 text-[#17251C] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#166534]" />
                      Expected Harvest: <strong>{formatDateHuman(lot.expectedHarvestDate)}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#647067]" />
                      {lot.collectionPoint}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Metrics & Inline Editor */}
              <div className="pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#E5EAE5] lg:pl-6 flex flex-col sm:flex-row lg:items-center gap-5 shrink-0">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-3 bg-[#F8FAF7] p-3 rounded-md border border-[#166534]">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#647067] block">
                        Price / Unit (₦)
                      </label>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-28 mt-1 px-2 py-1 text-xs font-mono font-bold bg-white border border-[#E5EAE5] rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#647067] block">
                        Available Units
                      </label>
                      <input
                        type="number"
                        value={editQty}
                        onChange={(e) => setEditQty(Number(e.target.value))}
                        className="w-24 mt-1 px-2 py-1 text-xs font-mono font-bold bg-white border border-[#E5EAE5] rounded"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-[11px] text-[#647067] block">Farm-Gate Price</span>
                      <span className="text-lg font-display font-extrabold text-[#17251C] tabular-nums">
                        {formatNaira(lot.pricePerUnit)}
                      </span>
                      <span className="text-[11px] text-[#647067] block">per {lot.unit}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#647067] block">Available Stock</span>
                      <span className="text-lg font-display font-extrabold text-[#166534] tabular-nums">
                        {lot.quantityAvailable} units
                      </span>
                      <span className="text-[11px] text-[#647067] block">
                        {totalTonnes}t ({reservedUnits} reserved)
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2 rounded border border-[#E5EAE5] text-xs font-medium text-[#647067]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(lot.id)}
                        className="px-3.5 py-2 rounded bg-[#166534] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(lot)}
                      className="px-3.5 py-2 rounded border border-[#E5EAE5] bg-[#F8FAF7] hover:bg-white text-xs font-semibold text-[#17251C] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#166534]" />
                      <span>Update Stock / Price</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const FarmerReservationsView: React.FC = () => {
  const { orders, navigate, respondToReservation } = useHarvestLink();
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'pending') return o.status === 'Pending';
    if (filter === 'active')
      return [
        'Confirmed',
        'Awaiting transportation',
        'Transporter assigned',
        'Collected',
        'In transit',
        'Delivered',
      ].includes(o.status);
    if (filter === 'completed') return ['Completed', 'Cancelled'].includes(o.status);
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
            Order & Allocation Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] mt-0.5">
            Incoming Buyer Reservations
          </h1>
          <p className="text-xs sm:text-sm text-[#647067] mt-1">
            Review incoming reservations, verify farm-gate collection codes with assigned drivers,
            and track delivery settlement.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-[#E5EAE5] self-start sm:self-auto">
          {(
            [
              { id: 'all', label: 'All Orders' },
              { id: 'pending', label: 'Pending Action' },
              { id: 'active', label: 'Collection & Transit' },
              { id: 'completed', label: 'Completed' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-[#166534] text-white font-semibold'
                  : 'text-[#647067] hover:text-[#17251C]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-[#E5EAE5] rounded-lg p-5 hover:border-[#166534]/40 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E5EAE5]">
              <div className="flex items-start gap-3.5">
                <img
                  src={order.produceImage}
                  alt={order.produceName}
                  className="w-14 h-14 rounded-md object-cover border border-[#E5EAE5] shrink-0"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#17251C]">
                      {order.orderNumber}
                    </span>
                    <OrderStatusBadge status={order.status} />
                    <span className="font-mono text-xs text-[#166534] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                      Collection Code: <strong>{order.collectionCode}</strong>
                    </span>
                  </div>
                  <h2 className="text-base font-display font-bold text-[#17251C] mt-1">
                    {order.produceName} — {order.quantityReserved} × {order.produceUnit}
                  </h2>
                  <p className="text-xs text-[#647067] mt-0.5">
                    Buyer: <strong className="text-[#17251C]">{order.buyerOrganization}</strong> •
                    Pickup Point: {order.collectionPoint}
                  </p>
                </div>
              </div>

              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0">
                <div className="lg:text-right">
                  <span className="text-[11px] text-[#647067] block">Farm-Gate Payout</span>
                  <span className="text-lg font-display font-extrabold text-[#17251C] tabular-nums">
                    {formatNaira(order.subtotalAmount)}
                  </span>
                </div>
                <span className="text-xs text-[#647067] font-mono">
                  Harvest: {formatDateHuman(order.expectedHarvestDate)}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              <div className="lg:col-span-7">
                <JourneyTimeline order={order} compact />
              </div>

              <div className="lg:col-span-5 flex flex-wrap items-center justify-end gap-2.5">
                {order.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => respondToReservation(order.id, 'decline')}
                      className="px-3 py-2 rounded border border-[#E5EAE5] hover:bg-rose-50 hover:text-rose-800 text-xs font-semibold text-[#647067] inline-flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                    <button
                      onClick={() => respondToReservation(order.id, 'accept')}
                      className="px-4 py-2 rounded bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Reservation</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => navigate('farmer-order-detail', { orderId: order.id })}
                  className="px-3.5 py-2 rounded border border-[#E5EAE5] bg-[#F8FAF7] hover:bg-white text-xs font-semibold text-[#17251C] inline-flex items-center gap-1"
                >
                  <span>Order & Custody Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FarmerOrderDetailView: React.FC = () => {
  const { orders, selectedOrderId, navigate, respondToReservation, advanceOrderStatus } =
    useHarvestLink();

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];
  if (!order) return null;

  const guidance = getNextActionGuidance(order.status, 'farmer');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('farmer-reservations')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#647067] hover:text-[#17251C] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Reservations</span>
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-display font-extrabold text-[#17251C]">
              Reservation {order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-[#647067] mt-1">
            Placed on {order.createdAt} • {order.produceName} ({order.quantityReserved} ×{' '}
            {order.produceUnit})
          </p>
        </div>

        {/* Contextual Action Buttons for Farmer */}
        <div className="flex flex-wrap items-center gap-2.5">
          {order.status === 'Pending' && (
            <>
              <button
                onClick={() => respondToReservation(order.id, 'decline')}
                className="px-4 py-2.5 rounded-md border border-[#E5EAE5] bg-white hover:bg-rose-50 hover:text-rose-800 text-xs font-semibold text-[#647067]"
              >
                Decline Request
              </button>
              <button
                onClick={() => respondToReservation(order.id, 'accept')}
                className="px-5 py-2.5 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-subtle"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Harvest Allocation</span>
              </button>
            </>
          )}
          {order.status === 'Transporter assigned' && (
            <button
              onClick={() => advanceOrderStatus(order.id, 'Collected')}
              className="px-5 py-2.5 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-subtle"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Confirm Truck Loaded at Farm Gate</span>
            </button>
          )}
        </div>
      </div>

      {/* Next Action Banner */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold">
            Current Operational Status
          </span>
          <h2 className="text-base font-display font-bold text-[#17251C] mt-0.5">
            {guidance.headline}
          </h2>
          <p className="text-xs text-[#647067] mt-0.5">{guidance.subtext}</p>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-md border border-[#BBF7D0] shrink-0">
          <span className="text-[10px] font-mono uppercase text-[#647067] block">
            Farm Gate Handover Code
          </span>
          <span className="text-base font-mono font-extrabold text-[#166534]">
            {order.collectionCode}
          </span>
        </div>
      </div>

      {/* Full 7-Stage Visual Journey */}
      <JourneyTimeline order={order} />

      {/* 3-Column Custody & Settlement Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Buyer Details */}
        <div className="bg-white border border-[#E5EAE5] rounded-lg p-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] font-semibold">
            1. Commercial Buyer
          </span>
          <h3 className="text-base font-display font-bold text-[#17251C] mt-2">
            {order.buyerOrganization}
          </h3>
          <p className="text-xs text-[#647067] mt-0.5">Procurement Officer: {order.buyerName}</p>
          <div className="mt-4 pt-3 border-t border-[#E5EAE5] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#17251C]">
              <Phone className="w-3.5 h-3.5 text-[#166534]" />
              <span className="font-mono">{order.buyerPhone}</span>
            </div>
            <div className="flex items-start gap-2 text-[#647067]">
              <MapPin className="w-3.5 h-3.5 text-[#166534] shrink-0 mt-0.5" />
              <span>
                Delivery Depot: {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState}
              </span>
            </div>
          </div>
        </div>

        {/* Logistics & Collection Arrangement */}
        <div className="bg-white border border-[#E5EAE5] rounded-lg p-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] font-semibold">
            2. Collection & Haulage
          </span>
          <h3 className="text-base font-display font-bold text-[#17251C] mt-2">
            {order.transporterCompany || 'Awaiting Carrier Assignment'}
          </h3>
          <p className="text-xs text-[#647067] mt-0.5">
            {order.vehiclePlate
              ? `Vehicle Plate: ${order.vehiclePlate} (${order.vehicleType})`
              : `Required Vehicle: ${order.requiredVehicleType || '10-Tonne Truck'}`}
          </p>
          <div className="mt-4 pt-3 border-t border-[#E5EAE5] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#647067]">Total Load Weight:</span>
              <strong className="font-mono text-[#17251C]">
                {order.estimatedWeightTonnes} Metric Tonnes
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#647067]">Collection Bay:</span>
              <strong className="text-[#17251C] truncate max-w-[180px]">
                {order.collectionPoint}
              </strong>
            </div>
          </div>
        </div>

        {/* Financial Settlement Breakdown */}
        <div className="bg-white border border-[#E5EAE5] rounded-lg p-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] font-semibold">
            3. Farm-Gate Settlement
          </span>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#647067]">
                {order.quantityReserved} × {formatNaira(order.pricePerUnit)}
              </span>
              <span className="font-mono font-semibold text-[#17251C]">
                {formatNaira(order.subtotalAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#647067]">Grower Commission</span>
              <span className="font-mono text-[#166534] font-semibold">₦0 (0%)</span>
            </div>
            <div className="pt-3 border-t border-[#E5EAE5] flex items-center justify-between">
              <span className="font-display font-bold text-[#17251C]">Net Farmer Payout</span>
              <span className="text-lg font-display font-extrabold text-[#166534] tabular-nums">
                {formatNaira(order.subtotalAmount)}
              </span>
            </div>
            <div className="mt-2 pt-2 flex items-center gap-1.5 text-[11px] text-[#166534]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Escrow protected by HarvestLink Settlement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
