import React from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import { formatNaira, formatDateHuman } from '../../data/mockData';
import { ProduceCard } from '../../components/ui/ProduceCard';
import {
  ArrowRight,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
  Calendar,
  MapPin,
  CheckCircle2,
  Scale,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { produceListings, navigate, loginAsRole, switchRole } = useHarvestLink();

  const featuredLots = produceListings.slice(0, 3);

  const handleInspectProduce = (produceId: string) => {
    switchRole('buyer', 'buyer-produce-detail');
    navigate('buyer-produce-detail', { produceId });
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#17251C] flex flex-col">
      {/* Live Commodity Index Ticker Bar */}
      <div className="bg-[#17251C] text-white border-b border-[#166534]/40 text-xs py-2 px-4 overflow-x-auto">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-6 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#22C55E] font-semibold">
              NG Farm-Gate Spot Index • 10 Nov 2026
            </span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px] text-gray-300">
            <span>
              KADAWA TOMATO (50kg Crate): <strong className="text-white">₦38,500</strong>
            </span>
            <span className="text-gray-600">|</span>
            <span>
              GIWA YELLOW MAIZE (100kg Bag): <strong className="text-white">₦74,000</strong>
            </span>
            <span className="text-gray-600">|</span>
            <span>
              ZAKI-BIAM YAM (100-Tuber Heap): <strong className="text-white">₦265,000</strong>
            </span>
            <span className="text-gray-600">|</span>
            <span>
              ISEYIN CASSAVA (1 Metric Tonne): <strong className="text-white">₦145,000</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#E5EAE5]">
        <div className="max-w-[1360px] mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#166534] flex items-center justify-center text-white font-display font-extrabold text-sm tracking-tight">
              HL
            </div>
            <div>
              <span className="font-display font-extrabold text-base tracking-tight text-[#17251C] block leading-none">
                HARVESTLINK
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#647067] block mt-0.5">
                Agricultural Trade & Logistics
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#647067]">
            <button
              onClick={() => {
                switchRole('buyer', 'buyer-marketplace');
              }}
              className="hover:text-[#17251C] transition-colors"
            >
              Live Marketplace
            </button>
            <button
              onClick={() => loginAsRole('farmer')}
              className="hover:text-[#17251C] transition-colors"
            >
              For Farmers & Co-ops
            </button>
            <button
              onClick={() => loginAsRole('buyer')}
              className="hover:text-[#17251C] transition-colors"
            >
              For Commercial Buyers
            </button>
            <button
              onClick={() => loginAsRole('transporter')}
              className="hover:text-[#17251C] transition-colors"
            >
              For Haulage Fleets
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('login')}
              className="px-3.5 py-2 rounded-md border border-[#E5EAE5] bg-white hover:bg-[#F8FAF7] text-xs font-semibold text-[#17251C] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('role-select')}
              className="px-4 py-2 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ==================== EDITORIAL HERO SECTION ==================== */}
      <section className="border-b border-[#E5EAE5] bg-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Editorial Positioning & Role Entry */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs font-medium mb-6">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Connecting Farmers. Empowering Buyers. Reducing Food Waste.</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold text-[#17251C] leading-[1.12] tracking-tight">
                Direct farm-gate trade and coordinated haulage across Nigeria.
              </h1>

              <p className="text-base sm:text-lg text-[#647067] mt-5 leading-relaxed max-w-2xl">
                HarvestLink synchronises harvest schedules, commercial buyer reservations, and
                verified interstate trucks—so perishable crops move directly from farm collection
                points in Kaduna, Benue, Kano, and Oyo to processing depots without middleman loss.
              </p>

              {/* Interactive Role Launchpad */}
              <div className="mt-8 pt-6 border-t border-[#E5EAE5]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#647067] font-semibold block mb-3">
                  Enter Tailored Platform Experience:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => loginAsRole('farmer')}
                    className="group text-left p-4 rounded-lg border border-[#E5EAE5] bg-[#F8FAF7] hover:bg-white hover:border-[#166534] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-md bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#166534]">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#647067] group-hover:text-[#166534] group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-sm font-display font-bold text-[#17251C] mt-3">
                      Farmer Portal
                    </p>
                    <p className="text-xs text-[#647067] mt-0.5">
                      List harvests, confirm reservations & coordinate pickup.
                    </p>
                  </button>

                  <button
                    onClick={() => loginAsRole('buyer')}
                    className="group text-left p-4 rounded-lg border border-[#166534] bg-[#F0FDF4]/50 hover:bg-[#F0FDF4] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-md bg-[#166534] flex items-center justify-center text-white">
                        <Store className="w-4 h-4" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#166534] group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-sm font-display font-bold text-[#17251C] mt-3">
                      Buyer Marketplace
                    </p>
                    <p className="text-xs text-[#647067] mt-0.5">
                      Source verified lots, reserve ahead & book trucks.
                    </p>
                  </button>

                  <button
                    onClick={() => loginAsRole('transporter')}
                    className="group text-left p-4 rounded-lg border border-[#E5EAE5] bg-[#F8FAF7] hover:bg-white hover:border-[#166534] transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-md bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#166534]">
                        <Truck className="w-4 h-4" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#647067] group-hover:text-[#166534] group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-sm font-display font-bold text-[#17251C] mt-3">
                      Transporter Hub
                    </p>
                    <p className="text-xs text-[#647067] mt-0.5">
                      Match return-leg loads, verify tonnage & manage trips.
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Composed Agricultural Photography + Live Custody Telemetry */}
            <div className="lg:col-span-5">
              <div className="bg-[#F8FAF7] border border-[#E5EAE5] rounded-xl overflow-hidden shadow-elevated">
                <div className="relative h-64 sm:h-72 overflow-hidden border-b border-[#E5EAE5]">
                  <img
                    src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=85"
                    alt="Fresh Nigerian Roma Plum Tomatoes ready for crate loading"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17251C]/80 via-[#17251C]/20 to-transparent" />
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-[#166534] text-white text-[11px] font-medium inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      Verified Pre-Harvest Allocation
                    </span>
                    <span className="px-2.5 py-1 rounded bg-[#17251C]/85 text-white font-mono text-[11px]">
                      LOT #HL-KD-2611-01
                    </span>
                  </div>
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <p className="text-xs text-[#22C55E] font-mono uppercase tracking-wider">
                      Shika Dam Corridor • Giwa LGA, Kaduna
                    </p>
                    <h2 className="text-lg font-display font-bold mt-0.5">
                      Fresh Roma Plum Tomatoes (140 Crates Available)
                    </h2>
                  </div>
                </div>

                {/* Live Custody Specification Ledger */}
                <div className="p-5 bg-white space-y-4">
                  <div className="grid grid-cols-3 gap-3 pb-4 border-b border-[#E5EAE5]">
                    <div>
                      <span className="text-[11px] text-[#647067] block">Farm-Gate Price</span>
                      <span className="text-base font-display font-extrabold text-[#17251C] tabular-nums">
                        ₦38,500
                      </span>
                      <span className="text-[10px] text-[#647067] block">per 50kg Crate</span>
                    </div>
                    <div className="border-l border-[#E5EAE5] pl-3">
                      <span className="text-[11px] text-[#647067] block">Expected Harvest</span>
                      <span className="text-sm font-display font-bold text-[#166534] tabular-nums block mt-0.5">
                        12 Nov 2026
                      </span>
                      <span className="text-[10px] text-[#647067] block">Crated at 06:00 AM</span>
                    </div>
                    <div className="border-l border-[#E5EAE5] pl-3">
                      <span className="text-[11px] text-[#647067] block">Haulage Match</span>
                      <span className="text-sm font-display font-bold text-[#17251C] block mt-0.5">
                        5T–15T Ventilated
                      </span>
                      <span className="text-[10px] text-[#166534] font-medium block">
                        2 Trucks Nearby
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                        alt="Mallam Ibrahim Danjuma"
                        className="w-8 h-8 rounded-full object-cover border border-[#E5EAE5]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#17251C]">
                          Danjuma & Sons Irrigated Farms
                        </p>
                        <p className="text-[11px] text-[#647067]">
                          Zaria–Kadawa Agro Producers Union • 98% On-time
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInspectProduce('prod-101')}
                      className="px-3.5 py-2 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold transition-colors shrink-0"
                    >
                      Reserve Lot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Architectural Supply Metrics Strip */}
          <div className="mt-14 pt-8 border-t border-[#E5EAE5] grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <span className="text-xs text-[#647067] block">Active Farm Corridors</span>
              <p className="text-2xl font-display font-extrabold text-[#17251C] tabular-nums mt-1">
                18 States
              </p>
              <span className="text-xs text-[#166534] font-medium mt-0.5 block">
                Kaduna, Kano, Benue, Oyo, Plateau, Edo
              </span>
            </div>
            <div className="border-l border-[#E5EAE5] pl-5">
              <span className="text-xs text-[#647067] block">Post-Harvest Spoilage Reduction</span>
              <p className="text-2xl font-display font-extrabold text-[#17251C] tabular-nums mt-1">
                42% → 6.4%
              </p>
              <span className="text-xs text-[#647067] mt-0.5 block">
                Via pre-harvest truck scheduling
              </span>
            </div>
            <div className="border-l border-[#E5EAE5] pl-5">
              <span className="text-xs text-[#647067] block">Average Farm-to-Depot Transit</span>
              <p className="text-2xl font-display font-extrabold text-[#17251C] tabular-nums mt-1">
                28 Hours
              </p>
              <span className="text-xs text-[#647067] mt-0.5 block">
                Direct loading without market relays
              </span>
            </div>
            <div className="border-l border-[#E5EAE5] pl-5">
              <span className="text-xs text-[#647067] block">Verified Agro-Haulage Fleet</span>
              <p className="text-2xl font-display font-extrabold text-[#17251C] tabular-nums mt-1">
                340+ Trucks
              </p>
              <span className="text-xs text-[#166534] font-medium mt-0.5 block">
                5T Canters to 30T Grain Trailers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== LIVE MARKETPLACE PREVIEW ==================== */}
      <section className="py-14 sm:py-16 border-b border-[#E5EAE5]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
                Live Agricultural Commodity Floor
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] mt-1">
                Harvests Available for Immediate & Forward Reservation
              </h2>
            </div>
            <button
              onClick={() => switchRole('buyer', 'buyer-marketplace')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-white border border-[#E5EAE5] hover:border-[#166534] text-xs font-semibold text-[#17251C] transition-colors self-start sm:self-auto"
            >
              <span>View Full Marketplace ({produceListings.length} Lots)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#166534]" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLots.map((produce) => (
              <ProduceCard
                key={produce.id}
                produce={produce}
                onSelect={handleInspectProduce}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW HARVESTLINK WORKS (THE 7-STAGE CHAIN) ==================== */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#E5EAE5]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
              Transparent Supply Chain Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] mt-1">
              One continuous workflow from harvest schedule to warehouse offloading.
            </h2>
            <p className="text-sm text-[#647067] mt-2 leading-relaxed">
              In Nigeria, perishable crops spoil when farmers harvest without confirmed buyers or
              wait days at the roadside for haulage trucks. HarvestLink locks every link in the
              chain before collection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-[#F8FAF7] border border-[#E5EAE5] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] rounded">
                    01 • FARMER WORKFLOW
                  </span>
                  <Calendar className="w-5 h-5 text-[#166534]" />
                </div>
                <h3 className="text-lg font-display font-bold text-[#17251C]">
                  Publish Expected Harvest & Collection Point
                </h3>
                <p className="text-xs text-[#647067] mt-2 leading-relaxed">
                  Farmers list ready or upcoming harvests in 5 guided steps—specifying unit
                  weights, expected harvest date, LGA, community, and exact truck accessibility.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5EAE5]">
                <button
                  onClick={() => {
                    switchRole('farmer', 'farmer-create-produce');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#166534] hover:underline"
                >
                  <span>Try the 5-Step Produce Listing Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-[#F8FAF7] border border-[#E5EAE5] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] rounded">
                    02 • BUYER WORKFLOW
                  </span>
                  <Scale className="w-5 h-5 text-[#166534]" />
                </div>
                <h3 className="text-lg font-display font-bold text-[#17251C]">
                  Reserve Volume & Request Verified Haulage
                </h3>
                <p className="text-xs text-[#647067] mt-2 leading-relaxed">
                  Processors, supermarkets, and commodity aggregators compare farm-gate prices,
                  reserve specific quantities, and request right-sized trucks on the same screen.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5EAE5]">
                <button
                  onClick={() => loginAsRole('buyer')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#166534] hover:underline"
                >
                  <span>Open Buyer Procurement Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-[#F8FAF7] border border-[#E5EAE5] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] rounded">
                    03 • TRANSPORTER WORKFLOW
                  </span>
                  <Truck className="w-5 h-5 text-[#166534]" />
                </div>
                <h3 className="text-lg font-display font-bold text-[#17251C]">
                  Match Capacity, Verify Collection Code & Deliver
                </h3>
                <p className="text-xs text-[#647067] mt-2 leading-relaxed">
                  Transporters view confirmed loads with exact tonnage, collection bays, and route
                  payouts—updating custody milestones from farm gate to final buyer offloading.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5EAE5]">
                <button
                  onClick={() => loginAsRole('transporter')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#166534] hover:underline"
                >
                  <span>Inspect Transporter Load Board</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#17251C] text-white py-10 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#166534] flex items-center justify-center text-white font-display font-extrabold text-xs">
                HL
              </div>
              <span className="font-display font-extrabold text-sm tracking-tight">
                HARVESTLINK NIGERIA
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Connecting the people who grow food with the people who need it.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
            <button onClick={() => loginAsRole('farmer')} className="hover:text-white">
              Farmer Application
            </button>
            <span className="text-gray-600">•</span>
            <button onClick={() => loginAsRole('buyer')} className="hover:text-white">
              Buyer Application
            </button>
            <span className="text-gray-600">•</span>
            <button onClick={() => loginAsRole('transporter')} className="hover:text-white">
              Transporter Application
            </button>
            <span className="text-gray-600">•</span>
            <button onClick={() => navigate('login')} className="hover:text-white">
              Account Access
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
