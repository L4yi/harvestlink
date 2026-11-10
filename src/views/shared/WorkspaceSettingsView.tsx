import React, { useState } from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import { CURRENT_FARMER, CURRENT_BUYER, CURRENT_TRANSPORTER } from '../../data/mockData';
import { ShieldCheck, RotateCcw, Bell, Landmark, CheckCircle2 } from 'lucide-react';

export const WorkspaceSettingsView: React.FC = () => {
  const { currentRole, switchRole, resetDemoState, addToast } = useHarvestLink();
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [escrowAutoNotify, setEscrowAutoNotify] = useState(true);

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
          Account & Settlement Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#17251C] mt-0.5">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#647067] mt-1">
          Manage your Nigerian settlement bank details, SMS/USSD harvest alerts, and role
          configurations.
        </p>
      </div>

      {/* Role Switcher Panel */}
      <div className="bg-white border border-[#E5EAE5] rounded-lg p-5 sm:p-6">
        <h2 className="text-base font-display font-bold text-[#17251C]">
          Active HarvestLink Role Experience
        </h2>
        <p className="text-xs text-[#647067] mt-1">
          Switch roles at any time to test the complete end-to-end journey: Farmer lists produce →
          Buyer reserves → Farmer confirms → Buyer requests transport → Transporter accepts &
          delivers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <button
            onClick={() => switchRole('farmer')}
            className={`p-4 rounded-lg border text-left transition-all ${
              currentRole === 'farmer'
                ? 'bg-[#F0FDF4] border-[#166534] ring-1 ring-[#166534]'
                : 'bg-[#F8FAF7] border-[#E5EAE5]'
            }`}
          >
            <span className="text-[10px] font-mono uppercase text-[#166534] font-semibold">
              01 • Grower
            </span>
            <p className="text-sm font-display font-bold text-[#17251C] mt-1">
              {CURRENT_FARMER.name}
            </p>
            <p className="text-xs text-[#647067] mt-0.5">{CURRENT_FARMER.farmName}</p>
          </button>

          <button
            onClick={() => switchRole('buyer')}
            className={`p-4 rounded-lg border text-left transition-all ${
              currentRole === 'buyer'
                ? 'bg-[#F0FDF4] border-[#166534] ring-1 ring-[#166534]'
                : 'bg-[#F8FAF7] border-[#E5EAE5]'
            }`}
          >
            <span className="text-[10px] font-mono uppercase text-[#166534] font-semibold">
              02 • Commercial Buyer
            </span>
            <p className="text-sm font-display font-bold text-[#17251C] mt-1">
              {CURRENT_BUYER.name}
            </p>
            <p className="text-xs text-[#647067] mt-0.5">{CURRENT_BUYER.organization}</p>
          </button>

          <button
            onClick={() => switchRole('transporter')}
            className={`p-4 rounded-lg border text-left transition-all ${
              currentRole === 'transporter'
                ? 'bg-[#F0FDF4] border-[#166534] ring-1 ring-[#166534]'
                : 'bg-[#F8FAF7] border-[#E5EAE5]'
            }`}
          >
            <span className="text-[10px] font-mono uppercase text-[#166534] font-semibold">
              03 • Haulage Carrier
            </span>
            <p className="text-sm font-display font-bold text-[#17251C] mt-1">
              {CURRENT_TRANSPORTER.name}
            </p>
            <p className="text-xs text-[#647067] mt-0.5">{CURRENT_TRANSPORTER.company}</p>
          </button>
        </div>
      </div>

      {/* Nigerian Commercial Settlement Details */}
      <div className="bg-white border border-[#E5EAE5] rounded-lg p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#166534]" />
            <h2 className="text-base font-display font-bold text-[#17251C]">
              Escrow Settlement Bank Account (NGN)
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            NIP Instant Settlement Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-[#F8FAF7] border border-[#E5EAE5] text-xs">
          <div>
            <span className="text-[#647067] block">Settlement Bank</span>
            <strong className="text-[#17251C] font-display font-bold text-sm mt-0.5 block">
              Guaranty Trust Bank (GTBank)
            </strong>
          </div>
          <div>
            <span className="text-[#647067] block">NUBAN Account Number</span>
            <strong className="text-[#17251C] font-mono font-bold text-sm mt-0.5 block">
              0249184402
            </strong>
          </div>
          <div>
            <span className="text-[#647067] block">Beneficiary Name</span>
            <strong className="text-[#17251C] font-display font-bold text-sm mt-0.5 block">
              {currentRole === 'farmer'
                ? CURRENT_FARMER.farmName
                : currentRole === 'buyer'
                ? CURRENT_BUYER.organization
                : CURRENT_TRANSPORTER.company}
            </strong>
          </div>
        </div>
      </div>

      {/* Field Connectivity & SMS Preferences */}
      <div className="bg-white border border-[#E5EAE5] rounded-lg p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#166534]" />
          <h2 className="text-base font-display font-bold text-[#17251C]">
            SMS & Low-Bandwidth Field Alerts
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded bg-[#F8FAF7] border border-[#E5EAE5] cursor-pointer">
            <div>
              <strong className="text-[#17251C] block">
                SMS Dispatch & Collection Code Alerts
              </strong>
              <span className="text-[#647067]">
                Send Farm Collection Codes via SMS when internet coverage is low in rural LGAs.
              </span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#166534]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded bg-[#F8FAF7] border border-[#E5EAE5] cursor-pointer">
            <div>
              <strong className="text-[#17251C] block">
                Automated Escrow Release Notifications
              </strong>
              <span className="text-[#647067]">
                Notify principal phone number immediately upon weighbridge and delivery sign-off.
              </span>
            </div>
            <input
              type="checkbox"
              checked={escrowAutoNotify}
              onChange={(e) => setEscrowAutoNotify(e.target.checked)}
              className="w-4 h-4 accent-[#166534]"
            />
          </label>
        </div>

        <div className="pt-3 border-t border-[#E5EAE5] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={resetDemoState}
            className="px-4 py-2 rounded border border-[#E5EAE5] bg-[#F8FAF7] hover:bg-white text-xs font-semibold text-[#17251C] inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample Platform Data</span>
          </button>

          <button
            onClick={() =>
              addToast('Settings Saved', 'Your workspace preferences have been updated.', 'success')
            }
            className="px-5 py-2 rounded bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
