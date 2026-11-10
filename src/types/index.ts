export type UserRole = 'farmer' | 'buyer' | 'transporter';

export type AppView =
  | 'landing'
  | 'login'
  | 'register'
  | 'role-select'
  | 'onboarding'
  // Farmer views
  | 'farmer-dashboard'
  | 'farmer-create-produce'
  | 'farmer-produce'
  | 'farmer-reservations'
  | 'farmer-order-detail'
  // Buyer views
  | 'buyer-dashboard'
  | 'buyer-marketplace'
  | 'buyer-produce-detail'
  | 'buyer-reservations'
  | 'buyer-order-tracking'
  // Transporter views
  | 'transporter-dashboard'
  | 'transporter-requests'
  | 'transporter-active'
  | 'transporter-history'
  | 'transporter-profile'
  // Shared settings
  | 'settings';

export type CropCategory =
  | 'Vegetables & Perishables'
  | 'Grains & Cereals'
  | 'Tubers & Roots'
  | 'Plantain & Bananas'
  | 'Legumes & Oilseeds'
  | 'Spices & Export Crops';

export type HarvestAvailabilityStatus =
  | 'Ready for Immediate Collection'
  | 'Harvesting in 3–7 Days'
  | 'Scheduled Pre-Harvest';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Awaiting transportation'
  | 'Transporter assigned'
  | 'Collected'
  | 'In transit'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export interface FarmerProfile {
  id: string;
  name: string;
  farmName: string;
  cooperative?: string;
  phone: string;
  state: string;
  lga: string;
  community: string;
  verified: boolean;
  yearsFarming: number;
  completedFulfillments: number;
  rating: number;
  avatarUrl: string;
}

export interface ProduceListing {
  id: string;
  lotCode: string;
  cropName: string;
  variety: string;
  category: CropCategory;
  description: string;
  images: string[];
  quantityAvailable: number;
  totalQuantityListed: number;
  unit: string; // e.g., "50kg Raffia Basket", "100kg Jute Bag", "Metric Tonne (1,000kg)", "100-Tuber Heap"
  unitWeightKg: number;
  pricePerUnit: number; // in NGN (₦)
  minimumReservation: number;
  expectedHarvestDate: string; // ISO or human date e.g. "2026-11-14"
  availabilityEndDate: string;
  harvestStatus: HarvestAvailabilityStatus;
  qualityGrade: 'Grade A Export' | 'Grade A Commercial' | 'Standard Processing';
  moistureContent?: string;
  shelfLifeWindow: string;
  state: string;
  lga: string;
  community: string;
  collectionPoint: string;
  roadAccessibility: string;
  farmer: FarmerProfile;
  createdAt: string;
  featured?: boolean;
}

export interface JourneyTimestamp {
  stageIndex: number; // 1 to 7
  label: string;
  description: string;
  timestamp?: string;
  actorName?: string;
  completed: boolean;
  current: boolean;
}

export interface ReservationOrder {
  id: string;
  orderNumber: string;
  produceId: string;
  produceName: string;
  produceVariety: string;
  produceImage: string;
  produceUnit: string;
  unitWeightKg: number;
  quantityReserved: number;
  pricePerUnit: number;
  subtotalAmount: number;
  platformFee: number;
  transportCost: number;
  totalAmount: number;
  expectedHarvestDate: string;
  status: OrderStatus;
  createdAt: string;
  // Farmer info
  farmerId: string;
  farmerName: string;
  farmName: string;
  farmerPhone: string;
  pickupState: string;
  pickupLga: string;
  pickupCommunity: string;
  collectionPoint: string;
  collectionCode: string;
  // Buyer info
  buyerId: string;
  buyerName: string;
  buyerOrganization: string;
  buyerPhone: string;
  deliveryState: string;
  deliveryCity: string;
  deliveryAddress: string;
  preferredDeliveryDate: string;
  buyerNotes?: string;
  // Transporter / Logistics info
  requiresTransport: boolean;
  requiredVehicleType?: string;
  estimatedWeightTonnes: number;
  estimatedDistanceKm?: number;
  transporterId?: string;
  transporterName?: string;
  transporterCompany?: string;
  transporterPhone?: string;
  vehiclePlate?: string;
  vehicleType?: string;
}

export interface FleetVehicle {
  id: string;
  name: string;
  type: '5-Tonne Ventilated Canter' | '10-Tonne Covered Box Truck' | '15-Tonne Ventilated Produce Truck' | '30-Tonne Flatbed Trailer' | '3-Tonne Cold-Chain Van';
  plateNumber: string;
  capacityTonnes: number;
  status: 'Available' | 'On Active Route' | 'Maintenance';
  currentLocation: string;
  primaryCorridor: string;
  driverName: string;
  driverPhone: string;
  ventilated: boolean;
}

export interface AppNotification {
  id: string;
  role: UserRole | 'all';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedOrderId?: string;
  relatedProduceId?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'warning';
}
