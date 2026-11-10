import React, { useState } from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import {
  CURRENT_TRANSPORTER,
  formatNaira,
  formatDateHuman,
} from '../../data/mockData';
import { OrderStatusBadge } from '../../components/ui/StatusBadge';
import { JourneyTimeline } from '../../components/ui/JourneyTimeline';
import {
  Truck,
  MapPin,
  CheckCircle2,
  PackageCheck,
  Navigation,
  Phone,
  ShieldCheck,
  PlusCircle,
  Scale,
  Calendar,
} from 'lucide-react';

export const TransporterRequestsView: React.FC = () => {
  const { orders, fleetVehicles, acceptDeliveryJob, navigate } = useHarvestLink();

  const openJobs = orders.filter((o) => o.status === 'Awaiting transportation');
  const [selectedVehicleByJob, setSelectedVehicleByJob] = useState<Record<string, string>>({});

  const handleAccept = (orderId: string) => {
    const chosenVehicleId =
      selectedVehicleByJob[orderId] ||
      fleetVehicles.find((v) => v.status === 'Available')?.id ||
      fleetVehicles[0]?.id;
    acceptDeliveryJob(orderId, chosenVehicleId);
    navigate('transporter-active', { orderId });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
            Interstate Haulage Load Board
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] mt-0.5">
            Available Delivery Requests ({openJobs.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#647067] mt-1">
            Compare farm-gate collection points, destination depots, and vehicle tonnage
            requirements before accepting a dispatch contract.
          </p>
        </div>
      </div>

      {openJobs.length === 0 ? (
        <div className="bg-white border border-[#E5EAE5] rounded-lg p-12 text-center">
          <Truck className="w-8 h-8 text-[#166534] mx-auto mb-3" />
          <h2 className="text-base font-display font-bold text-[#17251C]">
            All current delivery requests have been accepted
          </h2>
          <p className="text-xs text-[#647067] mt-1 max-w-md mx-auto">
            Proceed to Active Deliveries to manage farm collection codes and transit progress, or
            reserve a produce lot in the Buyer portal to generate a new transport request.
          </p>
          <button
            onClick={() => navigate('transporter-active')}
            className="mt-4 px-4 py-2 rounded-md bg-[#166534] text-white text-xs font-semibold"
          >
            Go to Active Deliveries
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {openJobs.map((job) => {
            const currentVehId =
              selectedVehicleByJob[job.id] ||
              fleetVehicles.find((v) => v.status === 'Available')?.id ||
              fleetVehicles[0]?.id;

            return (
              <div
                key={job.id}
                className="bg-white border border-[#E5EAE5] hover:border-[#166534]/50 rounded-lg p-5 sm:p-6 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E5EAE5]">
                  <div className="flex items-start gap-4">
                    <img
                      src={job.produceImage}
                      alt={job.produceName}
                      className="w-16 h-16 rounded-md object-cover border border-[#E5EAE5] shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#17251C]">
                          {job.orderNumber}
                        </span>
                        <OrderStatusBadge status={job.status} />
                        <span className="px-2.5 py-0.5 text-xs font-mono font-semibold bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] rounded">
                          Required: {job.requiredVehicleType || '10-Tonne Covered Box Truck'}
                        </span>
                      </div>
                      <h2 className="text-lg font-display font-bold text-[#17251C] mt-1">
                        {job.produceName} — {job.quantityReserved} × {job.produceUnit}
                      </h2>
                      <p className="text-xs text-[#647067] mt-0.5">
                        Total Cargo Weight: <strong className="text-[#17251C]">{job.estimatedWeightTonnes} Metric Tonnes</strong> •
                        Expected Loading Date: <strong className="text-[#166534]">{formatDateHuman(job.expectedHarvestDate)}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="lg:text-right bg-[#F0FDF4] lg:bg-transparent p-3 lg:p-0 rounded border border-[#BBF7D0] lg:border-0 shrink-0">
                    <span className="text-[11px] font-mono uppercase text-[#166534] font-semibold block">
                      Guaranteed Haulage Payout
                    </span>
                    <span className="text-2xl font-display font-extrabold text-[#166534] tabular-nums">
                      {formatNaira(job.transportCost || 540000)}
                    </span>
                    <span className="text-xs text-[#647067] block">
                      Distance: ~{job.estimatedDistanceKm || 680} km
                    </span>
                  </div>
                </div>

                {/* Collection vs Destination Comparison Grid */}
                <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[#F8FAF7] border border-[#E5EAE5]">
                    <div className="flex items-center justify-between text-xs text-[#647067] mb-1">
                      <span className="font-mono uppercase font-semibold text-[#166534]">
                        1. Collection Point (Origin)
                      </span>
                      <span className="font-mono">{job.pickupState} State</span>
                    </div>
                    <h3 className="text-sm font-display font-bold text-[#17251C]">
                      {job.pickupCommunity}, {job.pickupLga} LGA
                    </h3>
                    <p className="text-xs text-[#647067] mt-0.5">{job.collectionPoint}</p>
                    <p className="text-[11px] text-[#17251C] mt-2">
                      Grower: <strong>{job.farmerName}</strong> ({job.farmerPhone})
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#F8FAF7] border border-[#E5EAE5]">
                    <div className="flex items-center justify-between text-xs text-[#647067] mb-1">
                      <span className="font-mono uppercase font-semibold text-[#17251C]">
                        2. Offloading Depot (Destination)
                      </span>
                      <span className="font-mono">{job.deliveryState} State</span>
                    </div>
                    <h3 className="text-sm font-display font-bold text-[#17251C]">
                      {job.deliveryCity}, {job.deliveryState}
                    </h3>
                    <p className="text-xs text-[#647067] mt-0.5">{job.deliveryAddress}</p>
                    <p className="text-[11px] text-[#17251C] mt-2">
                      Offtaker: <strong>{job.buyerOrganization}</strong> • Target Arrival:{' '}
                      {formatDateHuman(job.preferredDeliveryDate)}
                    </p>
                  </div>
                </div>

                {/* Vehicle Selector & Accept Button */}
                <div className="pt-3 border-t border-[#E5EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <label className="text-xs font-semibold text-[#17251C]">
                      Select Fleet Truck to Assign:
                    </label>
                    <select
                      value={currentVehId}
                      onChange={(e) =>
                        setSelectedVehicleByJob((prev) => ({
                          ...prev,
                          [job.id]: e.target.value,
                        }))
                      }
                      className="px-3 py-2 text-xs font-mono bg-white border border-[#E5EAE5] rounded-md"
                    >
                      {fleetVehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.plateNumber} — {v.type} ({v.capacityTonnes}T • {v.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => handleAccept(job.id)}
                    className="px-5 py-2.5 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 shadow-subtle transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Delivery Request & Dispatch Truck</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const TransporterActiveDeliveriesView: React.FC = () => {
  const { orders, advanceOrderStatus, navigate } = useHarvestLink();

  const activeTrips = orders.filter((o) =>
    ['Transporter assigned', 'Collected', 'In transit', 'Delivered'].includes(o.status)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
            Live Custody & Corridor Execution
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] mt-0.5">
            Active Deliveries ({activeTrips.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#647067] mt-1">
            Verify farm-gate collection codes at loading and advance shipment custody states along
            the delivery route.
          </p>
        </div>

        <button
          onClick={() => navigate('transporter-requests')}
          className="px-4 py-2 rounded-md border border-[#E5EAE5] bg-white hover:bg-[#F8FAF7] text-xs font-semibold text-[#17251C] self-start sm:self-auto"
        >
          Browse Load Board
        </button>
      </div>

      <div className="space-y-6">
        {activeTrips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white border border-[#E5EAE5] rounded-lg p-5 sm:p-6 space-y-5"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#E5EAE5]">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-[#17251C]">
                    {trip.orderNumber}
                  </span>
                  <OrderStatusBadge status={trip.status} />
                  <span className="px-2.5 py-0.5 text-xs font-mono bg-[#F8FAF7] border border-[#E5EAE5] rounded text-[#17251C]">
                    Truck: <strong>{trip.vehiclePlate || 'KAD-482-XA'}</strong> ({trip.vehicleType})
                  </span>
                </div>
                <h2 className="text-lg font-display font-bold text-[#17251C] mt-1.5">
                  {trip.produceName} — {trip.quantityReserved} × {trip.produceUnit} (
                  {trip.estimatedWeightTonnes}t)
                </h2>
                <p className="text-xs text-[#647067] mt-0.5">
                  Route: <strong className="text-[#17251C]">{trip.pickupCommunity}, {trip.pickupState}</strong> →{' '}
                  <strong className="text-[#17251C]">{trip.deliveryCity}, {trip.deliveryState}</strong>
                </p>
              </div>

              {/* Step Action Control Box */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="px-3.5 py-2 rounded bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-mono">
                  Farm Code: <strong className="text-[#166534]">{trip.collectionCode}</strong>
                </div>

                {trip.status === 'Transporter assigned' && (
                  <button
                    onClick={() => advanceOrderStatus(trip.id, 'Collected')}
                    className="px-4 py-2.5 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-subtle"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>1. Confirm Farm Collection & Loading</span>
                  </button>
                )}

                {trip.status === 'Collected' && (
                  <button
                    onClick={() => advanceOrderStatus(trip.id, 'In transit')}
                    className="px-4 py-2.5 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-subtle"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>2. Depart Farm Gate (In Transit)</span>
                  </button>
                )}

                {trip.status === 'In transit' && (
                  <button
                    onClick={() => advanceOrderStatus(trip.id, 'Delivered')}
                    className="px-4 py-2.5 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-subtle"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>3. Mark Offloaded at Buyer Depot</span>
                  </button>
                )}

                {trip.status === 'Delivered' && (
                  <button
                    onClick={() => advanceOrderStatus(trip.id, 'Completed')}
                    className="px-4 py-2.5 rounded-md bg-[#17251C] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                    <span>Complete & Settle Haulage</span>
                  </button>
                )}
              </div>
            </div>

            {/* Full 7-Stage Journey Timeline */}
            <JourneyTimeline order={trip} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const TransporterProfileAndFleetView: React.FC = () => {
  const { fleetVehicles, toggleVehicleAvailability, addFleetVehicle } = useHarvestLink();
  const [showAddForm, setShowAddForm] = useState(false);
  const [plateNumber, setPlateNumber] = useState('KAN-814-AG');
  const [truckName, setTruckName] = useState('DAF CF85 15-Tonne Ventilated Produce Body');
  const [truckType, setTruckType] = useState<any>('15-Tonne Ventilated Produce Truck');
  const [capacityTonnes, setCapacityTonnes] = useState(15);
  const [driverName, setDriverName] = useState('Kabiru Usman');
  const [driverPhone, setDriverPhone] = useState('+234 803 612 9044');
  const [corridor, setCorridor] = useState('Kano / Kaduna → Lagos & Ogun');

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    addFleetVehicle({
      name: truckName,
      type: truckType,
      plateNumber,
      capacityTonnes,
      status: 'Available',
      currentLocation: 'Kaduna Eastern Bypass Terminal',
      primaryCorridor: corridor,
      driverName,
      driverPhone,
      ventilated: true,
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
            Carrier Profile & Fleet Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] mt-0.5">
            {CURRENT_TRANSPORTER.company}
          </h1>
          <p className="text-xs sm:text-sm text-[#647067] mt-1">
            Base Terminal: {CURRENT_TRANSPORTER.baseLocation} • On-Time Delivery Rate:{' '}
            <strong className="text-[#166534]">{CURRENT_TRANSPORTER.onTimeRate}</strong>
          </p>
        </div>

        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="px-4 py-2.5 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Additional Truck</span>
        </button>
      </div>

      {/* Add Vehicle Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateVehicle}
          className="bg-white border-2 border-[#166534] rounded-lg p-5 space-y-4 animate-fade-in"
        >
          <h2 className="text-base font-display font-bold text-[#17251C]">
            Register New Agro-Haulage Vehicle
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#17251C] mb-1">
                Nigerian Plate Number
              </label>
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E5EAE5] rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17251C] mb-1">
                Vehicle Class
              </label>
              <select
                value={truckType}
                onChange={(e) => setTruckType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5EAE5] rounded-md"
              >
                <option value="5-Tonne Ventilated Canter">5-Tonne Ventilated Canter</option>
                <option value="10-Tonne Covered Box Truck">10-Tonne Covered Box Truck</option>
                <option value="15-Tonne Ventilated Produce Truck">
                  15-Tonne Ventilated Produce Truck
                </option>
                <option value="30-Tonne Flatbed Trailer">30-Tonne Flatbed Trailer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17251C] mb-1">
                Max Payload (Metric Tonnes)
              </label>
              <input
                type="number"
                value={capacityTonnes}
                onChange={(e) => setCapacityTonnes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E5EAE5] rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#17251C] mb-1">
                Truck Make / Description
              </label>
              <input
                type="text"
                value={truckName}
                onChange={(e) => setTruckName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5EAE5] rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17251C] mb-1">
                Assigned Driver Name
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5EAE5] rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17251C] mb-1">
                Primary Interstate Corridor
              </label>
              <input
                type="text"
                value={corridor}
                onChange={(e) => setCorridor(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5EAE5] rounded-md"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded border border-[#E5EAE5] text-xs font-semibold text-[#647067]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-[#166534] text-white text-xs font-semibold"
            >
              Save Vehicle to Fleet
            </button>
          </div>
        </form>
      )}

      {/* Fleet Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fleetVehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white border border-[#E5EAE5] rounded-lg p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded bg-[#17251C] text-white font-mono text-xs font-bold">
                  {v.plateNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-medium border ${
                    v.status === 'Available'
                      ? 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]'
                      : v.status === 'On Active Route'
                      ? 'bg-blue-50 text-blue-900 border-blue-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {v.status}
                </span>
              </div>

              <h3 className="text-base font-display font-bold text-[#17251C] mt-3">{v.name}</h3>
              <p className="text-xs text-[#647067] mt-0.5">
                Class: {v.type} • Max Payload: <strong>{v.capacityTonnes} Metric Tonnes</strong>
              </p>

              <div className="mt-4 pt-3 border-t border-[#E5EAE5] space-y-1.5 text-xs text-[#647067]">
                <p>
                  <strong className="text-[#17251C]">Current Position:</strong> {v.currentLocation}
                </p>
                <p>
                  <strong className="text-[#17251C]">Primary Corridor:</strong> {v.primaryCorridor}
                </p>
                <p>
                  <strong className="text-[#17251C]">Driver:</strong> {v.driverName} ({v.driverPhone})
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5EAE5] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#166534]">
                {v.ventilated ? '✓ Ventilated Produce Body' : '✓ Heavy Grain Tarpaulin'}
              </span>
              {v.status !== 'On Active Route' && (
                <button
                  onClick={() => toggleVehicleAvailability(v.id)}
                  className="text-xs font-semibold text-[#166534] hover:underline"
                >
                  Switch to {v.status === 'Available' ? 'Maintenance' : 'Available'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TransporterHistoryView: React.FC = () => {
  const { orders } = useHarvestLink();
  const completedOrders = orders.filter((o) => ['Delivered', 'Completed'].includes(o.status));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
          Haulage Settlement Ledger
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] mt-0.5">
          Completed Deliveries ({completedOrders.length})
        </h1>
        <p className="text-xs sm:text-sm text-[#647067] mt-1">
          Verified farm-to-depot trips and settled haulage payouts.
        </p>
      </div>

      <div className="bg-white border border-[#E5EAE5] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAE5] bg-[#F8FAF7] text-[11px] font-mono uppercase tracking-wider text-[#647067]">
                <th className="py-3.5 px-5">Order & Cargo</th>
                <th className="py-3.5 px-4">Origin → Destination</th>
                <th className="py-3.5 px-4">Truck Assigned</th>
                <th className="py-3.5 px-4">Tonnage</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Haulage Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE5] text-xs">
              {completedOrders.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8FAF7]/50">
                  <td className="py-4 px-5">
                    <span className="font-mono font-bold text-[#17251C] block">
                      {item.orderNumber}
                    </span>
                    <span className="text-[#647067]">{item.produceName}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-[#17251C] block">
                      {item.pickupState} → {item.deliveryState}
                    </span>
                    <span className="text-[11px] text-[#647067]">
                      {item.pickupLga} LGA to {item.deliveryCity}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-[#17251C]">
                    {item.vehiclePlate || 'KANO-217-TR'}
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold text-[#17251C]">
                    {item.estimatedWeightTonnes}t
                  </td>
                  <td className="py-4 px-4">
                    <OrderStatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-4 px-5 text-right font-display font-extrabold text-[#166534] tabular-nums">
                    {formatNaira(item.transportCost || 540000)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
