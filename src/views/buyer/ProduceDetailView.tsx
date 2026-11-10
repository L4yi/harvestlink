import React, { useState, useEffect } from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import {
  formatNaira,
  formatDateHuman,
  daysUntilDate,
  CURRENT_BUYER,
} from '../../data/mockData';
import { HarvestStatusBadge } from '../../components/ui/StatusBadge';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ShieldCheck,
  Truck,
  Scale,
  Phone,
  CheckCircle2,
  Clock,
  Info,
  Award,
} from 'lucide-react';

export const ProduceDetailView: React.FC = () => {
  const { produceListings, selectedProduceId, navigate, createReservation } = useHarvestLink();

  const produce =
    produceListings.find((p) => p.id === selectedProduceId) || produceListings[0];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [reserveQty, setReserveQty] = useState<number>(produce?.minimumReservation || 20);
  const [requiresTransport, setRequiresTransport] = useState<boolean>(true);
  const [deliveryState, setDeliveryState] = useState<string>(CURRENT_BUYER.state);
  const [deliveryCity, setDeliveryCity] = useState<string>(CURRENT_BUYER.city);
  const [deliveryAddress, setDeliveryAddress] = useState<string>(CURRENT_BUYER.address);
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState<string>('2026-11-16');
  const [buyerNotes, setBuyerNotes] = useState<string>(
    'Require morning loading at farm gate and weighbridge ticket.'
  );

  useEffect(() => {
    if (produce) {
      setActiveImageIdx(0);
      setReserveQty(Math.min(produce.quantityAvailable, Math.max(produce.minimumReservation, 20)));
    }
  }, [produce]);

  if (!produce) return null;

  const harvestTiming = daysUntilDate(produce.expectedHarvestDate);
  const totalWeightKg = reserveQty * produce.unitWeightKg;
  const totalWeightTonnes = (totalWeightKg / 1000).toFixed(2);

  // Recommend vehicle based on reserved weight
  const recommendedVehicle =
    Number(totalWeightTonnes) <= 4.5
      ? '5-Tonne Ventilated Canter'
      : Number(totalWeightTonnes) <= 10.5
      ? '10-Tonne Covered Box Truck'
      : Number(totalWeightTonnes) <= 16
      ? '15-Tonne Ventilated Produce Truck'
      : '30-Tonne Flatbed Trailer';

  const estimatedHaulageCost = requiresTransport
    ? Math.max(185000, Math.round(Number(totalWeightTonnes) * 68000))
    : 0;

  const subtotalAmount = reserveQty * produce.pricePerUnit;
  const platformEscrowFee = Math.round(subtotalAmount * 0.01);
  const grandTotal = subtotalAmount + platformEscrowFee + estimatedHaulageCost;

  const handleSubmitReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const createdOrder = createReservation({
      produce,
      quantity: reserveQty,
      deliveryState,
      deliveryCity,
      deliveryAddress,
      preferredDeliveryDate,
      requiresTransport,
      requiredVehicleType: recommendedVehicle,
      transportCost: estimatedHaulageCost,
      buyerNotes,
    });
    navigate('buyer-order-tracking', { orderId: createdOrder.id });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('buyer-marketplace')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#647067] hover:text-[#17251C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Produce Marketplace</span>
        </button>

        <span className="font-mono text-xs text-[#647067] bg-white px-3 py-1 rounded border border-[#E5EAE5]">
          Lot ID: <strong className="text-[#17251C]">{produce.lotCode}</strong>
        </span>
      </div>

      {/* Main Split Layout: Left 7 Columns (Imagery, Specs, Farmer, Location) | Right 5 Columns (Reserve Calculator) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ==================== LEFT 7 COLUMNS ==================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* Large Product Imagery + Gallery */}
          <div className="bg-white border border-[#E5EAE5] rounded-lg overflow-hidden">
            <div className="relative h-72 sm:h-96 bg-[#F8FAF7] border-b border-[#E5EAE5]">
              <img
                src={produce.images[activeImageIdx] || produce.images[0]}
                alt={produce.cropName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <HarvestStatusBadge status={produce.harvestStatus} />
                <span className="px-2.5 py-1 rounded bg-[#17251C]/85 text-white font-mono text-xs">
                  {produce.qualityGrade}
                </span>
              </div>
            </div>

            {produce.images.length > 1 && (
              <div className="p-3 bg-[#F8FAF7] flex items-center gap-3">
                {produce.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 h-14 rounded overflow-hidden border-2 transition-all ${
                      activeImageIdx === idx
                        ? 'border-[#166534] ring-1 ring-[#166534]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information & Prominent Harvest Date */}
          <div className="bg-white border border-[#E5EAE5] rounded-lg p-5 sm:p-6 space-y-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
                {produce.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] mt-1">
                {produce.cropName}
              </h1>
              <p className="text-sm text-[#647067] mt-0.5">Cultivar / Variety: {produce.variety}</p>
            </div>

            {/* Prominent Harvest Date & Shelf-Life Banner */}
            <div className="p-4 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-[#166534] text-white flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold block">
                    Expected Harvest Date
                  </span>
                  <strong className="text-base font-display font-extrabold text-[#17251C] tabular-nums">
                    {formatDateHuman(produce.expectedHarvestDate)}
                  </strong>
                  <span className="block text-xs text-[#166534] font-medium mt-0.5">
                    {harvestTiming.label} • Cutoff: {formatDateHuman(produce.availabilityEndDate)}
                  </span>
                </div>
              </div>

              <div className="sm:border-l border-[#BBF7D0] sm:pl-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-white border border-[#BBF7D0] text-[#166534] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] font-semibold block">
                    Shelf-Life & Quality Specs
                  </span>
                  <strong className="text-sm font-display font-bold text-[#17251C] block mt-0.5">
                    {produce.shelfLifeWindow}
                  </strong>
                  <span className="text-xs text-[#647067] block mt-0.5">
                    {produce.moistureContent || produce.qualityGrade}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#647067] font-semibold mb-2">
                Harvest & Grading Specification
              </h2>
              <p className="text-sm text-[#17251C] leading-relaxed">{produce.description}</p>
            </div>

            {/* Architectural Spec Table */}
            <div className="pt-4 border-t border-[#E5EAE5] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#647067] block">Packaging Unit</span>
                <strong className="text-[#17251C] font-semibold mt-0.5 block">
                  {produce.unit}
                </strong>
              </div>
              <div>
                <span className="text-[#647067] block">Unit Weight</span>
                <strong className="text-[#17251C] font-mono font-semibold mt-0.5 block">
                  {produce.unitWeightKg} kg
                </strong>
              </div>
              <div>
                <span className="text-[#647067] block">Available Units</span>
                <strong className="text-[#166534] font-mono font-bold mt-0.5 block">
                  {produce.quantityAvailable} of {produce.totalQuantityListed}
                </strong>
              </div>
              <div>
                <span className="text-[#647067] block">Min. Reservation</span>
                <strong className="text-[#17251C] font-mono font-semibold mt-0.5 block">
                  {produce.minimumReservation} units
                </strong>
              </div>
            </div>
          </div>

          {/* Collection Location & Road Accessibility */}
          <div className="bg-white border border-[#E5EAE5] rounded-lg p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
                  Origin & Logistics Access
                </span>
                <h2 className="text-base font-display font-bold text-[#17251C] mt-0.5">
                  Collection Point & Truck Accessibility
                </h2>
              </div>
              <MapPin className="w-5 h-5 text-[#166534]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-[#F8FAF7] border border-[#E5EAE5] text-xs">
              <div>
                <span className="text-[#647067] block">State</span>
                <strong className="text-[#17251C] text-sm font-display font-bold">
                  {produce.state} State
                </strong>
              </div>
              <div>
                <span className="text-[#647067] block">Local Govt Area (LGA)</span>
                <strong className="text-[#17251C] text-sm font-display font-bold">
                  {produce.lga} LGA
                </strong>
              </div>
              <div>
                <span className="text-[#647067] block">Farming Community</span>
                <strong className="text-[#17251C] text-sm font-display font-bold">
                  {produce.community}
                </strong>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#17251C]">Designated Loading Point:</strong>{' '}
                  <span className="text-[#647067]">{produce.collectionPoint}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#17251C]">Road Clearance:</strong>{' '}
                  <span className="text-[#647067]">{produce.roadAccessibility}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Farmer Profile Card */}
          <div className="bg-white border border-[#E5EAE5] rounded-lg p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={produce.farmer.avatarUrl}
                  alt={produce.farmer.name}
                  className="w-14 h-14 rounded-full object-cover border border-[#E5EAE5]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-display font-bold text-[#17251C]">
                      {produce.farmer.farmName}
                    </h3>
                    {produce.farmer.verified && (
                      <ShieldCheck className="w-4 h-4 text-[#166534]" />
                    )}
                  </div>
                  <p className="text-xs text-[#647067]">
                    Principal Grower: <strong className="text-[#17251C]">{produce.farmer.name}</strong>
                  </p>
                  {produce.farmer.cooperative && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-[11px] font-medium bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] rounded">
                      {produce.farmer.cooperative}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E5EAE5] text-xs">
                <div>
                  <span className="text-[#647067] block">Completed Lots</span>
                  <strong className="text-sm font-mono font-bold text-[#17251C]">
                    {produce.farmer.completedFulfillments} Orders
                  </strong>
                </div>
                <div className="border-l border-[#E5EAE5] pl-4">
                  <span className="text-[#647067] block">Experience</span>
                  <strong className="text-sm font-mono font-bold text-[#17251C]">
                    {produce.farmer.yearsFarming} Yrs
                  </strong>
                </div>
                <div className="border-l border-[#E5EAE5] pl-4">
                  <span className="text-[#647067] block">Quality Score</span>
                  <strong className="text-sm font-mono font-bold text-[#166534]">
                    {produce.farmer.rating} / 5.0
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT 5 COLUMNS: OBVIOUS RESERVE PRODUCE CALCULATOR ==================== */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24">
          <form
            onSubmit={handleSubmitReservation}
            className="bg-white border-2 border-[#166534] rounded-xl overflow-hidden shadow-elevated"
          >
            {/* Price Header */}
            <div className="p-5 sm:p-6 bg-[#F0FDF4] border-b border-[#BBF7D0]">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold block">
                    Direct Farm-Gate Price
                  </span>
                  <span className="text-3xl font-display font-extrabold text-[#17251C] tabular-nums">
                    {formatNaira(produce.pricePerUnit)}
                  </span>
                  <span className="text-xs text-[#647067] ml-1.5">per {produce.unit}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#166534] block">
                    {produce.quantityAvailable} units left
                  </span>
                  <span className="text-[11px] text-[#647067]">
                    Min. {produce.minimumReservation} units
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              {/* Quantity Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-display font-bold text-[#17251C]">
                    1. Select Quantity to Reserve ({produce.unit})
                  </label>
                  <span className="font-mono text-xs font-semibold text-[#166534]">
                    {totalWeightTonnes} Metric Tonnes
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setReserveQty((q) => Math.max(produce.minimumReservation, q - 5))
                    }
                    className="w-10 h-10 rounded-md border border-[#E5EAE5] bg-[#F8FAF7] hover:bg-white font-mono font-bold text-base"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={produce.minimumReservation}
                    max={produce.quantityAvailable}
                    value={reserveQty}
                    onChange={(e) =>
                      setReserveQty(
                        Math.min(
                          produce.quantityAvailable,
                          Math.max(produce.minimumReservation, Number(e.target.value))
                        )
                      )
                    }
                    className="flex-1 h-10 px-3 text-center font-mono font-bold text-base bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setReserveQty((q) => Math.min(produce.quantityAvailable, q + 5))
                    }
                    className="w-10 h-10 rounded-md border border-[#E5EAE5] bg-[#F8FAF7] hover:bg-white font-mono font-bold text-base"
                  >
                    +
                  </button>
                </div>

                {/* Quick Volume Presets */}
                <div className="flex items-center gap-2 mt-2">
                  {[
                    produce.minimumReservation,
                    Math.min(
                      produce.quantityAvailable,
                      Math.round((produce.minimumReservation + produce.quantityAvailable) / 2)
                    ),
                    produce.quantityAvailable,
                  ].map((val, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReserveQty(val)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono border ${
                        reserveQty === val
                          ? 'bg-[#166534] text-white border-[#166534]'
                          : 'bg-[#F8FAF7] text-[#647067] border-[#E5EAE5]'
                      }`}
                    >
                      {idx === 2 ? `Full Lot (${val})` : `${val} units`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transportation Toggle */}
              <div className="pt-4 border-t border-[#E5EAE5]">
                <label className="text-xs font-display font-bold text-[#17251C] block mb-2">
                  2. Logistics & Collection Arrangement
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRequiresTransport(true)}
                    className={`p-3 rounded-md border text-left transition-all ${
                      requiresTransport
                        ? 'bg-[#F0FDF4] border-[#166534] ring-1 ring-[#166534]/20'
                        : 'bg-[#F8FAF7] border-[#E5EAE5]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#17251C]">
                      <Truck className="w-3.5 h-3.5 text-[#166534]" />
                      <span>HarvestLink Haulage</span>
                    </div>
                    <p className="text-[11px] text-[#647067] mt-0.5">
                      Matched {recommendedVehicle}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequiresTransport(false)}
                    className={`p-3 rounded-md border text-left transition-all ${
                      !requiresTransport
                        ? 'bg-[#F0FDF4] border-[#166534] ring-1 ring-[#166534]/20'
                        : 'bg-[#F8FAF7] border-[#E5EAE5]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#17251C]">
                      <Scale className="w-3.5 h-3.5 text-[#166534]" />
                      <span>Self-Collection</span>
                    </div>
                    <p className="text-[11px] text-[#647067] mt-0.5">Send your own fleet truck</p>
                  </button>
                </div>

                {requiresTransport && (
                  <div className="mt-3 space-y-3 p-3.5 rounded-lg bg-[#F8FAF7] border border-[#E5EAE5]">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] text-[#647067] block mb-1">
                          Delivery State
                        </label>
                        <input
                          type="text"
                          value={deliveryState}
                          onChange={(e) => setDeliveryState(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E5EAE5] rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#647067] block mb-1">
                          Target Delivery Date
                        </label>
                        <input
                          type="date"
                          value={preferredDeliveryDate}
                          onChange={(e) => setPreferredDeliveryDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-[#E5EAE5] rounded"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-[#647067] block mb-1">
                        Destination Warehouse / Offloading Address
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E5EAE5] rounded"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-[#E5EAE5] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#647067]">
                    Produce ({reserveQty} × {formatNaira(produce.pricePerUnit)})
                  </span>
                  <span className="font-mono font-semibold text-[#17251C] tabular-nums">
                    {formatNaira(subtotalAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#647067]">Escrow & Quality Verification (1%)</span>
                  <span className="font-mono text-[#17251C] tabular-nums">
                    {formatNaira(platformEscrowFee)}
                  </span>
                </div>
                {requiresTransport && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#647067]">
                      Est. Haulage ({recommendedVehicle.split(' ')[0]})
                    </span>
                    <span className="font-mono font-semibold text-[#166534] tabular-nums">
                      {formatNaira(estimatedHaulageCost)}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-[#E5EAE5] flex items-baseline justify-between">
                  <span className="font-display font-bold text-sm text-[#17251C]">
                    Total Reservation Value
                  </span>
                  <span className="text-xl font-display font-extrabold text-[#166534] tabular-nums">
                    {formatNaira(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Reservation Conditions */}
              <div className="p-3 rounded bg-[#F8FAF7] border border-[#E5EAE5] text-[11px] text-[#647067] flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-[#166534] shrink-0 mt-0.5" />
                <span>
                  Funds are held in HarvestLink Escrow and only released after the farmer confirms
                  allocation and your depot verifies offloaded weight.
                </span>
              </div>

              {/* Primary CTA Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-sm font-display font-bold transition-colors shadow-elevated flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Reserve {reserveQty} Units Now</span>
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
};
