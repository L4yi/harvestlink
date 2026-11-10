import React, { useState } from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import {
  CURRENT_TRANSPORTER,
  formatNaira,
  formatDateHuman,
} from '../../data/mockData';
import { OrderStatusBadge } from '../../components/ui/StatusBadge';
import {
  Truck,
  Navigation,
  MapPin,
  PackageCheck,
  CheckCircle2,
  ArrowRight,
  Scale,
  Calendar,
  ShieldCheck,
  History,
} from 'lucide-react';

export const TransporterDashboard: React.FC = () => {
  const {
    orders,
    fleetVehicles,
    navigate,
    acceptDeliveryJob,
    advanceOrderStatus,
    toggleVehicleAvailability,
  } = useHarvestLink();

  const availableJobs = orders.filter((o) => o.status === 'Awaiting transportation');
  const activeDeliveries = orders.filter((o) =>
    ['Transporter assigned', 'Collected', 'In transit'].includes(o.status)
  );
  const completedDeliveries = orders.filter((o) =>
    ['Delivered', 'Completed'].includes(o.status)
  );

  const availableVehicles = fleetVehicles.filter((v) => v.status === 'Available');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    availableVehicles[0]?.id || fleetVehicles[0]?.id || 'veh-3'
  );

  const totalHaulageEarned = completedDeliveries.reduce(
    (sum, o) => sum + (o.transportCost || 420000),
    0
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ==================== 1. DISPATCH COMMAND HEADER ==================== */}
      <section className="bg-white border border-[#E5EAE5] rounded-lg p-5 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#647067] mb-2">
              <span className="inline-flex items-center gap-1 font-medium text-[#166534] bg-[#F0FDF4] px-2.5 py-0.5 rounded border border-[#BBF7D0]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Agro-Logistics Carrier
              </span>
              <span>•</span>
              <span>{CURRENT_TRANSPORTER.company}</span>
              <span>•</span>
              <span>Base: {CURRENT_TRANSPORTER.baseLocation}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] tracking-tight">
              Fleet Dispatch & Corridor Load Board
            </h1>
            <p className="text-sm text-[#647067] mt-1 max-w-2xl">
              {availableJobs.length > 0
                ? `${availableJobs.length} confirmed farm-gate load${
                    availableJobs.length > 1 ? 's' : ''
                  } match your North–South haulage corridors. ${availableVehicles.length} of ${
                    fleetVehicles.length
                  } trucks are ready for immediate dispatch.`
                : `You have ${activeDeliveries.length} active interstate deliveries in progress.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('transporter-profile')}
              className="px-4 py-2.5 rounded-md border border-[#E5EAE5] bg-[#F8FAF7] hover:bg-white text-xs font-semibold text-[#17251C] transition-colors"
            >
              Manage Fleet ({fleetVehicles.length} Trucks)
            </button>
            <button
              onClick={() => navigate('transporter-requests')}
              className="px-5 py-2.5 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-subtle"
            >
              <Truck className="w-4 h-4" />
              <span>Available Delivery Jobs ({availableJobs.length})</span>
            </button>
          </div>
        </div>

        {/* Operational Telemetry Strip */}
        <div className="mt-6 pt-5 border-t border-[#E5EAE5] grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] block">
              1. Available Loads
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-display font-extrabold text-[#166534] tabular-nums">
                {availableJobs.length}
              </span>
              <span className="text-xs text-[#647067]">Awaiting Truck</span>
            </div>
          </div>

          <div className="border-l border-[#E5EAE5] pl-4 sm:pl-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] block">
              2. Active Deliveries
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-display font-extrabold text-[#17251C] tabular-nums">
                {activeDeliveries.length}
              </span>
              <span className="text-xs text-blue-800 font-medium">On Corridor</span>
            </div>
          </div>

          <div className="border-l border-[#E5EAE5] pl-4 sm:pl-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] block">
              3. Fleet Readiness
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-display font-extrabold text-[#17251C] tabular-nums">
                {availableVehicles.length} / {fleetVehicles.length}
              </span>
              <span className="text-xs text-[#166534] font-medium">Trucks Available</span>
            </div>
          </div>

          <div className="border-l border-[#E5EAE5] pl-4 sm:pl-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] block">
              4. Completed Haulage
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-xl font-display font-extrabold text-[#17251C] tabular-nums">
                {formatNaira(totalHaulageEarned)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. AVAILABLE DELIVERY JOBS & ACTIVE DELIVERIES ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Available Delivery Jobs */}
        <section className="lg:col-span-7 bg-white border border-[#E5EAE5] rounded-lg overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-[#E5EAE5] flex items-center justify-between bg-[#F8FAF7]/60">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#166534]" />
                <h2 className="text-sm font-display font-bold text-[#17251C]">
                  Available Delivery Jobs (Confirmed Farm Allocations)
                </h2>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-mono font-semibold bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] rounded">
                {availableJobs.length} Ready for Dispatch
              </span>
            </div>

            {availableJobs.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-display font-bold text-[#17251C]">
                  All open delivery requests have been assigned
                </p>
                <p className="text-xs text-[#647067] mt-1">
                  Check your Active Deliveries panel to update collection and transit milestones.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#E5EAE5]">
                {availableJobs.map((job) => (
                  <div key={job.id} className="p-5 hover:bg-[#F8FAF7]/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#17251C]">
                            {job.orderNumber}
                          </span>
                          <span className="px-2 py-0.5 text-[11px] font-mono bg-amber-50 text-amber-900 border border-amber-200 rounded font-medium">
                            Req: {job.requiredVehicleType || '10-Tonne Truck'}
                          </span>
                          <span className="font-mono text-xs text-[#647067]">
                            {job.estimatedWeightTonnes} Tonnes
                          </span>
                        </div>

                        <h3 className="text-base font-display font-bold text-[#17251C] mt-1.5">
                          {job.produceName} ({job.quantityReserved} × {job.produceUnit})
                        </h3>

                        {/* Route Comparison Box */}
                        <div className="mt-3 p-3 rounded-md bg-[#F8FAF7] border border-[#E5EAE5] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-[#647067] block">
                              Collection Point ({job.pickupState})
                            </span>
                            <strong className="text-[#17251C] block mt-0.5">
                              {job.pickupCommunity}, {job.pickupLga} LGA
                            </strong>
                            <span className="text-[11px] text-[#647067] block">
                              {job.collectionPoint}
                            </span>
                          </div>
                          <div className="sm:border-l border-[#E5EAE5] sm:pl-3">
                            <span className="text-[10px] font-mono uppercase text-[#647067] block">
                              Destination ({job.deliveryState})
                            </span>
                            <strong className="text-[#17251C] block mt-0.5">
                              {job.deliveryCity}
                            </strong>
                            <span className="text-[11px] text-[#647067] block">
                              {job.deliveryAddress}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="text-[11px] text-[#647067] block">Haulage Payout</span>
                        <span className="text-xl font-display font-extrabold text-[#166534] tabular-nums block">
                          {formatNaira(job.transportCost || 520000)}
                        </span>
                        <span className="text-[11px] text-[#647067] font-mono block mt-0.5">
                          ~{job.estimatedDistanceKm || 680} km corridor
                        </span>
                      </div>
                    </div>

                    {/* Assign Truck & Accept Footer */}
                    <div className="mt-4 pt-3 border-t border-[#E5EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#647067] shrink-0">Assign Vehicle:</span>
                        <select
                          value={selectedVehicleId}
                          onChange={(e) => setSelectedVehicleId(e.target.value)}
                          className="px-2.5 py-1.5 text-xs font-mono bg-white border border-[#E5EAE5] rounded"
                        >
                          {fleetVehicles.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.plateNumber} — {v.type} ({v.capacityTonnes}T)
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => acceptDeliveryJob(job.id, selectedVehicleId)}
                        className="px-4 py-2 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors shadow-subtle"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Delivery Request</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-5 py-3 bg-[#F8FAF7] border-t border-[#E5EAE5] flex items-center justify-between text-xs">
            <span className="text-[#647067]">
              Payouts are guaranteed in HarvestLink Escrow upon verified offloading.
            </span>
            <button
              onClick={() => navigate('transporter-requests')}
              className="font-semibold text-[#166534] hover:underline shrink-0"
            >
              Full Load Board →
            </button>
          </div>
        </section>

        {/* Right 5 Columns: Active Deliveries & Upcoming Collections */}
        <section className="lg:col-span-5 bg-white border border-[#E5EAE5] rounded-lg overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-[#E5EAE5] flex items-center justify-between bg-[#F8FAF7]/60">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#166534]" />
                <h2 className="text-sm font-display font-bold text-[#17251C]">
                  Active Deliveries & Upcoming Collections
                </h2>
              </div>
              <span className="text-xs font-mono text-[#166534] font-semibold">
                {activeDeliveries.length} Active
              </span>
            </div>

            <div className="divide-y divide-[#E5EAE5]">
              {activeDeliveries.map((trip) => (
                <div key={trip.id} className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#17251C]">
                          {trip.orderNumber}
                        </span>
                        <OrderStatusBadge status={trip.status} size="sm" />
                      </div>
                      <h3 className="text-sm font-display font-bold text-[#17251C] mt-1">
                        {trip.produceName} ({trip.estimatedWeightTonnes}t)
                      </h3>
                      <p className="text-xs text-[#647067] mt-0.5">
                        {trip.pickupState} ({trip.pickupCommunity}) → {trip.deliveryCity},{' '}
                        {trip.deliveryState}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#F8FAF7] border border-[#E5EAE5] font-mono text-[11px] font-semibold text-[#17251C]">
                      {trip.vehiclePlate}
                    </span>
                  </div>

                  {/* Direct Custody Update Buttons */}
                  <div className="pt-2 border-t border-[#E5EAE5] flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#647067]">
                      Code: <strong className="text-[#17251C]">{trip.collectionCode}</strong>
                    </span>

                    {trip.status === 'Transporter assigned' && (
                      <button
                        onClick={() => advanceOrderStatus(trip.id, 'Collected')}
                        className="px-3 py-1.5 rounded bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold"
                      >
                        Mark Collected at Farm
                      </button>
                    )}
                    {trip.status === 'Collected' && (
                      <button
                        onClick={() => advanceOrderStatus(trip.id, 'In transit')}
                        className="px-3 py-1.5 rounded bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold"
                      >
                        Start Interstate Transit
                      </button>
                    )}
                    {trip.status === 'In transit' && (
                      <button
                        onClick={() => advanceOrderStatus(trip.id, 'Delivered')}
                        className="px-3 py-1.5 rounded bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold"
                      >
                        Confirm Offloaded at Buyer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 py-3 bg-[#F8FAF7] border-t border-[#E5EAE5] flex items-center justify-between text-xs">
            <span className="text-[#647067]">Update custody checkpoints in real time</span>
            <button
              onClick={() => navigate('transporter-active')}
              className="font-semibold text-[#166534] hover:underline"
            >
              Manage Trips →
            </button>
          </div>
        </section>
      </div>

      {/* ==================== 3. VEHICLE AVAILABILITY LEDGER ==================== */}
      <section className="bg-white border border-[#E5EAE5] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-display font-bold text-[#17251C]">
              Fleet & Vehicle Availability
            </h2>
            <p className="text-xs text-[#647067]">
              Registered trucks, tonnage capacities, and current Nigerian transit corridors.
            </p>
          </div>
          <button
            onClick={() => navigate('transporter-profile')}
            className="px-3.5 py-1.5 rounded border border-[#E5EAE5] bg-[#F8FAF7] hover:bg-white text-xs font-semibold text-[#17251C] self-start sm:self-auto"
          >
            Edit Fleet & Corridors
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAE5] bg-[#F8FAF7] text-[11px] font-mono uppercase tracking-wider text-[#647067]">
                <th className="py-3 px-5">Vehicle & Plate</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Current Location</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE5] text-xs">
              {fleetVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-[#F8FAF7]/50">
                  <td className="py-3.5 px-5">
                    <span className="font-mono font-bold text-[#17251C] block">
                      {v.plateNumber}
                    </span>
                    <span className="text-[11px] text-[#647067]">{v.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#17251C]">
                    {v.capacityTonnes} Tonnes
                  </td>
                  <td className="py-3.5 px-4 text-[#647067]">{v.currentLocation}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[#17251C] font-medium block">{v.driverName}</span>
                    <span className="font-mono text-[11px] text-[#647067]">{v.driverPhone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${
                        v.status === 'Available'
                          ? 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]'
                          : v.status === 'On Active Route'
                          ? 'bg-blue-50 text-blue-900 border-blue-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          v.status === 'Available'
                            ? 'bg-[#22C55E]'
                            : v.status === 'On Active Route'
                            ? 'bg-blue-600'
                            : 'bg-gray-500'
                        }`}
                      />
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {v.status !== 'On Active Route' && (
                      <button
                        onClick={() => toggleVehicleAvailability(v.id)}
                        className="text-xs font-semibold text-[#166534] hover:underline"
                      >
                        Toggle Status
                      </button>
                    )}
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
