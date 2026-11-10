import React, { useState } from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import {
  CropCategory,
  HarvestAvailabilityStatus,
} from '../../types';
import {
  NIGERIAN_STATES_LGAS,
  CROP_PHOTO_PRESETS,
  formatNaira,
  formatDateHuman,
  CURRENT_FARMER,
} from '../../data/mockData';
import { HarvestStatusBadge } from '../../components/ui/StatusBadge';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  MapPin,
  Sprout,
  Scale,
  Camera,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const STEPS = [
  { number: 1, title: 'Produce Details', subtitle: 'Crop, category & photos' },
  { number: 2, title: 'Quantity & Pricing', subtitle: 'Units, farm-gate price & minimums' },
  { number: 3, title: 'Harvest Information', subtitle: 'Expected harvest date & window' },
  { number: 4, title: 'Farm Location', subtitle: 'State, LGA & truck collection point' },
  { number: 5, title: 'Review & Publish', subtitle: 'Inspect preview & go live' },
];

const MEASUREMENT_UNITS: { label: string; weightKg: number }[] = [
  { label: '50kg Ventilated Crate', weightKg: 50 },
  { label: '100kg New Jute Bag', weightKg: 100 },
  { label: '50kg Woven Poly Bag', weightKg: 50 },
  { label: '100-Tuber Standard Heap (~350kg)', weightKg: 350 },
  { label: 'Metric Tonne (1,000kg Bulk)', weightKg: 1000 },
  { label: '20-Bunch Wholesale Lot (~280kg)', weightKg: 280 },
  { label: '40kg Perforated Jute Sack', weightKg: 40 },
];

