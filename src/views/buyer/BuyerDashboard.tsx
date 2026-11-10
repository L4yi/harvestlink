import React, { useState } from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import {
  CURRENT_BUYER,
  formatNaira,
  formatDateHuman,
} from '../../data/mockData';
import { ProduceCard } from '../../components/ui/ProduceCard';
import { OrderStatusBadge } from '../../components/ui/StatusBadge';
import {
  Search,
  Store,
  Calendar,
  Truck,
  ArrowRight,
  PackageCheck,
  Navigation,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const { produceListings, orders, navigate } = useHarvestLink();
  const [quickSearch, setQuickSearch] = useState('');

  const featuredListings = produceListings.filter((p) => p.featured).slice(0, 3);
  const harvestsSoon = produceListings.filter(
    (p) => p.harvestStatus !== 'Ready for Immediate Collection'
  );
  const activeDeliveries = orders.filter((o) =>
    ['Transporter assigned', 'Collected', 'In transit', 'Delivered'].includes(o.status)
  );
  const currentReservations = orders.filter((o) =>
    ['Pending', 'Confirmed', 'Awaiting transportation'].includes(o.status)
  );

  const handleSelectProduce = (produceId: string) => {
    navigate('buyer-produce-detail', { produceId });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ==================== 1. COMMERCIAL PROCUREMENT COMMAND BAR ==================== */}
      <section className="bg-white border border-[#E5EAE5] rounded-lg p-5 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#647067] mb-2">
              <span className="inline-flex items-center gap-1 font-medium text-[#166534] bg-[#F0FDF4] px-2.5 py-0.5 rounded border border-[#BBF7D0]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Commercial Offtaker
              </span>
              <span>•</span>
              <span>{CURRENT_BUYER.organization}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#647067]" />
                Receiving Depot: {CURRENT_BUYER.city}, {CURRENT_BUYER.state}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] tracking-tight">
              Direct Farm Sourcing & Logistics Desk
            </h1>
            <p className="text-sm text-[#647067] mt-1 max-w-2xl">
              Discover verified farm-gate lots across Nigeria, lock pre-harvest allocations, and
              track active interstate deliveries into your depot.
            </p>
          </div>

          {/* Quick Search + Marketplace Entry */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate('buyer-marketplace');
              }}
              className="relative flex-1 sm:w-72"
            >
              <Search className="w-4 h-4 text-[#647067] absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Search maize, yam, tomatoes, state..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#F8FAF7] border border-[#E5EAE5] rounded-md focus:bg-white focus:outline-none focus:border-[#166534]"
              />
            </form>
            <button
              onClick={() => navigate('buyer-marketplace')}
              className="px-4 py-2 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors shrink-0 shadow-subtle"
            >
              <Store className="w-4 h-4" />
              <span>Open Trading Floor ({produceListings.length})</span>
            </button>
          </div>
        </div>

        {/* Category Quick Pills */}
        <div className="mt-5 pt-4 border-t border-[#E5EAE5] flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] shrink-0 mr-1">
            Corridors & Crops:
          </span>
          {[
            'Kaduna Tomatoes & Maize',
            'Benue Pona Yam',
            'Oyo High-Starch Cassava',
            'Edo Green Plantain',
            'Plateau Highland Peppers',
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => navigate('buyer-marketplace')}
              className="px-3 py-1 rounded bg-[#F8FAF7] hover:bg-[#F0FDF4] hover:text-[#166534] hover:border-[#BBF7D0] border border-[#E5EAE5] text-xs font-medium text-[#17251C] whitespace-nowrap transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* ==================== 2. ACTIVE DELIVERIES & CURRENT RESERVATIONS ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Deliveries in Transit (Left 6 Cols) */}
        <section className="lg:col-span-6 bg-white border border-[#E5EAE5] rounded-lg overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-[#E5EAE5] flex items-center justify-between bg-[#F8FAF7]/60">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#166534]" />
                <h2 className="text-sm font-display font-bold text-[#17251C]">
                  Active Deliveries & Assigned Haulage
                </h2>
              </div>
              <span className="text-xs font-mono font-semibold text-[#166534]">
                {activeDeliveries.length} Active
              </span>
            </div>

            <div className="divide-y divide-[#E5EAE5]">
              {activeDeliveries.map((del) => (
                <div
                  key={del.id}
                  onClick={() => navigate('buyer-order-tracking', { orderId: del.id })}
                  className="p-4 sm:p-5 hover:bg-[#F8FAF7]/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#17251C]">
                          {del.orderNumber}
                        </span>
                        <OrderStatusBadge status={del.status} size="sm" />
                      </div>
                      <h3 className="text-sm font-display font-bold text-[#17251C] mt-1">
                        {del.produceName} ({del.quantityReserved} units)
                      </h3>
                      <p className="text-xs text-[#647067] mt-0.5">
                        Route: {del.pickupState} ({del.pickupLga}) → {del.deliveryCity},{' '}
                        {del.deliveryState}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-semibold text-[#166534] block">
                        {del.vehiclePlate || 'Assigned'}
                      </span>
                      <span className="text-[11px] text-[#647067] block mt-0.5">
                        ETA: {formatDateHuman(del.preferredDeliveryDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 py-3 bg-[#F8FAF7] border-t border-[#E5EAE5] flex items-center justify-between text-xs">
            <span className="text-[#647067]">Live custody tracking from farm gate to depot</span>
            <button
              onClick={() => navigate('buyer-order-tracking')}
              className="font-semibold text-[#166534] hover:underline"
            >
              Track Shipments →
            </button>
          </div>
        </section>

        {/* Current Reservations & Transport Requests (Right 6 Cols) */}
        <section className="lg:col-span-6 bg-white border border-[#E5EAE5] rounded-lg overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-[#E5EAE5] flex items-center justify-between bg-[#F8FAF7]/60">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-[#166534]" />
                <h2 className="text-sm font-display font-bold text-[#17251C]">
                  Current Reservations & Pending Dispatch
                </h2>
              </div>
              <span className="text-xs font-mono text-[#647067]">
                {currentReservations.length} Open
              </span>
            </div>

            <div className="divide-y divide-[#E5EAE5]">
              {currentReservations.map((res) => (
                <div
                  key={res.id}
                  onClick={() => navigate('buyer-reservations', { orderId: res.id })}
                  className="p-4 sm:p-5 hover:bg-[#F8FAF7]/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#17251C]">
                          {res.orderNumber}
                        </span>
                        <OrderStatusBadge status={res.status} size="sm" />
                      </div>
                      <h3 className="text-sm font-display font-bold text-[#17251C] mt-1">
                        {res.produceName}
                      </h3>
                      <p className="text-xs text-[#647067] mt-0.5">
                        {res.farmName} ({res.pickupCommunity}, {res.pickupState})
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-display font-extrabold text-[#17251C] tabular-nums block">
                        {formatNaira(res.totalAmount)}
                      </span>
                      <span className="text-[11px] text-[#647067] block">
                        {res.quantityReserved} × {res.produceUnit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 py-3 bg-[#F8FAF7] border-t border-[#E5EAE5] flex items-center justify-between text-xs">
            <span className="text-[#647067]">Manage reservations or request haulage trucks</span>
            <button
              onClick={() => navigate('buyer-reservations')}
              className="font-semibold text-[#166534] hover:underline"
            >
              All Reservations →
            </button>
          </div>
        </section>
      </div>

      {/* ==================== 3. FEATURED FARM LOTS ==================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
              Verified Farm-Gate Allocations
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-[#17251C] mt-0.5">
              Featured Commercial Produce Lots
            </h2>
          </div>
          <button
            onClick={() => navigate('buyer-marketplace')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#166534] hover:underline"
          >
            <span>Browse All {produceListings.length} Produce Lots</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((item) => (
            <ProduceCard
              key={item.id}
              produce={item}
              onSelect={handleSelectProduce}
            />
          ))}
        </div>
      </section>

      {/* ==================== 4. HARVESTS AVAILABLE SOON (FORWARD BOOKING) ==================== */}
      <section className="bg-white border border-[#E5EAE5] rounded-lg p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5EAE5]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Forward Harvest Schedule (Next 3–10 Days)</span>
            </div>
            <h2 className="text-lg font-display font-bold text-[#17251C] mt-0.5">
              Harvests Available Soon — Reserve Before Uprooting
            </h2>
            <p className="text-xs text-[#647067] mt-0.5">
              Lock farm-gate prices and coordinate truck loading on the exact morning of harvest.
            </p>
          </div>
          <button
            onClick={() => navigate('buyer-marketplace')}
            className="px-3.5 py-2 rounded border border-[#E5EAE5] bg-[#F8FAF7] hover:bg-white text-xs font-semibold text-[#17251C] shrink-0"
          >
            Filter by Harvest Date
          </button>
        </div>

        <div className="mt-4 divide-y divide-[#E5EAE5]">
          {harvestsSoon.map((lot) => (
            <div
              key={lot.id}
              onClick={() => handleSelectProduce(lot.id)}
              className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAF7]/50 px-2 rounded cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={lot.images[0]}
                  alt={lot.cropName}
                  className="w-12 h-12 rounded object-cover border border-[#E5EAE5] shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[#647067]">{lot.lotCode}</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] rounded">
                      Expected Harvest: {formatDateHuman(lot.expectedHarvestDate)}
                    </span>
                  </div>
                  <h3 className="text-sm font-display font-bold text-[#17251C] mt-0.5">
                    {lot.cropName}
                  </h3>
                  <p className="text-xs text-[#647067]">
                    {lot.farmer.farmName} • {lot.community}, {lot.lga} LGA, {lot.state}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="sm:text-right">
                  <span className="text-sm font-display font-extrabold text-[#17251C] tabular-nums block">
                    {formatNaira(lot.pricePerUnit)}
                  </span>
                  <span className="text-[11px] text-[#647067] block">
                    {lot.quantityAvailable} × {lot.unit}
                  </span>
                </div>
                <span className="px-3 py-1.5 rounded bg-[#166534] text-white text-xs font-semibold shrink-0">
                  Pre-Reserve
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
