import React, { useState, useMemo } from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import { formatNaira, formatDateHuman } from '../../data/mockData';
import { ProduceCard } from '../../components/ui/ProduceCard';
import { HarvestStatusBadge } from '../../components/ui/StatusBadge';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  MapPin,
  Calendar,
  RotateCcw,
  ArrowUpRight,
} from 'lucide-react';

export const BuyerMarketplace: React.FC = () => {
  const { produceListings, navigate } = useHarvestLink();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'harvestDate' | 'priceAsc' | 'tonnageDesc'>('harvestDate');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const categories = [
    'All',
    'Vegetables & Perishables',
    'Grains & Cereals',
    'Tubers & Roots',
    'Plantain & Bananas',
  ];

  const availableStates = useMemo(() => {
    const set = new Set(produceListings.map((p) => p.state));
    return ['All', ...Array.from(set)];
  }, [produceListings]);

  const filteredProduce = useMemo(() => {
    return produceListings
      .filter((item) => {
        const matchesQuery =
          !searchQuery.trim() ||
          item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.community.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.farmer.farmName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory;

        const matchesState = selectedState === 'All' || item.state === selectedState;

        const matchesStatus =
          selectedStatus === 'All' || item.harvestStatus === selectedStatus;

        return matchesQuery && matchesCategory && matchesState && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.pricePerUnit - b.pricePerUnit;
        if (sortBy === 'tonnageDesc')
          return (
            b.quantityAvailable * b.unitWeightKg - a.quantityAvailable * a.unitWeightKg
          );
        return (
          new Date(a.expectedHarvestDate).getTime() -
          new Date(b.expectedHarvestDate).getTime()
        );
      });
  }, [produceListings, searchQuery, selectedCategory, selectedState, selectedStatus, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedState('All');
    setSelectedStatus('All');
    setSortBy('harvestDate');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
            Direct Farm-Gate Commodity Exchange
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] mt-0.5">
            Agricultural Produce Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-[#647067] mt-1">
            Compare verified harvest lots across Nigerian farming corridors, inspect farm collection
            points, and reserve volume directly.
          </p>
        </div>

        {/* View Toggle (Cards vs Trading Table) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="inline-flex items-center bg-white border border-[#E5EAE5] rounded-md p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#166534] text-white font-semibold'
                  : 'text-[#647067] hover:text-[#17251C]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Lot Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#166534] text-white font-semibold'
                  : 'text-[#647067] hover:text-[#17251C]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Trading Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== ARCHITECTURAL FILTER & TRADING BAR ==================== */}
      <section className="bg-white border border-[#E5EAE5] rounded-lg p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#647067] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop (Tomatoes, Maize, Yam), LGA, or Farm..."
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-[#F8FAF7] border border-[#E5EAE5] rounded-md focus:bg-white focus:outline-none focus:border-[#166534]"
            />
          </div>

          {/* Origin State Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8FAF7] border border-[#E5EAE5] rounded-md focus:bg-white focus:outline-none focus:border-[#166534]"
            >
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All Origin States' : `${st} State`}
                </option>
              ))}
            </select>
          </div>

          {/* Harvest Readiness Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8FAF7] border border-[#E5EAE5] rounded-md focus:bg-white focus:outline-none focus:border-[#166534]"
            >
              <option value="All">All Harvest Windows</option>
              <option value="Ready for Immediate Collection">Ready for Immediate Collection</option>
              <option value="Harvesting in 3–7 Days">Harvesting in 3–7 Days</option>
              <option value="Scheduled Pre-Harvest">Scheduled Pre-Harvest</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8FAF7] border border-[#E5EAE5] rounded-md focus:bg-white focus:outline-none focus:border-[#166534]"
            >
              <option value="harvestDate">Sort: Earliest Harvest</option>
              <option value="priceAsc">Sort: Lowest Unit Price</option>
              <option value="tonnageDesc">Sort: Highest Volume</option>
            </select>
          </div>
        </div>

        {/* Category Pills + Active Count */}
        <div className="pt-3 border-t border-[#E5EAE5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#166534] text-white font-semibold'
                    : 'bg-[#F8FAF7] text-[#647067] hover:text-[#17251C] border border-[#E5EAE5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-[#647067]">
            <span>
              Showing <strong className="text-[#17251C]">{filteredProduce.length}</strong> verified
              produce lots
            </span>
            {(searchQuery ||
              selectedCategory !== 'All' ||
              selectedState !== 'All' ||
              selectedStatus !== 'All') && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-[#166534] font-semibold hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ==================== MARKETPLACE RESULTS ==================== */}
      {filteredProduce.length === 0 ? (
        <div className="bg-white border border-[#E5EAE5] rounded-lg p-12 text-center">
          <SlidersHorizontal className="w-8 h-8 text-[#647067] mx-auto mb-3" />
          <h2 className="text-base font-display font-bold text-[#17251C]">
            No produce lots match your current filter combination
          </h2>
          <p className="text-xs text-[#647067] mt-1 max-w-md mx-auto">
            Try clearing your search query or switching to "All Origin States" to inspect available
            harvests across Nigeria.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 rounded-md bg-[#166534] text-white text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProduce.map((produce) => (
            <ProduceCard
              key={produce.id}
              produce={produce}
              onSelect={(id) => navigate('buyer-produce-detail', { produceId: id })}
            />
          ))}
        </div>
      ) : (
        /* High-Density Commodity Trading Table View */
        <div className="bg-white border border-[#E5EAE5] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5EAE5] bg-[#F8FAF7] text-[11px] font-mono uppercase tracking-wider text-[#647067]">
                  <th className="py-3.5 px-5">Commodity & Lot</th>
                  <th className="py-3.5 px-4">Origin Hub</th>
                  <th className="py-3.5 px-4">Expected Harvest</th>
                  <th className="py-3.5 px-4">Available Volume</th>
                  <th className="py-3.5 px-4">Farm-Gate Price</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAE5] text-xs">
                {filteredProduce.map((lot) => {
                  const tonnes = ((lot.quantityAvailable * lot.unitWeightKg) / 1000).toFixed(1);
                  return (
                    <tr
                      key={lot.id}
                      onClick={() => navigate('buyer-produce-detail', { produceId: lot.id })}
                      className="hover:bg-[#F0FDF4]/40 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={lot.images[0]}
                            alt={lot.cropName}
                            className="w-11 h-11 rounded object-cover border border-[#E5EAE5] shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-[#647067]">
                                {lot.lotCode}
                              </span>
                              <HarvestStatusBadge status={lot.harvestStatus} compact />
                            </div>
                            <span className="font-display font-bold text-sm text-[#17251C] block mt-0.5">
                              {lot.cropName}
                            </span>
                            <span className="text-[11px] text-[#647067]">{lot.farmer.farmName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 font-medium text-[#17251C]">
                          <MapPin className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                          <span>
                            {lot.community}, {lot.state}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#647067] block pl-4">
                          {lot.lga} LGA
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-mono font-semibold text-[#17251C]">
                          <Calendar className="w-3.5 h-3.5 text-[#166534]" />
                          <span>{formatDateHuman(lot.expectedHarvestDate)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 tabular-nums">
                        <strong className="text-[#17251C] font-bold">
                          {lot.quantityAvailable} units
                        </strong>{' '}
                        <span className="text-[#647067]">({tonnes}t)</span>
                        <span className="text-[11px] text-[#647067] block">
                          Min: {lot.minimumReservation} × {lot.unit}
                        </span>
                      </td>
                      <td className="py-4 px-4 tabular-nums">
                        <span className="text-base font-display font-extrabold text-[#17251C] block">
                          {formatNaira(lot.pricePerUnit)}
                        </span>
                        <span className="text-[11px] text-[#647067]">per {lot.unit}</span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#166534] text-white font-semibold">
                          <span>Reserve</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