export const CreateProduceWizard: React.FC = () => {
  const { createProduceListing, navigate } = useHarvestLink();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 1 State
  const [cropName, setCropName] = useState('Fresh Roma Plum Tomatoes (UTC Grade)');
  const [variety, setVariety] = useState('UC82B Firm-Skin Transport Variety');
  const [category, setCategory] = useState<CropCategory>('Vegetables & Perishables');
  const [qualityGrade, setQualityGrade] = useState<
    'Grade A Export' | 'Grade A Commercial' | 'Standard Processing'
  >('Grade A Commercial');
  const [description, setDescription] = useState(
    'Harvested at 80% breaker-red stage for optimal interstate transport durability. Sorted and graded at our shaded farm packhouse.'
  );
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('Tomatoes');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');

  // Step 2 State
  const [quantity, setQuantity] = useState<number>(120);
  const [unit, setUnit] = useState<string>('50kg Ventilated Crate');
  const [pricePerUnit, setPricePerUnit] = useState<number>(38500);
  const [minimumReservation, setMinimumReservation] = useState<number>(15);

  // Step 3 State
  const [expectedHarvestDate, setExpectedHarvestDate] = useState<string>('2026-11-15');
  const [availabilityEndDate, setAvailabilityEndDate] = useState<string>('2026-11-22');
  const [harvestStatus, setHarvestStatus] = useState<HarvestAvailabilityStatus>(
    'Harvesting in 3–7 Days'
  );
  const [shelfLifeWindow, setShelfLifeWindow] = useState<string>('7 Days Post-Harvest (Ventilated)');

  // Step 4 State
  const [stateLoc, setStateLoc] = useState<string>('Kaduna');
  const [lga, setLga] = useState<string>('Giwa');
  const [community, setCommunity] = useState<string>('Shika Dam Corridor');
  const [collectionPoint, setCollectionPoint] = useState<string>(
    'Shika Irrigation Gate B — Weighbridge & Shade Shed'
  );
  const [roadAccessibility, setRoadAccessibility] = useState<string>(
    'All-weather paved access 1.2km off Zaria–Sokoto Federal Highway; 10T and 15T trucks supported.'
  );

  const selectedUnitObj =
    MEASUREMENT_UNITS.find((u) => u.label === unit) || MEASUREMENT_UNITS[0];
  const totalTonnes = ((quantity * selectedUnitObj.weightKg) / 1000).toFixed(2);
  const totalLotValue = quantity * pricePerUnit;

  const activeImages = customImageUrl.trim()
    ? [customImageUrl.trim(), ...(CROP_PHOTO_PRESETS[selectedPresetKey] || CROP_PHOTO_PRESETS.Tomatoes)]
    : CROP_PHOTO_PRESETS[selectedPresetKey] || CROP_PHOTO_PRESETS.Tomatoes;

  const handleStateChange = (newState: string) => {
    setStateLoc(newState);
    const stateData = NIGERIAN_STATES_LGAS[newState];
    if (stateData) {
      setLga(stateData.lgas[0]);
      setCommunity(stateData.communities[0]);
    }
  };

  const applyQuickCropPreset = (presetKey: string) => {
    setSelectedPresetKey(presetKey);
    if (presetKey === 'Tomatoes') {
      setCropName('Fresh Roma Plum Tomatoes (UTC Grade)');
      setVariety('UC82B Firm-Skin Transport Variety');
      setCategory('Vegetables & Perishables');
      setUnit('50kg Ventilated Crate');
      setPricePerUnit(38500);
    } else if (presetKey === 'Maize') {
      setCropName('Sun-Dried Yellow Maize (12.5% Moisture)');
      setVariety('SAMMAZ-51 High-Carotene Yellow');
      setCategory('Grains & Cereals');
      setUnit('100kg New Jute Bag');
      setPricePerUnit(74000);
    } else if (presetKey === 'Yam') {
      setCropName('Benue White Pounded Yam Tubers (Pona)');
      setVariety('Dioscorea Rotundata — Large Cylindrical');
      setCategory('Tubers & Roots');
      setUnit('100-Tuber Standard Heap (~350kg)');
      setPricePerUnit(265000);
    } else if (presetKey === 'Cassava') {
      setCropName('TME 419 High-Starch Cassava Roots');
      setVariety('IITA Improved TME-419 (28% Starch)');
      setCategory('Tubers & Roots');
      setUnit('Metric Tonne (1,000kg Bulk)');
      setPricePerUnit(145000);
    } else if (presetKey === 'Plantain') {
      setCropName('Green Mature Agbagba Plantain Bunches');
      setVariety('False Horn Giant Plantain');
      setCategory('Plantain & Bananas');
      setUnit('20-Bunch Wholesale Lot (~280kg)');
      setPricePerUnit(118000);
    } else if (presetKey === 'Peppers') {
      setCropName('Highland Red Habanero Peppers (Ata Rodo)');
      setVariety('Jos Cold-Climate Pungent Red');
      setCategory('Vegetables & Perishables');
      setUnit('40kg Perforated Jute Sack');
      setPricePerUnit(52000);
    }
  };

  const validateAndContinue = () => {
    setErrorMsg(null);
    if (currentStep === 1) {
      if (!cropName.trim() || cropName.trim().length < 3) {
        setErrorMsg('Please enter a clear crop name (at least 3 characters).');
        return;
      }
      if (!description.trim() || description.trim().length < 15) {
        setErrorMsg('Please provide a brief description of harvest quality and grading.');
        return;
      }
    }
    if (currentStep === 2) {
      if (quantity <= 0) {
        setErrorMsg('Available quantity must be at least 1 unit.');
        return;
      }
      if (pricePerUnit < 500) {
        setErrorMsg('Please enter a valid farm-gate price per unit in Naira (₦).');
        return;
      }
      if (minimumReservation <= 0 || minimumReservation > quantity) {
        setErrorMsg('Minimum reservation cannot exceed the total available quantity.');
        return;
      }
    }
    if (currentStep === 3) {
      if (!expectedHarvestDate) {
        setErrorMsg('Expected harvest date is mandatory so buyers and trucks can coordinate.');
        return;
      }
    }
    if (currentStep === 4) {
      if (!collectionPoint.trim()) {
        setErrorMsg('Please specify the designated Farm Collection Point for trucks.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublish = () => {
    createProduceListing({
      cropName,
      variety,
      category,
      description,
      images: activeImages,
      quantityAvailable: quantity,
      totalQuantityListed: quantity,
      unit,
      unitWeightKg: selectedUnitObj.weightKg,
      pricePerUnit,
      minimumReservation,
      expectedHarvestDate,
      availabilityEndDate,
      harvestStatus,
      qualityGrade,
      shelfLifeWindow,
      state: stateLoc,
      lga,
      community,
      collectionPoint,
      roadAccessibility,
    });
    navigate('farmer-produce');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('farmer-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#647067] hover:text-[#17251C] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Farm Overview</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C]">
            Create Produce Listing
          </h1>
          <p className="text-xs sm:text-sm text-[#647067] mt-0.5">
            Publish an available or upcoming harvest in 5 guided steps so commercial buyers and
            transporters can reserve ahead.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-md bg-white border border-[#E5EAE5] text-xs font-mono text-[#647067] self-start sm:self-auto">
          Step <strong className="text-[#166534]">{currentStep}</strong> of 5
        </div>
      </div>

      {/* ==================== 5-STEP PROGRESS BAR ==================== */}
      <div className="bg-white border border-[#E5EAE5] rounded-lg p-4">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {STEPS.map((s) => {
            const isDone = s.number < currentStep;
            const isActive = s.number === currentStep;
            return (
              <button
                key={s.number}
                type="button"
                onClick={() => {
                  if (s.number < currentStep) setCurrentStep(s.number);
                }}
                className={`text-left p-2.5 rounded-md border transition-all ${
                  isActive
                    ? 'bg-[#F0FDF4] border-[#166534] ring-1 ring-[#166534]/20'
                    : isDone
                    ? 'bg-[#F8FAF7] border-[#BBF7D0] cursor-pointer hover:bg-[#F0FDF4]/50'
                    : 'bg-[#F8FAF7]/50 border-[#E5EAE5] opacity-70 cursor-default'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-5 h-5 rounded text-[11px] font-mono font-bold flex items-center justify-center ${
                      isActive
                        ? 'bg-[#166534] text-white'
                        : isDone
                        ? 'bg-[#22C55E] text-[#17251C]'
                        : 'bg-white border border-[#E5EAE5] text-[#647067]'
                    }`}
                  >
                    {isDone ? <Check className="w-3 h-3 stroke-[2.5]" /> : s.number}
                  </span>
                  <span className="hidden sm:inline text-[10px] font-mono text-[#647067]">
                    0{s.number}
                  </span>
                </div>
                <p className="text-xs font-display font-bold text-[#17251C] mt-2 truncate">
                  {s.title}
                </p>
                <p className="hidden md:block text-[11px] text-[#647067] truncate mt-0.5">
                  {s.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline Validation Alert */}
      {errorMsg && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-2.5 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ==================== WIZARD BODY ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns: Active Step Form */}
        <div className="lg:col-span-8 bg-white border border-[#E5EAE5] rounded-lg p-5 sm:p-7">
          {/* -------------------- STEP 1: PRODUCE DETAILS -------------------- */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-[#E5EAE5]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold">
                  Step 1 of 5 • Crop Identity
                </span>
                <h2 className="text-lg font-display font-bold text-[#17251C] mt-0.5">
                  Produce Details & Photography
                </h2>
                <p className="text-xs text-[#647067] mt-1">
                  Select a Nigerian crop template below or enter your specific crop variety and
                  photographs.
                </p>
              </div>

              {/* Quick Crop Selector Pills */}
              <div>
                <label className="block text-xs font-medium text-[#17251C] mb-2">
                  Quick-Fill Nigerian Crop Template
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(CROP_PHOTO_PRESETS).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => applyQuickCropPreset(key)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                        selectedPresetKey === key
                          ? 'bg-[#166534] text-white border-[#166534]'
                          : 'bg-[#F8FAF7] text-[#17251C] border-[#E5EAE5] hover:border-[#166534]'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                    Crop Name *
                  </label>
                  <input
                    type="text"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g., Fresh Roma Plum Tomatoes"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  />
                  <span className="text-[11px] text-[#647067] mt-1 block">
                    Include common market name (e.g. UTC Tomato, Pona Yam).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                    Commodity Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CropCategory)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  >
                    <option value="Vegetables & Perishables">Vegetables & Perishables</option>
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Tubers & Roots">Tubers & Roots</option>
                    <option value="Plantain & Bananas">Plantain & Bananas</option>
                    <option value="Legumes & Oilseeds">Legumes & Oilseeds</option>
                    <option value="Spices & Export Crops">Spices & Export Crops</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                    Seed Variety / Cultivar
                  </label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g., SAMMAZ-51 / TME-419"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                    Sorting & Quality Grade
                  </label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  >
                    <option value="Grade A Export">Grade A Export (Hand-Sorted, Uniform)</option>
                    <option value="Grade A Commercial">Grade A Commercial (Wholesale Standard)</option>
                    <option value="Standard Processing">Standard Processing (Mill / Factory Grade)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                  Harvest Description & Handling Notes *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe moisture level, sorting, crate/bag packaging, and freshness..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                />
                <span className="text-[11px] text-[#647067] mt-1 block">
                  Buyers decide faster when you mention moisture content, skin firmness, or packaging.
                </span>
              </div>

              {/* Photographs Section */}
              <div className="p-4 rounded-lg bg-[#F8FAF7] border border-[#E5EAE5]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#166534]" />
                    <span className="text-xs font-display font-bold text-[#17251C]">
                      Produce Photographs
                    </span>
                  </div>
                  <span className="text-[11px] text-[#166534] font-medium">
                    {activeImages.length} verified photos attached
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {activeImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative h-24 rounded-md overflow-hidden border border-[#E5EAE5] bg-white"
                    >
                      <img src={imgUrl} alt="Crop preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 text-[10px] font-mono bg-[#17251C]/80 text-white rounded">
                        {idx === 0 ? 'Primary Cover' : `Photo #${idx + 1}`}
                      </span>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#647067] mb-1">
                    Optional: Paste Custom Farm Photo URL
                  </label>
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5EAE5] rounded focus:outline-none focus:border-[#166534]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* -------------------- STEP 2: QUANTITY AND PRICING -------------------- */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-[#E5EAE5]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold">
                  Step 2 of 5 • Commercial Terms
                </span>
                <h2 className="text-lg font-display font-bold text-[#17251C] mt-0.5">
                  Quantity, Measurement Unit & Farm-Gate Pricing
                </h2>
                <p className="text-xs text-[#647067] mt-1">
                  Set transparent farm-gate pricing in Naira (₦). HarvestLink automatically
                  calculates total tonnage so matched trucks know what vehicle size is required.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                    Standard Measurement Unit *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  >
                    {MEASUREMENT_UNITS.map((u) => (
                      <option key={u.label} value={u.label}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-[#647067] mt-1 block">
                    Standardised unit weight: <strong>{selectedUnitObj.weightKg}kg</strong> per unit.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                    Total Available Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  />
                  <span className="text-[11px] text-[#166534] font-medium mt-1 block">
                    Equivalent to {totalTonnes} Metric Tonnes total load weight.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                    Farm-Gate Price per Unit (₦ NGN) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-mono font-bold text-[#647067]">
                      ₦
                    </span>
                    <input
                      type="number"
                      min={500}
                      step={500}
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-8 pr-3.5 py-2.5 text-sm font-mono font-bold bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                    />
                  </div>
                  <span className="text-[11px] text-[#647067] mt-1 block">
                    Price is locked upon confirmed buyer reservation.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                    Minimum Buyer Reservation (Units) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={quantity}
                    value={minimumReservation}
                    onChange={(e) => setMinimumReservation(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  />
                  <span className="text-[11px] text-[#647067] mt-1 block">
                    Minimum order value: {formatNaira(minimumReservation * pricePerUnit)}
                  </span>
                </div>
              </div>

              {/* Financial Valuation Callout Box */}
              <div className="p-4 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold block">
                    Gross Lot Valuation at Farm Gate
                  </span>
                  <p className="text-xs text-[#647067] mt-0.5">
                    {quantity} × {unit} @ {formatNaira(pricePerUnit)}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-2xl font-display font-extrabold text-[#166534] tabular-nums">
                    {formatNaira(totalLotValue)}
                  </span>
                  <span className="text-[11px] text-[#166534] block">
                    Zero listing fee for verified growers
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- STEP 3: HARVEST INFORMATION -------------------- */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-[#E5EAE5]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold">
                  Step 3 of 5 • Harvest Readiness & Timing
                </span>
                <h2 className="text-lg font-display font-bold text-[#17251C] mt-0.5">
                  Expected Harvest Date & Availability Window
                </h2>
                <p className="text-xs text-[#647067] mt-1">
                  Listing your harvest 3–14 days in advance allows buyers to reserve and trucks to
                  arrive on the exact morning of harvest—preventing roadside spoilage.
                </p>
              </div>

              {/* PROMINENT EXPECTED HARVEST DATE CALLOUT */}
              <div className="p-5 rounded-lg bg-[#F0FDF4] border-2 border-[#166534] shadow-subtle">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md bg-[#166534] text-white flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-sm font-display font-bold text-[#17251C]">
                        Expected Harvest / Collection Start Date *
                      </label>
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#166534] text-white rounded">
                        Critical Logistics Anchor
                      </span>
                    </div>
                    <p className="text-xs text-[#647067] mt-1">
                      This date is displayed prominently on marketplace cards and used to dispatch
                      haulage trucks on time.
                    </p>
                    <div className="mt-3 max-w-xs">
                      <input
                        type="date"
                        value={expectedHarvestDate}
                        onChange={(e) => setExpectedHarvestDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm font-mono font-bold bg-white border border-[#166534] rounded-md text-[#17251C] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                    Current Harvest Status *
                  </label>
                  <select
                    value={harvestStatus}
                    onChange={(e) =>
                      setHarvestStatus(e.target.value as HarvestAvailabilityStatus)
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  >
                    <option value="Ready for Immediate Collection">
                      Ready for Immediate Collection (Harvested / Staged)
                    </option>
                    <option value="Harvesting in 3–7 Days">
                      Harvesting in 3–7 Days (Active Field Maturity)
                    </option>
                    <option value="Scheduled Pre-Harvest">
                      Scheduled Pre-Harvest (Forward Booking)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                    Final Collection Cutoff Date
                  </label>
                  <input
                    type="date"
                    value={availabilityEndDate}
                    onChange={(e) => setAvailabilityEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  />
                  <span className="text-[11px] text-[#647067] mt-1 block">
                    Last date before lot requires cold storage or secondary processing.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                  Ambient Shelf-Life & Post-Harvest Window
                </label>
                <input
                  type="text"
                  value={shelfLifeWindow}
                  onChange={(e) => setShelfLifeWindow(e.target.value)}
                  placeholder="e.g., 7 Days Post-Harvest (Ventilated Crates)"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                />
              </div>
            </div>
          )}

          {/* -------------------- STEP 4: FARM LOCATION -------------------- */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-[#E5EAE5]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold">
                  Step 4 of 5 • Origin & Truck Access
                </span>
                <h2 className="text-lg font-display font-bold text-[#17251C] mt-0.5">
                  Farm Location & Designated Collection Point
                </h2>
                <p className="text-xs text-[#647067] mt-1">
                  Provide accurate LGA, community, and loading bay instructions so transporters can
                  plan route clearance and vehicle size.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                    State *
                  </label>
                  <select
                    value={stateLoc}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  >
                    {Object.keys(NIGERIAN_STATES_LGAS).map((st) => (
                      <option key={st} value={st}>
                        {st} State
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                    Local Government Area (LGA) *
                  </label>
                  <select
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  >
                    {(NIGERIAN_STATES_LGAS[stateLoc]?.lgas || [lga]).map((item) => (
                      <option key={item} value={item}>
                        {item} LGA
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                    Farming Community / Hub *
                  </label>
                  <input
                    type="text"
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                  Designated Collection Point / Weighbridge Landmark *
                </label>
                <input
                  type="text"
                  value={collectionPoint}
                  onChange={(e) => setCollectionPoint(e.target.value)}
                  placeholder="e.g., Shika Irrigation Gate B — Co-op Shade Shed"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                />
                <span className="text-[11px] text-[#647067] mt-1 block">
                  Where the assigned haulage truck will park, inspect, and load the produce.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                  Feeder Road & Truck Accessibility Notes
                </label>
                <textarea
                  rows={2}
                  value={roadAccessibility}
                  onChange={(e) => setRoadAccessibility(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                />
              </div>
            </div>
          )}

          {/* -------------------- STEP 5: REVIEW AND PUBLISH -------------------- */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-[#E5EAE5]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold">
                  Step 5 of 5 • Final Verification
                </span>
                <h2 className="text-lg font-display font-bold text-[#17251C] mt-0.5">
                  Review and Publish Produce Lot
                </h2>
                <p className="text-xs text-[#647067] mt-1">
                  Confirm all harvest dates, pricing, and collection point details before publishing
                  to commercial buyers.
                </p>
              </div>

              {/* Specification Verification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8FAF7] p-4 rounded-lg border border-[#E5EAE5]">
                <div>
                  <span className="text-[11px] text-[#647067] block">Crop & Variety</span>
                  <p className="text-sm font-display font-bold text-[#17251C] mt-0.5">{cropName}</p>
                  <span className="text-xs text-[#647067]">{variety}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#647067] block">Expected Harvest Date</span>
                  <p className="text-sm font-mono font-bold text-[#166534] mt-0.5">
                    {formatDateHuman(expectedHarvestDate)} ({harvestStatus})
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E5EAE5]">
                  <span className="text-[11px] text-[#647067] block">Quantity & Unit Price</span>
                  <p className="text-sm font-display font-bold text-[#17251C] mt-0.5 tabular-nums">
                    {quantity} × {unit} @ {formatNaira(pricePerUnit)}
                  </p>
                  <span className="text-xs text-[#647067]">
                    Min. reservation: {minimumReservation} units • Gross: {formatNaira(totalLotValue)}
                  </span>
                </div>
                <div className="pt-3 border-t border-[#E5EAE5]">
                  <span className="text-[11px] text-[#647067] block">Farm Collection Point</span>
                  <p className="text-sm font-display font-bold text-[#17251C] mt-0.5">
                    {community}, {lga} LGA, {stateLoc}
                  </p>
                  <span className="text-xs text-[#647067]">{collectionPoint}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" />
                <div className="text-xs text-[#17251C] leading-relaxed">
                  <strong>HarvestLink Grower Guarantee:</strong> Once published, commercial buyers
                  can reserve up to {quantity} units. You retain full control to confirm or decline
                  every reservation before a truck is dispatched to {collectionPoint}.
                </div>
              </div>
            </div>
          )}

          {/* Step Navigation Footer */}
          <div className="mt-8 pt-5 border-t border-[#E5EAE5] flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2.5 rounded-md border border-[#E5EAE5] bg-white hover:bg-[#F8FAF7] text-xs font-semibold text-[#17251C] inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={validateAndContinue}
                className="px-5 py-2.5 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-subtle"
              >
                <span>Continue to {STEPS[currentStep].title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                className="px-6 py-3 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-elevated"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish Produce Lot to Marketplace</span>
              </button>
            )}
          </div>
        </div>

        {/* Right 4 Columns: Live Marketplace Card Preview */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E5EAE5] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#E5EAE5]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#166534] font-semibold">
                Live Buyer Preview
              </span>
              <span className="text-[11px] text-[#647067]">Updates as you type</span>
            </div>

            {/* Live Card Preview */}
            <div className="border border-[#E5EAE5] rounded-lg overflow-hidden bg-white">
              <div className="relative h-44 bg-[#F8FAF7] border-b border-[#E5EAE5]">
                <img
                  src={activeImages[0]}
                  alt={cropName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17251C]/70 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-2.5">
                  <HarvestStatusBadge status={harvestStatus} compact />
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#22C55E]" />
                    {community}, {stateLoc}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-[#17251C] font-mono text-[10px] font-bold">
                    {totalTonnes}t
                  </span>
                </div>
              </div>

              <div className="p-4">
                <span className="text-[10px] font-mono uppercase text-[#647067]">{category}</span>
                <h3 className="text-sm font-display font-bold text-[#17251C] mt-0.5">
                  {cropName || 'Untitled Crop Lot'}
                </h3>
                <p className="text-xs text-[#647067] mt-0.5">{variety}</p>

                <div className="mt-3 pt-3 border-t border-[#E5EAE5] flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-[#647067] block">Farm-Gate Price</span>
                    <span className="text-base font-display font-extrabold text-[#17251C] tabular-nums">
                      {formatNaira(pricePerUnit)}
                    </span>
                    <span className="text-[10px] text-[#647067] block">per {unit}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#647067] block">Available</span>
                    <span className="text-sm font-mono font-bold text-[#17251C]">
                      {quantity} units
                    </span>
                    <span className="text-[10px] text-[#647067] block">
                      Min: {minimumReservation}
                    </span>
                  </div>
                </div>

                <div className="mt-3 px-2.5 py-2 rounded bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-between text-xs">
                  <span className="text-[#166534] font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Expected Harvest:
                  </span>
                  <strong className="font-mono text-[#166534]">
                    {formatDateHuman(expectedHarvestDate)}
                  </strong>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E5EAE5] flex items-center justify-between text-[11px] text-[#647067]">
                  <span>{CURRENT_FARMER.farmName}</span>
                  <span className="text-[#166534] font-semibold">Verified Grower</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
