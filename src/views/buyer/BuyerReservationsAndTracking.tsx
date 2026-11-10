import React, { useState } from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import {
  formatNaira,
  formatDateHuman,
  CURRENT_BUYER,
} from '../../data/mockData';
import {
  OrderStatusBadge,
  getNextActionGuidance,
} from '../../components/ui/StatusBadge';
import { JourneyTimeline } from '../../components/ui/JourneyTimeline';
import {
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  Phone,
  ShieldCheck,
  Navigation,
  PackageCheck,
  X,
} from 'lucide-react';

export const BuyerReservationsView: React.FC = () => {
  const { orders, navigate, requestTransportation, advanceOrderStatus } = useHarvestLink();
  const [filter, setFilter] = useState<'all' | 'open' | 'transit' | 'completed'>('all');
  const [transportModalOrderId, setTransportModalOrderId] = useState<string | null>(null);

  // Modal state
  const [deliveryState, setDeliveryState] = useState(CURRENT_BUYER.state);
  const [deliveryCity, setDeliveryCity] = useState(CURRENT_BUYER.city);
  const [deliveryAddress, setDeliveryAddress] = useState(CURRENT_BUYER.address);
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState('2026-11-15');
  const [requiredVehicleType, setRequiredVehicleType] = useState('10-Tonne Covered Box Truck');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'open')
      return ['Pending', 'Confirmed', 'Awaiting transportation'].includes(o.status);
    if (filter === 'transit')
      return ['Transporter assigned', 'Collected', 'In transit', 'Delivered'].includes(o.status);
    if (filter === 'completed') return ['Completed', 'Cancelled'].includes(o.status);
    return true;
  });

  const handleOpenTransportModal = (orderId: string) => {
    setTransportModalOrderId(orderId);
  };

  const handleConfirmTransportRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transportModalOrderId) return;
    requestTransportation({
      orderId: transportModalOrderId,
      deliveryState,
      deliveryCity,
      deliveryAddress,
      preferredDeliveryDate,
      requiredVehicleType,
      transportCost: 380000,
    });
    setTransportModalOrderId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
            Procurement Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] mt-0.5">
            My Produce Reservations ({orders.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#647067] mt-1">
            Monitor farm-gate confirmations, request verified haulage trucks, and verify incoming
            depot deliveries.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-[#E5EAE5] self-start sm:self-auto">
          {(
            [
              { id: 'all', label: 'All Orders' },
              { id: 'open', label: 'Pending & Confirmed' },
              { id: 'transit', label: 'Active Haulage' },
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

      {/* Reservations List */}
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
                    <span className="text-xs text-[#647067]">
                      Origin: {order.pickupCommunity}, {order.pickupState}
                    </span>
                  </div>
                  <h2 className="text-base font-display font-bold text-[#17251C] mt-1">
                    {order.produceName} — {order.quantityReserved} × {order.produceUnit}
                  </h2>
                  <p className="text-xs text-[#647067] mt-0.5">
                    Grower: <strong className="text-[#17251C]">{order.farmName}</strong> •
                    Weight: {order.estimatedWeightTonnes}t • Expected Harvest:{' '}
                    {formatDateHuman(order.expectedHarvestDate)}
                  </p>
                </div>
              </div>

              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0">
                <div className="lg:text-right">
                  <span className="text-[11px] text-[#647067] block">Total Contract Value</span>
                  <span className="text-lg font-display font-extrabold text-[#17251C] tabular-nums">
                    {formatNaira(order.totalAmount)}
                  </span>
                </div>
                {order.transporterCompany && (
                  <span className="text-[11px] font-mono text-[#166534] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                    Carrier: {order.transporterCompany} ({order.vehiclePlate})
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              <div className="lg:col-span-7">
                <JourneyTimeline order={order} compact />
              </div>

              <div className="lg:col-span-5 flex flex-wrap items-center justify-end gap-2.5">
                {order.status === 'Confirmed' && (
                  <button
                    onClick={() => handleOpenTransportModal(order.id)}
                    className="px-4 py-2 rounded bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-subtle"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Request Transportation</span>
                  </button>
                )}

                {order.status === 'Delivered' && (
                  <button
                    onClick={() => advanceOrderStatus(order.id, 'Completed')}
                    className="px-4 py-2 rounded bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-subtle"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Receipt & Release Escrow</span>
                  </button>
                )}

                <button
                  onClick={() => navigate('buyer-order-tracking', { orderId: order.id })}
                  className="px-3.5 py-2 rounded border border-[#E5EAE5] bg-[#F8FAF7] hover:bg-white text-xs font-semibold text-[#17251C] inline-flex items-center gap-1"
                >
                  <span>Track Shipment</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request Transportation Modal */}
      {transportModalOrderId && (
        <div className="fixed inset-0 z-50 bg-[#17251C]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5EAE5] rounded-xl max-w-lg w-full p-6 shadow-modal animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE5]">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#166534] font-semibold">
                  Logistics Dispatch Request
                </span>
                <h3 className="text-lg font-display font-bold text-[#17251C]">
                  Arrange Agro-Haulage Transportation
                </h3>
              </div>
              <button
                onClick={() => setTransportModalOrderId(null)}
                className="p-1 text-[#647067] hover:text-[#17251C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmTransportRequest} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#17251C] mb-1">
                  Required Truck Capacity & Body Type
                </label>
                <select
                  value={requiredVehicleType}
                  onChange={(e) => setRequiredVehicleType(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#E5EAE5] rounded-md"
                >
                  <option value="5-Tonne Ventilated Canter">5-Tonne Ventilated Canter</option>
                  <option value="10-Tonne Covered Box Truck">10-Tonne Covered Box Truck</option>
                  <option value="15-Tonne Ventilated Produce Truck">
                    15-Tonne Ventilated Produce Truck
                  </option>
                  <option value="30-Tonne Flatbed Trailer">30-Tonne Flatbed Trailer</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1">
                    Destination State
                  </label>
                  <input
                    type="text"
                    value={deliveryState}
                    onChange={(e) => setDeliveryState(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#E5EAE5] rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1">
                    Preferred Delivery Date
                  </label>
                  <input
                    type="date"
                    value={preferredDeliveryDate}
                    onChange={(e) => setPreferredDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-white border border-[#E5EAE5] rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#17251C] mb-1">
                  Destination Depot / Warehouse Address
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#E5EAE5] rounded-md"
                  required
                />
              </div>

              <div className="pt-4 border-t border-[#E5EAE5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTransportModalOrderId(null)}
                  className="px-4 py-2 rounded border border-[#E5EAE5] text-xs font-semibold text-[#647067]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold"
                >
                  Broadcast to Transporters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const BuyerOrderTrackingView: React.FC = () => {
  const { orders, selectedOrderId, navigate, advanceOrderStatus } = useHarvestLink();

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];
  if (!order) return null;

  const guidance = getNextActionGuidance(order.status, 'buyer');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header + Order Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('buyer-reservations')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#647067] hover:text-[#17251C] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Reservations</span>
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-display font-extrabold text-[#17251C]">
              Order & Logistics Tracking • {order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-[#647067] mt-1">
            {order.produceName} — {order.quantityReserved} × {order.produceUnit} (
            {order.estimatedWeightTonnes} Metric Tonnes)
          </p>
        </div>

        {/* Quick Order Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={order.id}
            onChange={(e) => navigate('buyer-order-tracking', { orderId: e.target.value })}
            className="px-3 py-2 text-xs font-mono bg-white border border-[#E5EAE5] rounded-md"
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.orderNumber} — {o.produceName.slice(0, 24)} ({o.status})
              </option>
            ))}
          </select>

          {order.status === 'Delivered' && (
            <button
              onClick={() => advanceOrderStatus(order.id, 'Completed')}
              className="px-4 py-2 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-subtle"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Final Delivery</span>
            </button>
          )}
        </div>
      </div>

      {/* Guidance Banner */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold">
            Next Required Action
          </span>
          <h2 className="text-base font-display font-bold text-[#17251C] mt-0.5">
            {guidance.headline}
          </h2>
          <p className="text-xs text-[#647067] mt-0.5">{guidance.subtext}</p>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-md border border-[#BBF7D0] shrink-0">
          <span className="text-[10px] font-mono uppercase text-[#647067] block">
            Target Depot Arrival
          </span>
          <span className="text-sm font-mono font-bold text-[#17251C]">
            {formatDateHuman(order.preferredDeliveryDate)}
          </span>
        </div>
      </div>

      {/* 7-Stage Visual Journey */}
      <JourneyTimeline order={order} />

      {/* Interstate Corridor Route & Custody Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pickup Origin */}
        <div className="bg-white border border-[#E5EAE5] rounded-lg p-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold">
            Origin • Farm Collection Point
          </span>
          <h3 className="text-base font-display font-bold text-[#17251C] mt-2">
            {order.pickupCommunity}, {order.pickupLga} LGA, {order.pickupState}
          </h3>
          <p className="text-xs text-[#647067] mt-1">{order.collectionPoint}</p>
          <div className="mt-4 pt-3 border-t border-[#E5EAE5] text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[#647067]">Grower:</span>
              <strong className="text-[#17251C]">{order.farmerName}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#647067]">Collection Code:</span>
              <strong className="font-mono text-[#166534]">{order.collectionCode}</strong>
            </div>
          </div>
        </div>

        {/* Assigned Transporter */}
        <div className="bg-white border border-[#E5EAE5] rounded-lg p-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold">
            Haulage • Carrier & Vehicle
          </span>
          <h3 className="text-base font-display font-bold text-[#17251C] mt-2">
            {order.transporterCompany || 'Matching Verified Corridor Fleet...'}
          </h3>
          <p className="text-xs text-[#647067] mt-1">
            {order.vehicleType || order.requiredVehicleType}
          </p>
          <div className="mt-4 pt-3 border-t border-[#E5EAE5] text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[#647067]">Truck Plate:</span>
              <strong className="font-mono text-[#17251C]">
                {order.vehiclePlate || 'Pending Dispatch'}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#647067]">Route Distance:</span>
              <strong className="font-mono text-[#17251C]">
                ~{order.estimatedDistanceKm || 640} km
              </strong>
            </div>
          </div>
        </div>

        {/* Destination Depot */}
        <div className="bg-white border border-[#E5EAE5] rounded-lg p-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold">
            Destination • Buyer Receiving Bay
          </span>
          <h3 className="text-base font-display font-bold text-[#17251C] mt-2">
            {order.deliveryCity}, {order.deliveryState}
          </h3>
          <p className="text-xs text-[#647067] mt-1">{order.deliveryAddress}</p>
          <div className="mt-4 pt-3 border-t border-[#E5EAE5] text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[#647067]">Total Escrow Value:</span>
              <strong className="font-mono text-[#166534]">
                {formatNaira(order.totalAmount)}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#647067]">Escrow Status:</span>
              <strong className="text-[#17251C]">
                {order.status === 'Completed' ? 'Released' : 'Locked in Custody'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
