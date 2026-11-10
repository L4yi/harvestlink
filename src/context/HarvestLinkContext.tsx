import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  AppView,
  ProduceListing,
  ReservationOrder,
  FleetVehicle,
  AppNotification,
  ToastMessage,
  OrderStatus,
} from '../types';
import {
  INITIAL_PRODUCE_LISTINGS,
  INITIAL_RESERVATIONS,
  INITIAL_FLEET_VEHICLES,
  INITIAL_NOTIFICATIONS,
  CURRENT_FARMER,
  CURRENT_BUYER,
  CURRENT_TRANSPORTER,
} from '../data/mockData';

interface CreateReservationInput {
  produce: ProduceListing;
  quantity: number;
  deliveryState: string;
  deliveryCity: string;
  deliveryAddress: string;
  preferredDeliveryDate: string;
  requiresTransport: boolean;
  requiredVehicleType?: string;
  transportCost: number;
  buyerNotes?: string;
}

interface RequestTransportInput {
  orderId: string;
  deliveryState: string;
  deliveryCity: string;
  deliveryAddress: string;
  preferredDeliveryDate: string;
  requiredVehicleType: string;
  transportCost: number;
}

interface HarvestLinkContextType {
  currentRole: UserRole;
  currentView: AppView;
  isAuthenticated: boolean;
  selectedProduceId: string | null;
  selectedOrderId: string | null;
  produceListings: ProduceListing[];
  orders: ReservationOrder[];
  fleetVehicles: FleetVehicle[];
  notifications: AppNotification[];
  toasts: ToastMessage[];
  // Navigation & Role actions
  navigate: (view: AppView, opts?: { produceId?: string; orderId?: string }) => void;
  switchRole: (role: UserRole, targetView?: AppView) => void;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  // Domain workflows
  createProduceListing: (
    listing: Omit<ProduceListing, 'id' | 'lotCode' | 'farmer' | 'createdAt'>
  ) => ProduceListing;
  updateProduceQuantityOrPrice: (
    produceId: string,
    updates: Partial<Pick<ProduceListing, 'pricePerUnit' | 'quantityAvailable' | 'harvestStatus'>>
  ) => void;
  createReservation: (input: CreateReservationInput) => ReservationOrder;
  respondToReservation: (orderId: string, action: 'accept' | 'decline') => void;
  requestTransportation: (input: RequestTransportInput) => void;
  acceptDeliveryJob: (orderId: string, vehicleId: string) => void;
  advanceOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  toggleVehicleAvailability: (vehicleId: string) => void;
  addFleetVehicle: (vehicle: Omit<FleetVehicle, 'id'>) => void;
  markNotificationsRead: () => void;
  addToast: (title: string, description?: string, variant?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  resetDemoState: () => void;
}

const HarvestLinkContext = createContext<HarvestLinkContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCE: 'hl_produce_v1',
  ORDERS: 'hl_orders_v1',
  FLEET: 'hl_fleet_v1',
  ROLE: 'hl_role_v1',
  VIEW: 'hl_view_v1',
};

