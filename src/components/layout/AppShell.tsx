import React, { useState } from 'react';
import { useHarvestLink } from '../../context/HarvestLinkContext';
import { AppView, UserRole } from '../../types';
import { CURRENT_FARMER, CURRENT_BUYER, CURRENT_TRANSPORTER } from '../../data/mockData';
import {
  LayoutDashboard,
  PlusCircle,
  Sprout,
  ClipboardList,
  Store,
  PackageCheck,
  Truck,
  Navigation,
  History,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  UserCheck,
  Globe,
} from 'lucide-react';

interface NavItem {
  id: AppView;
  label: string;
  shortLabel: string;
  icon: React.FC<{ className?: string }>;
  badge?: number;
  isPrimaryAction?: boolean;
}

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentRole,
    currentView,
    navigate,
    switchRole,
    orders,
    produceListings,
    notifications,
    markNotificationsRead,
    resetDemoState,
    logout,
  } = useHarvestLink();

  const [notifOpen, setNotifOpen] = useState(false);

  // Compute live role-specific counts
  const farmerPendingCount = orders.filter((o) => o.status === 'Pending').length;
  const buyerActiveCount = orders.filter(
    (o) => !['Completed', 'Cancelled'].includes(o.status)
  ).length;
  const transporterOpenJobsCount = orders.filter(
    (o) => o.status === 'Awaiting transportation'
  ).length;
  const transporterActiveTripsCount = orders.filter((o) =>
    ['Transporter assigned', 'Collected', 'In transit'].includes(o.status)
  ).length;

  const navByRole: Record<UserRole, NavItem[]> = {
    farmer: [
      {
        id: 'farmer-dashboard',
        label: 'Farm Overview',
        shortLabel: 'Overview',
        icon: LayoutDashboard,
      },
      {
        id: 'farmer-create-produce',
        label: 'List Produce Lot',
        shortLabel: 'Add Lot',
        icon: PlusCircle,
        isPrimaryAction: true,
      },
      {
        id: 'farmer-produce',
        label: 'My Produce Lots',
        shortLabel: 'My Produce',
        icon: Sprout,
        badge: produceListings.filter((p) => p.farmer.id === CURRENT_FARMER.id).length,
      },
      {
        id: 'farmer-reservations',
        label: 'Buyer Reservations',
        shortLabel: 'Orders',
        icon: ClipboardList,
        badge: farmerPendingCount > 0 ? farmerPendingCount : undefined,
      },
    ],
    buyer: [
      {
        id: 'buyer-dashboard',
        label: 'Procurement Desk',
        shortLabel: 'Desk',
        icon: LayoutDashboard,
      },
      {
        id: 'buyer-marketplace',
        label: 'Produce Marketplace',
        shortLabel: 'Market',
        icon: Store,
        badge: produceListings.length,
        isPrimaryAction: true,
      },
      {
        id: 'buyer-reservations',
        label: 'My Reservations',
        shortLabel: 'Orders',
        icon: ClipboardList,
        badge: buyerActiveCount > 0 ? buyerActiveCount : undefined,
      },
      {
        id: 'buyer-order-tracking',
        label: 'Logistics & Tracking',
        shortLabel: 'Track',
        icon: PackageCheck,
      },
    ],
    transporter: [
      {
        id: 'transporter-dashboard',
        label: 'Dispatch Overview',
        shortLabel: 'Dispatch',
        icon: LayoutDashboard,
      },
      {
        id: 'transporter-requests',
        label: 'Available Loads',
        shortLabel: 'Load Board',
        icon: Truck,
        badge: transporterOpenJobsCount > 0 ? transporterOpenJobsCount : undefined,
        isPrimaryAction: true,
      },
      {
        id: 'transporter-active',
        label: 'Active Deliveries',
        shortLabel: 'In Transit',
        icon: Navigation,
        badge: transporterActiveTripsCount > 0 ? transporterActiveTripsCount : undefined,
      },
      {
        id: 'transporter-profile',
        label: 'Fleet & Corridors',
        shortLabel: 'Fleet',
        icon: UserCheck,
      },
      {
        id: 'transporter-history',
        label: 'Completed Trips',
        shortLabel: 'History',
        icon: History,
      },
    ],
  };

  const activeNavItems = navByRole[currentRole];
  const unreadNotifs = notifications.filter(
    (n) => !n.read && (n.role === currentRole || n.role === 'all')
  );

  const profileSummary =
    currentRole === 'farmer'
      ? {
          name: CURRENT_FARMER.name,
          org: CURRENT_FARMER.farmName,
          location: `${CURRENT_FARMER.lga}, ${CURRENT_FARMER.state}`,
          roleBadge: 'Verified Grower',
        }
      : currentRole === 'buyer'
      ? {
          name: CURRENT_BUYER.name,
          org: CURRENT_BUYER.organization,
          location: `${CURRENT_BUYER.city}, ${CURRENT_BUYER.state}`,
          roleBadge: 'Commercial Buyer',
        }
      : {
          name: CURRENT_TRANSPORTER.name,
          org: CURRENT_TRANSPORTER.company,
          location: CURRENT_TRANSPORTER.baseLocation,
          roleBadge: 'Verified Carrier',
        };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#17251C] flex flex-col lg:flex-row">
      {/* ==================== DESKTOP SIDEBAR (252px) ==================== */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[252px] lg:fixed lg:inset-y-0 bg-white border-r border-[#E5EAE5] z-30 select-none">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#E5EAE5]">
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-md bg-[#166534] flex items-center justify-center text-white font-display font-extrabold text-sm tracking-tight shadow-subtle">
              HL
            </div>
            <div>
              <span className="font-display font-extrabold text-sm tracking-tight text-[#17251C] block leading-none">
                HARVESTLINK
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#647067] block mt-1">
                NG Supply Network
              </span>
            </div>
          </button>
        </div>

        {/* Interactive Role Switcher Box */}
        <div className="p-3.5 border-b border-[#E5EAE5] bg-[#F8FAF7]/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#647067] font-semibold">
              Active Workspace Role
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#166534]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              Live
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 bg-white rounded-md border border-[#E5EAE5]">
            {(['farmer', 'buyer', 'transporter'] as UserRole[]).map((r) => {
              const isSelected = currentRole === r;
              const labels: Record<UserRole, string> = {
                farmer: 'Farmer',
                buyer: 'Buyer',
                transporter: 'Haulage',
              };
              return (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`py-1.5 px-2 rounded text-[11px] font-medium transition-all ${
                    isSelected
                      ? 'bg-[#166534] text-white font-semibold shadow-subtle'
                      : 'text-[#647067] hover:text-[#17251C] hover:bg-[#F8FAF7]'
                  }`}
                >
                  {labels[r]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Role-Specific Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-[#647067]">
            {currentRole === 'farmer'
              ? 'Farm Operations'
              : currentRole === 'buyer'
              ? 'Procurement & Sourcing'
              : 'Fleet & Dispatch'}
          </div>

          {activeNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentView === item.id ||
              (item.id === 'farmer-reservations' && currentView === 'farmer-order-detail') ||
              (item.id === 'buyer-marketplace' && currentView === 'buyer-produce-detail');

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all relative ${
                  isActive
                    ? 'bg-[#F0FDF4] text-[#166534] font-semibold'
                    : 'text-[#647067] hover:text-[#17251C] hover:bg-[#F8FAF7]'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#166534] rounded-r" />
                )}
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#166534]' : 'text-[#647067]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 text-[10px] font-mono rounded ${
                      isActive
                        ? 'bg-[#166534] text-white'
                        : 'bg-[#F8FAF7] text-[#17251C] border border-[#E5EAE5]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-5 mt-5 border-t border-[#E5EAE5]">
            <div className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-[#647067]">
              Platform & Account
            </div>
            <button
              onClick={() => navigate('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                currentView === 'settings'
                  ? 'bg-[#F0FDF4] text-[#166534] font-semibold'
                  : 'text-[#647067] hover:text-[#17251C] hover:bg-[#F8FAF7]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Workspace Settings</span>
            </button>
            <button
              onClick={() => navigate('landing')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-[#647067] hover:text-[#17251C] hover:bg-[#F8FAF7] transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Public Market Index</span>
            </button>
            <button
              onClick={resetDemoState}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-[#647067] hover:text-[#17251C] hover:bg-[#F8FAF7] transition-colors"
              title="Reset sample listings and reservations"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-3.5 border-t border-[#E5EAE5] bg-[#F8FAF7]/50">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-display font-bold text-[#17251C] truncate">
                  {profileSummary.name}
                </p>
                <ShieldCheck className="w-3.5 h-3.5 text-[#166534] shrink-0" />
              </div>
              <p className="text-[11px] text-[#647067] truncate mt-0.5">{profileSummary.org}</p>
              <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-mono bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] rounded">
                {profileSummary.roleBadge}
              </span>
            </div>
            <button
              onClick={logout}
              title="Return to Landing / Sign out"
              className="p-1.5 text-[#647067] hover:text-[#17251C] hover:bg-white rounded border border-transparent hover:border-[#E5EAE5] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <div className="flex-1 lg:pl-[252px] flex flex-col min-h-screen pb-20 lg:pb-0">
        {/* Top Bar (Desktop & Mobile) */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-sm border-b border-[#E5EAE5] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Mobile Brand + Active Role Pill */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              onClick={() => navigate('landing')}
              className="w-8 h-8 rounded-md bg-[#166534] flex items-center justify-center text-white font-display font-extrabold text-xs"
            >
              HL
            </button>
            <div>
              <span className="font-display font-extrabold text-xs tracking-tight text-[#17251C] block">
                HARVESTLINK
              </span>
              <span className="text-[10px] text-[#166534] font-medium capitalize block">
                {currentRole} Portal
              </span>
            </div>
          </div>

          {/* Desktop Breadcrumb / Context Strip */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#647067]">
            <span className="font-medium text-[#17251C] capitalize">{currentRole} Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#647067]" />
            <span>{profileSummary.org}</span>
            <span className="text-[#E5EAE5]">•</span>
            <span className="font-mono text-[11px] text-[#166534] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
              {profileSummary.location}
            </span>
          </div>

          {/* Right Controls: Mobile Role Switcher, Notifications, Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Compact Role Switcher */}
            <div className="flex lg:hidden items-center bg-[#F8FAF7] p-0.5 rounded-md border border-[#E5EAE5]">
              {(['farmer', 'buyer', 'transporter'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`px-2 py-1 rounded text-[11px] font-medium capitalize ${
                    currentRole === r
                      ? 'bg-[#166534] text-white font-semibold'
                      : 'text-[#647067]'
                  }`}
                >
                  {r === 'transporter' ? 'Truck' : r}
                </button>
              ))}
            </div>

            {/* Notification Bell & Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen((prev) => !prev);
                  if (!notifOpen) markNotificationsRead();
                }}
                className="relative p-2 rounded-md border border-[#E5EAE5] bg-white hover:bg-[#F8FAF7] text-[#17251C] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#22C55E] text-[#17251C] font-mono text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E5EAE5] rounded-lg shadow-modal z-50 overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 border-b border-[#E5EAE5] flex items-center justify-between bg-[#F8FAF7]">
                    <span className="text-xs font-display font-bold text-[#17251C]">
                      Supply Chain Alerts
                    </span>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-[11px] text-[#166534] font-medium hover:underline"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E5EAE5]">
                    {notifications.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setNotifOpen(false);
                          if (item.relatedOrderId) {
                            navigate(
                              currentRole === 'farmer'
                                ? 'farmer-order-detail'
                                : currentRole === 'buyer'
                                ? 'buyer-order-tracking'
                                : 'transporter-active',
                              { orderId: item.relatedOrderId }
                            );
                          }
                        }}
                        className="p-3.5 hover:bg-[#F8FAF7] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#17251C]">{item.title}</span>
                          <span className="text-[10px] font-mono text-[#647067] shrink-0">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#647067] mt-1 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Primary Action CTA (Desktop/Tablet) */}
            {currentRole === 'farmer' && currentView !== 'farmer-create-produce' && (
              <button
                onClick={() => navigate('farmer-create-produce')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold transition-colors shadow-subtle"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Produce Lot</span>
              </button>
            )}
            {currentRole === 'buyer' && currentView !== 'buyer-marketplace' && (
              <button
                onClick={() => navigate('buyer-marketplace')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold transition-colors shadow-subtle"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Explore Marketplace</span>
              </button>
            )}
            {currentRole === 'transporter' && currentView !== 'transporter-requests' && (
              <button
                onClick={() => navigate('transporter-requests')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#166534] hover:bg-[#115029] text-white text-xs font-semibold transition-colors shadow-subtle"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>View Load Board ({transporterOpenJobsCount})</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Workspace Container */}
        <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>

      {/* ==================== MOBILE BOTTOM NAVIGATION (360px+) ==================== */}
      <nav
        aria-label="Mobile Primary Navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E5EAE5] z-30 px-1 py-1.5 flex items-center justify-around shadow-elevated"
      >
        {activeNavItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-md min-w-[68px] transition-colors relative ${
                item.isPrimaryAction && !isActive
                  ? 'text-[#166534] font-semibold'
                  : isActive
                  ? 'text-[#166534] bg-[#F0FDF4] font-semibold'
                  : 'text-[#647067]'
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[14px] h-[14px] rounded-full bg-[#166534] text-white font-mono text-[9px] flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 truncate max-w-[76px]">{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
