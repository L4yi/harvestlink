import React from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import {
  CURRENT_FARMER,
  formatNaira,
  formatDateHuman,
  daysUntilDate,
} from '../../data/mockData';
import { OrderStatusBadge, HarvestStatusBadge } from '../../components/ui/StatusBadge';
import {
  PlusCircle,
  AlertCircle,
  Calendar,
  Check,
  X,
  ArrowRight,
  Truck,
  Sprout,
  MapPin,
  ShieldCheck,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { produceListings, orders, navigate, respondToReservation } = useHarvestLink();

  const myListings = produceListings.filter((p) => p.farmer.id === CURRENT_FARMER.id);
  const myOrders = orders.filter((o) => o.farmerId === CURRENT_FARMER.id || o.farmerId === 'farmer-1');
  const pendingOrders = myOrders.filter((o) => o.status === 'Pending');
  const upcomingCollections = myOrders.filter((o) =>
    ['Confirmed', 'Awaiting transportation', 'Transporter assigned'].includes(o.status)
  );

  // Calculate active inventory value
  const activeInventoryValue = myListings.reduce(
    (sum, item) => sum + item.quantityAvailable * item.pricePerUnit,
    0
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ==================== 1. PERSONALISED GREETING & PROMINENT ACTION ==================== */}
      <section className="bg-white border border-[#E5EAE5] rounded-lg p-5 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#647067] mb-2">
              <span className="inline-flex items-center gap-1 font-medium text-[#166534] bg-[#F0FDF4] px-2.5 py-0.5 rounded border border-[#BBF7D0]">
                <ShieldCheck className="w-3.5 h-3.5" />
                {CURRENT_FARMER.cooperative}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#647067]" />
                {CURRENT_FARMER.community}, {CURRENT_FARMER.lga} LGA, {CURRENT_FARMER.state}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] tracking-tight">
              Good morning, {CURRENT_FARMER.name}
            </h1>
            <p className="text-sm text-[#647067] mt-1 max-w-2xl">
              {pendingOrders.length > 0
                ? `You have ${pendingOrders.length} pending buyer reservation${
                    pendingOrders.length > 1 ? 's' : ''
                  } awaiting your confirmation and ${myListings.length} active harvest lots on the market.`
                : `All incoming reservations are confirmed. You have ${myListings.length} active harvest lots live on the marketplace.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('farmer-reservations')}
              className="px-4 py-2.5 rounded-md border border-[#E5EAE5] bg-[#F8FAF7] hover:bg-white text-xs font-semibold text-[#17251C] transition-colors"
            >
              View Reservations ({myOrders.length})
            </button>
            <button
              onClick={() => navigate('farmer-create-produce')}
              className="px-5 py-2.5 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold transition-colors inline-flex items-center gap-2 shadow-subtle"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Produce Listing</span>
            </button>
          </div>
        </div>

        {/* Architectural Operational Summary Strip (Not generic stat cards) */}
        <div className="mt-6 pt-5 border-t border-[#E5EAE5] grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] block">
              1. Needs Attention Now
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-display font-extrabold text-[#17251C] tabular-nums">
                {pendingOrders.length}
              </span>
              <span className="text-xs text-amber-800 font-medium">
                Pending Confirmation{pendingOrders.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <div className="border-l border-[#E5EAE5] pl-4 sm:pl-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] block">
              2. Upcoming Collections
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-display font-extrabold text-[#17251C] tabular-nums">
                {upcomingCollections.length}
              </span>
              <span className="text-xs text-[#166534] font-medium">Staged at Farm Gate</span>
            </div>
          </div>

          <div className="border-l border-[#E5EAE5] pl-4 sm:pl-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] block">
              3. Active Harvest Lots
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-display font-extrabold text-[#17251C] tabular-nums">
                {myListings.length}
              </span>
              <span className="text-xs text-[#647067]">Listed on Market</span>
            </div>
          </div>

          <div className="border-l border-[#E5EAE5] pl-4 sm:pl-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] block">
              4. Listed Lot Valuation
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-display font-extrabold text-[#166534] tabular-nums">
                {formatNaira(activeInventoryValue)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. WHAT NEEDS MY ATTENTION (PENDING RESERVATIONS & COLLECTIONS) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Incoming Reservations Requiring Action */}
        <section className="lg:col-span-7 bg-white border border-[#E5EAE5] rounded-lg overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-[#E5EAE5] flex items-center justify-between bg-[#F8FAF7]/60">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#166534]" />
                <h2 className="text-sm font-display font-bold text-[#17251C]">
                  Incoming Buyer Reservations Requiring Confirmation
                </h2>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-mono font-semibold bg-amber-50 text-amber-900 border border-amber-200 rounded">
                {pendingOrders.length} Action Required
              </span>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-display font-bold text-[#17251C]">
                  All buyer reservations have been reviewed
                </p>
                <p className="text-xs text-[#647067] mt-1">
                  New reservation requests from commercial buyers will appear here for one-click
                  confirmation.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#E5EAE5]">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="p-5 hover:bg-[#F8FAF7]/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={order.produceImage}
                          alt={order.produceName}
                          className="w-14 h-14 rounded-md object-cover border border-[#E5EAE5] shrink-0"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-[#166534]">
                              {order.orderNumber}
                            </span>
                            <OrderStatusBadge status={order.status} size="sm" />
                            <span className="text-[11px] text-[#647067]">{order.createdAt}</span>
                          </div>
                          <h3 className="text-sm font-display font-bold text-[#17251C] mt-1">
                            {order.produceName}
                          </h3>
                          <p className="text-xs text-[#647067] mt-0.5">
                            Buyer: <strong className="text-[#17251C]">{order.buyerOrganization}</strong> •
                            Destination: {order.deliveryCity}, {order.deliveryState}
                          </p>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 bg-[#F8FAF7] sm:bg-transparent p-3 sm:p-0 rounded border border-[#E5EAE5] sm:border-0">
                        <span className="text-[11px] text-[#647067] block">
                          Reserved: {order.quantityReserved} × {order.produceUnit}
                        </span>
                        <span className="text-base font-display font-extrabold text-[#17251C] tabular-nums block mt-0.5">
                          {formatNaira(order.subtotalAmount)}
                        </span>
                        <span className="text-[11px] text-[#166534] font-medium block">
                          Target Harvest: {formatDateHuman(order.expectedHarvestDate)}
                        </span>
                      </div>
                    </div>

                    {order.buyerNotes && (
                      <div className="mt-3 px-3 py-2 rounded bg-[#F8FAF7] border border-[#E5EAE5] text-xs text-[#647067]">
                        <strong className="text-[#17251C]">Buyer Loading Note:</strong> {order.buyerNotes}
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-[#E5EAE5] flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => navigate('farmer-order-detail', { orderId: order.id })}
                        className="text-xs font-semibold text-[#647067] hover:text-[#17251C] inline-flex items-center gap-1"
                      >
                        <span>Inspect Full Reservation & Custody Chain</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => respondToReservation(order.id, 'decline')}
                          className="px-3 py-1.5 rounded border border-[#E5EAE5] bg-white hover:bg-rose-50 hover:text-rose-800 hover:border-rose-200 text-xs font-semibold text-[#647067] inline-flex items-center gap-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                        <button
                          onClick={() => respondToReservation(order.id, 'accept')}
                          className="px-4 py-1.5 rounded bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-subtle"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm Allocation</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-5 py-3 bg-[#F8FAF7] border-t border-[#E5EAE5] flex items-center justify-between text-xs">
            <span className="text-[#647067]">
              Confirming an order locks the buyer's escrow and notifies haulage dispatch.
            </span>
            <button
              onClick={() => navigate('farmer-reservations')}
              className="font-semibold text-[#166534] hover:underline shrink-0 ml-2"
            >
              All Orders →
            </button>
          </div>
        </section>

        {/* Right 5 Columns: Upcoming Harvest Schedule & Collection Readiness */}
        <section className="lg:col-span-5 bg-white border border-[#E5EAE5] rounded-lg overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-[#E5EAE5] flex items-center justify-between bg-[#F8FAF7]/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#166534]" />
                <h2 className="text-sm font-display font-bold text-[#17251C]">
                  Upcoming Harvests & Collection Windows
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#647067]">Nov 2026</span>
            </div>

            <div className="divide-y divide-[#E5EAE5]">
              {myListings.map((lot) => {
                const timing = daysUntilDate(lot.expectedHarvestDate);
                const reservedUnits = lot.totalQuantityListed - lot.quantityAvailable;
                const reservedPct = Math.round((reservedUnits / lot.totalQuantityListed) * 100);

                return (
                  <div key={lot.id} className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono text-[#647067]">{lot.lotCode}</span>
                        <h3 className="text-sm font-display font-bold text-[#17251C]">
                          {lot.cropName}
                        </h3>
                        <p className="text-xs text-[#647067] mt-0.5">{lot.collectionPoint}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-block px-2.5 py-1 rounded bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-mono font-bold text-[#166534]">
                          {formatDateHuman(lot.expectedHarvestDate)}
                        </span>
                        <span className="block text-[11px] text-[#647067] mt-1">{timing.label}</span>
                      </div>
                    </div>

                    {/* Allocation Progress Bar */}
                    <div className="mt-3.5">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-[#647067]">
                          Reserved: <strong className="text-[#17251C]">{reservedUnits}</strong> of{' '}
                          {lot.totalQuantityListed} units ({reservedPct}%)
                        </span>
                        <span className="font-mono text-[#166534] font-semibold">
                          {lot.quantityAvailable} left
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#E5EAE5] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#166534] rounded-full"
                          style={{ width: `${Math.max(8, reservedPct)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Collection Arrangements Callout */}
              {upcomingCollections.slice(0, 2).map((col) => (
                <div
                  key={col.id}
                  onClick={() => navigate('farmer-order-detail', { orderId: col.id })}
                  className="p-4 sm:p-5 bg-[#F0FDF4]/40 hover:bg-[#F0FDF4]/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#166534]">
                      <Truck className="w-3.5 h-3.5" />
                      Collection Arrangement • {col.orderNumber}
                    </span>
                    <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#BBF7D0] text-[#17251C]">
                      Code: <strong>{col.collectionCode}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-[#17251C] font-medium mt-1.5">
                    {col.quantityReserved} × {col.produceUnit} — {col.produceName}
                  </p>
                  <p className="text-[11px] text-[#647067] mt-0.5">
                    {col.transporterCompany
                      ? `Assigned Carrier: ${col.transporterCompany} (${col.vehiclePlate})`
                      : `Confirmed for ${col.buyerOrganization} — Awaiting truck assignment`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 py-3 bg-[#F8FAF7] border-t border-[#E5EAE5] flex items-center justify-between text-xs">
            <span className="text-[#647067]">Planning another harvest this month?</span>
            <button
              onClick={() => navigate('farmer-create-produce')}
              className="font-semibold text-[#166534] hover:underline"
            >
              + List Expected Harvest
            </button>
          </div>
        </section>
      </div>

      {/* ==================== 3. ACTIVE PRODUCE LISTINGS LEDGER ==================== */}
      <section className="bg-white border border-[#E5EAE5] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-display font-bold text-[#17251C]">
              Active Farm Produce Inventory
            </h2>
            <p className="text-xs text-[#647067]">
              Live lots visible to commercial processors, wholesalers, and aggregators on HarvestLink.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('farmer-produce')}
              className="px-3 py-1.5 rounded border border-[#E5EAE5] bg-[#F8FAF7] hover:bg-white text-xs font-semibold text-[#17251C] transition-colors"
            >
              Manage Inventory
            </button>
            <button
              onClick={() => navigate('farmer-create-produce')}
              className="px-3.5 py-1.5 rounded bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold transition-colors"
            >
              + New Lot
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAE5] bg-[#F8FAF7] text-[11px] font-mono uppercase tracking-wider text-[#647067]">
                <th className="py-3 px-5">Produce Lot</th>
                <th className="py-3 px-4">Expected Harvest</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Available Quantity</th>
                <th className="py-3 px-4">Price / Unit</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE5] text-xs">
              {myListings.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8FAF7]/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images[0]}
                        alt={item.cropName}
                        className="w-10 h-10 rounded object-cover border border-[#E5EAE5] shrink-0"
                      />
                      <div>
                        <span className="font-mono text-[10px] text-[#647067] block">
                          {item.lotCode}
                        </span>
                        <span className="font-display font-bold text-[#17251C] text-sm">
                          {item.cropName}
                        </span>
                        <span className="text-[11px] text-[#647067] block">
                          {item.community}, {item.lga} LGA
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#17251C] tabular-nums">
                    {formatDateHuman(item.expectedHarvestDate)}
                  </td>
                  <td className="py-3.5 px-4">
                    <HarvestStatusBadge status={item.harvestStatus} compact />
                  </td>
                  <td className="py-3.5 px-4 tabular-nums">
                    <strong className="text-[#17251C] font-semibold">
                      {item.quantityAvailable}
                    </strong>{' '}
                    <span className="text-[#647067]">/ {item.totalQuantityListed} {item.unit}</span>
                  </td>
                  <td className="py-3.5 px-4 font-display font-bold text-[#17251C] tabular-nums">
                    {formatNaira(item.pricePerUnit)}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => navigate('farmer-produce')}
                      className="text-xs font-semibold text-[#166534] hover:underline"
                    >
                      Edit Lot →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