export const HarvestLinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'farmer';
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW);
    return (saved as AppView) || 'landing';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [selectedProduceId, setSelectedProduceId] = useState<string | null>('prod-101');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('ord-901');

  const [produceListings, setProduceListings] = useState<ProduceListing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCE);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCE_LISTINGS;
    } catch {
      return INITIAL_PRODUCE_LISTINGS;
    }
  });

  const [orders, setOrders] = useState<ReservationOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FLEET);
      return saved ? JSON.parse(saved) : INITIAL_FLEET_VEHICLES;
    } catch {
      return INITIAL_FLEET_VEHICLES;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCE, JSON.stringify(produceListings));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(STORAGE_KEYS.FLEET, JSON.stringify(fleetVehicles));
      localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
      localStorage.setItem(STORAGE_KEYS.VIEW, currentView);
    } catch {
      // Ignore storage quota errors
    }
  }, [produceListings, orders, fleetVehicles, currentRole, currentView]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, description?: string, variant: 'success' | 'info' | 'warning' = 'success') => {
      const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => {
        dismissToast(id);
      }, 4500);
    },
    [dismissToast]
  );

  const navigate = useCallback(
    (view: AppView, opts?: { produceId?: string; orderId?: string }) => {
      if (opts?.produceId) setSelectedProduceId(opts.produceId);
      if (opts?.orderId) setSelectedOrderId(opts.orderId);
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const switchRole = useCallback(
    (role: UserRole, targetView?: AppView) => {
      setCurrentRole(role);
      setIsAuthenticated(true);
      if (targetView) {
        setCurrentView(targetView);
      } else {
        const defaultDashboard: Record<UserRole, AppView> = {
          farmer: 'farmer-dashboard',
          buyer: 'buyer-dashboard',
          transporter: 'transporter-dashboard',
        };
        setCurrentView(defaultDashboard[role]);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const loginAsRole = useCallback(
    (role: UserRole) => {
      switchRole(role);
      const roleLabels: Record<UserRole, string> = {
        farmer: 'Farmer Workspace — Danjuma & Sons Farms',
        buyer: 'Buyer Procurement — NourishGate Foods Ltd',
        transporter: 'Logistics Dispatch — Arewa–South Haulage',
      };
      addToast('Signed in to HarvestLink', roleLabels[role], 'info');
    },
    [switchRole, addToast]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const createProduceListing = useCallback(
    (listingData: Omit<ProduceListing, 'id' | 'lotCode' | 'farmer' | 'createdAt'>): ProduceListing => {
      const statePrefix = listingData.state.slice(0, 2).toUpperCase();
      const randomNum = Math.floor(10 + Math.random() * 89);
      const newListing: ProduceListing = {
        ...listingData,
        id: 'prod-' + Date.now(),
        lotCode: `HL-${statePrefix}-2611-${randomNum}`,
        farmer: CURRENT_FARMER,
        createdAt: '2026-11-10',
        featured: true,
      };
      setProduceListings((prev) => [newListing, ...prev]);
      setNotifications((prev) => [
        {
          id: 'notif-' + Date.now(),
          role: 'buyer',
          title: `New Farm Lot Listed: ${newListing.cropName}`,
          message: `${newListing.quantityAvailable} ${newListing.unit} available in ${newListing.community}, ${newListing.state}. Expected harvest: ${newListing.expectedHarvestDate}.`,
          timestamp: 'Just now',
          read: false,
          relatedProduceId: newListing.id,
        },
        ...prev,
      ]);
      addToast(
        'Produce Lot Published to Marketplace',
        `Lot ${newListing.lotCode} (${newListing.cropName}) is now live for verified buyers.`,
        'success'
      );
      return newListing;
    },
    [addToast]
  );

  const updateProduceQuantityOrPrice = useCallback(
    (
      produceId: string,
      updates: Partial<Pick<ProduceListing, 'pricePerUnit' | 'quantityAvailable' | 'harvestStatus'>>
    ) => {
      setProduceListings((prev) =>
        prev.map((item) => (item.id === produceId ? { ...item, ...updates } : item))
      );
      addToast('Produce Listing Updated', 'Your lot inventory and pricing have been saved.', 'info');
    },
    [addToast]
  );

  const createReservation = useCallback(
    (input: CreateReservationInput): ReservationOrder => {
      const subtotalAmount = input.quantity * input.produce.pricePerUnit;
      const platformFee = Math.round(subtotalAmount * 0.01);
      const totalAmount = subtotalAmount + platformFee + (input.requiresTransport ? input.transportCost : 0);
      const orderNum = 'HL-ORD-' + Math.floor(8500 + Math.random() * 1400);
      const stateCode = input.produce.state.slice(0, 2).toUpperCase();
      const collectionCode = `HL-${Math.floor(1000 + Math.random() * 8999)}-${stateCode}`;

      const newOrder: ReservationOrder = {
        id: 'ord-' + Date.now(),
        orderNumber: orderNum,
        produceId: input.produce.id,
        produceName: input.produce.cropName,
        produceVariety: input.produce.variety,
        produceImage: input.produce.images[0],
        produceUnit: input.produce.unit,
        unitWeightKg: input.produce.unitWeightKg,
        quantityReserved: input.quantity,
        pricePerUnit: input.produce.pricePerUnit,
        subtotalAmount,
        platformFee,
        transportCost: input.requiresTransport ? input.transportCost : 0,
        totalAmount,
        expectedHarvestDate: input.produce.expectedHarvestDate,
        status: 'Pending',
        createdAt: '2026-11-10 11:05',
        farmerId: input.produce.farmer.id,
        farmerName: input.produce.farmer.name,
        farmName: input.produce.farmer.farmName,
        farmerPhone: input.produce.farmer.phone,
        pickupState: input.produce.state,
        pickupLga: input.produce.lga,
        pickupCommunity: input.produce.community,
        collectionPoint: input.produce.collectionPoint,
        collectionCode,
        buyerId: CURRENT_BUYER.id,
        buyerName: CURRENT_BUYER.name,
        buyerOrganization: CURRENT_BUYER.organization,
        buyerPhone: CURRENT_BUYER.phone,
        deliveryState: input.deliveryState,
        deliveryCity: input.deliveryCity,
        deliveryAddress: input.deliveryAddress,
        preferredDeliveryDate: input.preferredDeliveryDate,
        buyerNotes: input.buyerNotes,
        requiresTransport: input.requiresTransport,
        requiredVehicleType: input.requiredVehicleType || '10-Tonne Covered Box Truck',
        estimatedWeightTonnes: Number(((input.quantity * input.produce.unitWeightKg) / 1000).toFixed(2)),
        estimatedDistanceKm: 540,
      };

      setOrders((prev) => [newOrder, ...prev]);
      setProduceListings((prev) =>
        prev.map((p) =>
          p.id === input.produce.id
            ? { ...p, quantityAvailable: Math.max(0, p.quantityAvailable - input.quantity) }
            : p
        )
      );

      setNotifications((prev) => [
        {
          id: 'notif-' + Date.now(),
          role: 'farmer',
          title: `Incoming Reservation: ${orderNum}`,
          message: `${CURRENT_BUYER.organization} reserved ${input.quantity} ${input.produce.unit} of ${input.produce.cropName}.`,
          timestamp: 'Just now',
          read: false,
          relatedOrderId: newOrder.id,
        },
        ...prev,
      ]);

      addToast(
        `Reservation ${orderNum} Submitted`,
        `Reserved ${input.quantity} ${input.produce.unit}. Awaiting farmer confirmation.`,
        'success'
      );

      return newOrder;
    },
    [addToast]
  );

  const respondToReservation = useCallback(
    (orderId: string, action: 'accept' | 'decline') => {
      const target = orders.find((o) => o.id === orderId);
      if (!target) return;

      if (action === 'accept') {
        const nextStatus: OrderStatus = target.requiresTransport
          ? 'Awaiting transportation'
          : 'Confirmed';

        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
        );

        addToast(
          `Order ${target.orderNumber} Confirmed`,
          target.requiresTransport
            ? 'Lot confirmed and broadcast to verified transporters for pickup.'
            : 'Buyer notified that lot is confirmed for farm-gate collection.',
          'success'
        );
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' } : o))
        );
        // Restore produce quantity
        setProduceListings((prev) =>
          prev.map((p) =>
            p.id === target.produceId
              ? { ...p, quantityAvailable: p.quantityAvailable + target.quantityReserved }
              : p
          )
        );
        addToast(
          `Order ${target.orderNumber} Declined`,
          'Reserved units have been returned to your active marketplace inventory.',
          'warning'
        );
      }
    },
    [orders, addToast]
  );

  const requestTransportation = useCallback(
    (input: RequestTransportInput) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === input.orderId
            ? {
                ...o,
                status: 'Awaiting transportation',
                requiresTransport: true,
                deliveryState: input.deliveryState,
                deliveryCity: input.deliveryCity,
                deliveryAddress: input.deliveryAddress,
                preferredDeliveryDate: input.preferredDeliveryDate,
                requiredVehicleType: input.requiredVehicleType,
                transportCost: input.transportCost,
                totalAmount: o.subtotalAmount + o.platformFee + input.transportCost,
              }
            : o
        )
      );
      addToast(
        'Haulage Request Broadcasted',
        `Dispatched to verified transporters operating the pickup corridor.`,
        'success'
      );
    },
    [addToast]
  );

  const acceptDeliveryJob = useCallback(
    (orderId: string, vehicleId: string) => {
      const vehicle = fleetVehicles.find((v) => v.id === vehicleId) || fleetVehicles[0];
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: 'Transporter assigned',
                transporterId: CURRENT_TRANSPORTER.id,
                transporterName: CURRENT_TRANSPORTER.name,
                transporterCompany: CURRENT_TRANSPORTER.company,
                transporterPhone: CURRENT_TRANSPORTER.phone,
                vehiclePlate: vehicle?.plateNumber || 'KANO-217-TR',
                vehicleType: vehicle?.type || '15-Tonne Ventilated Produce Truck',
              }
            : o
        )
      );

      if (vehicle) {
        setFleetVehicles((prev) =>
          prev.map((v) => (v.id === vehicle.id ? { ...v, status: 'On Active Route' } : v))
        );
      }

      addToast(
        'Haulage Contract Assigned',
        `Vehicle ${vehicle?.plateNumber} assigned. Proceed to Farm Collection Point.`,
        'success'
      );
    },
    [fleetVehicles, addToast]
  );

  const advanceOrderStatus = useCallback(
    (orderId: string, nextStatus: OrderStatus) => {
      const target = orders.find((o) => o.id === orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );

      const statusMessages: Partial<Record<OrderStatus, string>> = {
        Confirmed: 'Farmer confirmed harvest allocation.',
        'Awaiting transportation': 'Order queued on transporter load board.',
        'Transporter assigned': 'Haulage truck assigned for collection.',
        Collected: 'Produce weighed, inspected, and loaded at farm gate.',
        'In transit': 'Shipment is actively in transit along interstate corridor.',
        Delivered: 'Produce arrived and offloaded at buyer destination.',
        Completed: 'Delivery verified and escrow settlement released to farmer & transporter.',
      };

      addToast(
        `Status Updated: ${nextStatus}`,
        `${target?.orderNumber || 'Order'} — ${statusMessages[nextStatus] || 'Custody chain updated.'}`,
        'success'
      );
    },
    [orders, addToast]
  );

  const toggleVehicleAvailability = useCallback(
    (vehicleId: string) => {
      setFleetVehicles((prev) =>
        prev.map((v) => {
          if (v.id !== vehicleId) return v;
          const next =
            v.status === 'Available'
              ? 'Maintenance'
              : v.status === 'Maintenance'
              ? 'Available'
              : 'Available';
          return { ...v, status: next };
        })
      );
      addToast('Fleet Status Updated', 'Vehicle dispatch availability updated.', 'info');
    },
    [addToast]
  );

  const addFleetVehicle = useCallback(
    (vehicle: Omit<FleetVehicle, 'id'>) => {
      const newVehicle: FleetVehicle = {
        ...vehicle,
        id: 'veh-' + Date.now(),
      };
      setFleetVehicles((prev) => [newVehicle, ...prev]);
      addToast('Vehicle Added to Fleet', `${vehicle.plateNumber} (${vehicle.type}) registered.`, 'success');
    },
    [addToast]
  );

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const resetDemoState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCE);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.FLEET);
    setProduceListings(INITIAL_PRODUCE_LISTINGS);
    setOrders(INITIAL_RESERVATIONS);
    setFleetVehicles(INITIAL_FLEET_VEHICLES);
    setNotifications(INITIAL_NOTIFICATIONS);
    addToast('Demo Data Restored', 'All listings, orders, and fleet states reset to defaults.', 'info');
  }, [addToast]);

  return (
    <HarvestLinkContext.Provider
      value={{
        currentRole,
        currentView,
        isAuthenticated,
        selectedProduceId,
        selectedOrderId,
        produceListings,
        orders,
        fleetVehicles,
        notifications,
        toasts,
        navigate,
        switchRole,
        loginAsRole,
        logout,
        createProduceListing,
        updateProduceQuantityOrPrice,
        createReservation,
        respondToReservation,
        requestTransportation,
        acceptDeliveryJob,
        advanceOrderStatus,
        toggleVehicleAvailability,
        addFleetVehicle,
        markNotificationsRead,
        addToast,
        dismissToast,
        resetDemoState,
      }}
    >
      {children}
    </HarvestLinkContext.Provider>
  );
};

export const useHarvestLink = (): HarvestLinkContextType => {
  const ctx = useContext(HarvestLinkContext);
  if (!ctx) {
    throw new Error('useHarvestLink must be used within a HarvestLinkProvider');
  }
  return ctx;
};
