import React, { useState } from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import { UserRole } from '../../types';
import { NIGERIAN_STATES_LGAS } from '../../data/mockData';
import {
  ArrowLeft,
  ArrowRight,
  Sprout,
  Store,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Lock,
  Building2,
  MapPin,
} from 'lucide-react';

export const AuthAndOnboardingView: React.FC<{
  mode: 'login' | 'register' | 'role-select' | 'onboarding';
}> = ({ mode }) => {
  const { navigate, loginAsRole, currentRole, setCurrentRole } = useHarvestLink() as any;
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole || 'farmer');
  const [phoneOrEmail, setPhoneOrEmail] = useState('+234 803 482 9104');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Mallam Ibrahim Danjuma');
  const [orgName, setOrgName] = useState('Danjuma & Sons Irrigated Farms');
  const [stateLoc, setStateLoc] = useState('Kaduna');

  const roleDetails: Record<
    UserRole,
    {
      title: string;
      subtitle: string;
      icon: React.FC<{ className?: string }>;
      capabilities: string[];
      defaultOrg: string;
    }
  > = {
    farmer: {
      title: 'Farmer / Grower Cooperative',
      subtitle: 'List ready or upcoming harvests, accept reservations & coordinate farm-gate loading.',
      icon: Sprout,
      capabilities: [
        'Publish expected harvest dates before uprooting crops',
        'Receive verified commercial buyer reservations with price lock',
        'Verify assigned haulage trucks via unique Collection Codes',
      ],
      defaultOrg: 'Danjuma & Sons Irrigated Farms (Kaduna)',
    },
    buyer: {
      title: 'Commercial Buyer / Processor',
      subtitle: 'Discover verified produce lots, compare farm-gate pricing & book direct haulage.',
      icon: Store,
      capabilities: [
        'Direct procurement from verified Nigerian farm clusters',
        'Forward-reserve harvests due in 3–14 days to guarantee supply',
        'Integrated interstate truck dispatch and live custody timeline',
      ],
      defaultOrg: 'NourishGate Foods & Agro-Processing Ltd (Lagos)',
    },
    transporter: {
      title: 'Transporter / Fleet Aggregator',
      subtitle: 'Access confirmed agricultural loads, match truck tonnage & manage active corridors.',
      icon: Truck,
      capabilities: [
        'Inspect pickup LGA, collection bay road access & load weight',
        'Eliminate empty return legs across North–South trade corridors',
        'Guaranteed haulage settlement upon verified buyer offloading',
      ],
      defaultOrg: 'Arewa–South Agro Haulage Ltd (Kaduna / Lagos)',
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#17251C] flex flex-col">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-[#E5EAE5] px-4 sm:px-8 flex items-center justify-between">
        <button
          onClick={() => navigate('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#647067] hover:text-[#17251C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to HarvestLink Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#166534] flex items-center justify-center text-white font-display font-extrabold text-xs">
            HL
          </div>
          <span className="font-display font-extrabold text-sm tracking-tight">HARVESTLINK</span>
        </div>

        <div className="text-xs text-[#647067]">
          {mode === 'login' ? (
            <button
              onClick={() => navigate('role-select')}
              className="text-[#166534] font-semibold hover:underline"
            >
              Create Account
            </button>
          ) : (
            <button
              onClick={() => navigate('login')}
              className="text-[#166534] font-semibold hover:underline"
            >
              Sign In Instead
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        {/* ==================== ROLE SELECTION SCREEN ==================== */}
        {mode === 'role-select' && (
          <div className="max-w-4xl w-full bg-white border border-[#E5EAE5] rounded-xl p-6 sm:p-10 shadow-elevated animate-fade-in">
            <div className="max-w-xl">
              <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
                Step 1 of 2 • Account Architecture
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] mt-1">
                How do you participate in the agricultural supply chain?
              </h1>
              <p className="text-sm text-[#647067] mt-2">
                HarvestLink provides a dedicated workspace, navigation, and workflow tailored to
                your operational role.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {(['farmer', 'buyer', 'transporter'] as UserRole[]).map((roleKey) => {
                const info = roleDetails[roleKey];
                const Icon = info.icon;
                const isSelected = selectedRole === roleKey;
                return (
                  <div
                    key={roleKey}
                    onClick={() => setSelectedRole(roleKey)}
                    className={`p-5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#F0FDF4]/60 border-[#166534] ring-1 ring-[#166534]'
                        : 'bg-[#F8FAF7]/60 border-[#E5EAE5] hover:border-[#647067]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-9 h-9 rounded-md flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#166534] text-white'
                              : 'bg-white border border-[#E5EAE5] text-[#17251C]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#166534] bg-[#166534]' : 'border-[#647067]'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                      </div>

                      <h3 className="text-base font-display font-bold text-[#17251C] mt-4">
                        {info.title}
                      </h3>
                      <p className="text-xs text-[#647067] mt-1 leading-relaxed">{info.subtitle}</p>

                      <ul className="mt-4 pt-4 border-t border-[#E5EAE5] space-y-2">
                        {info.capabilities.map((cap, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-[#17251C]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#166534] shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-[#647067]">
                Want to explore immediately?{' '}
                <button
                  onClick={() => loginAsRole(selectedRole)}
                  className="text-[#166534] font-semibold underline"
                >
                  Launch {selectedRole} workspace with live demo data
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('register')}
                  className="px-5 py-2.5 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  <span>Continue as {selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== LOGIN SCREEN ==================== */}
        {mode === 'login' && (
          <div className="max-w-md w-full bg-white border border-[#E5EAE5] rounded-xl p-6 sm:p-8 shadow-elevated animate-fade-in">
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
                HarvestLink Secure Access
              </span>
              <h1 className="text-2xl font-display font-extrabold text-[#17251C] mt-1">
                Sign in to your workspace
              </h1>
              <p className="text-xs text-[#647067] mt-1">
                Select your role profile below or sign in with your registered Nigerian phone number.
              </p>
            </div>

            {/* Quick Role Selector for Instant Login */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                Select Active Account Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['farmer', 'buyer', 'transporter'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-2 px-3 rounded-md border text-xs font-medium capitalize transition-all ${
                      selectedRole === r
                        ? 'bg-[#F0FDF4] border-[#166534] text-[#166534] font-semibold'
                        : 'bg-[#F8FAF7] border-[#E5EAE5] text-[#647067]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#647067] mt-1.5 font-mono">
                Profile: {roleDetails[selectedRole].defaultOrg}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                loginAsRole(selectedRole);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                  Phone Number or Corporate Email
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#647067] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#17251C] mb-1.5">
                  Security Passcode / PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#647067] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Sign In to {selectedRole.toUpperCase()} Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* ==================== REGISTER / ONBOARDING SCREEN ==================== */}
        {(mode === 'register' || mode === 'onboarding') && (
          <div className="max-w-lg w-full bg-white border border-[#E5EAE5] rounded-xl p-6 sm:p-8 shadow-elevated animate-fade-in">
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
                Step 2 of 2 • Verification & Onboarding
              </span>
              <h1 className="text-2xl font-display font-extrabold text-[#17251C] mt-1">
                Complete your {selectedRole} profile
              </h1>
              <p className="text-xs text-[#647067] mt-1">
                We verify farm locations, buyer depots, and truck plates to maintain high trust.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                loginAsRole(selectedRole);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-2">
                {(['farmer', 'buyer', 'transporter'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-2 px-3 rounded-md border text-xs font-medium capitalize ${
                      selectedRole === r
                        ? 'bg-[#F0FDF4] border-[#166534] text-[#166534] font-semibold'
                        : 'bg-[#F8FAF7] border-[#E5EAE5] text-[#647067]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#17251C] mb-1">
                  Full Name / Principal Officer
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#17251C] mb-1">
                  {selectedRole === 'farmer'
                    ? 'Farm or Cooperative Name'
                    : selectedRole === 'buyer'
                    ? 'Company / Offtaker Name'
                    : 'Haulage Company / Fleet Name'}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#647067] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1">
                    Primary State of Operation
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#647067] absolute left-3 top-2.5" />
                    <select
                      value={stateLoc}
                      onChange={(e) => setStateLoc(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                    >
                      {Object.keys(NIGERIAN_STATES_LGAS).map((st) => (
                        <option key={st} value={st}>
                          {st} State
                        </option>
                      ))}
                      <option value="Lagos">Lagos State</option>
                      <option value="Abuja FCT">Abuja FCT</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#17251C] mb-1">
                    Nigerian Mobile Number
                  </label>
                  <input
                    type="text"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5EAE5] rounded-md focus:outline-none focus:border-[#166534]"
                    required
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                <p className="text-xs text-[#166534] leading-relaxed">
                  HarvestLink protects both farm gates and commercial buyers via milestone-verified
                  collection codes and weight receipts.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Complete Setup & Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
