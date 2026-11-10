import React from 'react';
import { HarvestLinkProvider, useHarvestLink } from './context/HarvestLinkContext';
import { AppShell } from './components/layout/AppShell';
import { ToastContainer } from './components/ui/ToastContainer';
import { LandingPage } from './views/shared/LandingPage';
import { AuthAndOnboardingView } from './views/shared/AuthAndOnboardingView';
import { WorkspaceSettingsView } from './views/shared/WorkspaceSettingsView';
import { FarmerDashboard } from './views/farmer/FarmerDashboard';
import { CreateProduceWizard } from './views/farmer/CreateProduceWizard';
import {
  FarmerProduceView,
  FarmerReservationsView,
  FarmerOrderDetailView,
} from './views/farmer/FarmerProduceAndOrders';
import { BuyerDashboard } from './views/buyer/BuyerDashboard';
import { BuyerMarketplace } from './views/buyer/BuyerMarketplace';
import { ProduceDetailView } from './views/buyer/ProduceDetailView';
import {
  BuyerReservationsView,
  BuyerOrderTrackingView,
} from './views/buyer/BuyerReservationsAndTracking';
import { TransporterDashboard } from './views/transporter/TransporterDashboard';
import {
  TransporterRequestsView,
  TransporterActiveDeliveriesView,
  TransporterProfileAndFleetView,
  TransporterHistoryView,
} from './views/transporter/TransporterOperationsViews';

const AppRouter: React.FC = () => {
  const { currentView } = useHarvestLink();

  // Standalone Shared Experiences (Landing, Login, Register, Role Selection, Onboarding)
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage />
        <ToastContainer />
      </>
    );
  }

  if (
    currentView === 'login' ||
    currentView === 'register' ||
    currentView === 'role-select' ||
    currentView === 'onboarding'
  ) {
    return (
      <>
        <AuthAndOnboardingView mode={currentView} />
        <ToastContainer />
      </>
    );
  }

  // Authenticated Role-Tailored Application Shell
  return (
    <AppShell>
      {/* Farmer Application Views */}
      {currentView === 'farmer-dashboard' && <FarmerDashboard />}
      {currentView === 'farmer-create-produce' && <CreateProduceWizard />}
      {currentView === 'farmer-produce' && <FarmerProduceView />}
      {currentView === 'farmer-reservations' && <FarmerReservationsView />}
      {currentView === 'farmer-order-detail' && <FarmerOrderDetailView />}

      {/* Buyer Application Views */}
      {currentView === 'buyer-dashboard' && <BuyerDashboard />}
      {currentView === 'buyer-marketplace' && <BuyerMarketplace />}
      {currentView === 'buyer-produce-detail' && <ProduceDetailView />}
      {currentView === 'buyer-reservations' && <BuyerReservationsView />}
      {currentView === 'buyer-order-tracking' && <BuyerOrderTrackingView />}

      {/* Transporter Application Views */}
      {currentView === 'transporter-dashboard' && <TransporterDashboard />}
      {currentView === 'transporter-requests' && <TransporterRequestsView />}
      {currentView === 'transporter-active' && <TransporterActiveDeliveriesView />}
      {currentView === 'transporter-profile' && <TransporterProfileAndFleetView />}
      {currentView === 'transporter-history' && <TransporterHistoryView />}

      {/* Shared Workspace Settings */}
      {currentView === 'settings' && <WorkspaceSettingsView />}

      <ToastContainer />
    </AppShell>
  );
};

export function App() {
  return (
    <HarvestLinkProvider>
      <AppRouter />
    </HarvestLinkProvider>
  );
}

export default App;
