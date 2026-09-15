export interface SubTimelineStep {
  title: string;
  date?: string;
  completed?: boolean;
}

export interface TimelineStep {
  id: string;
  title: string;
  location: string;
  date?: string;
  icon: 'created' | 'transit' | 'received';
  statusColor: 'yellow' | 'orange' | 'green' | 'gray';
  isCollapsible?: boolean;
  isExpanded?: boolean;
  subSteps?: SubTimelineStep[];
  completed?: boolean;
  active?: boolean;
  signature?: string;
}

export interface PackageDetail {
  id: string;
  trackingNumber: string;
  status: 'On the way' | 'Completed' | 'Pending';
  statusColor: 'orange' | 'green' | 'gray';
  createdDate: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  recipientName?: string;
  parcelData: {
    weight: string;
    dimensions: string;
    category: string;
    sender: string;
    destination: string;
  };
  timeline: TimelineStep[];
  payment: {
    shipmentCost: number;
    insurance: number;
    vat?: number;
    total: number;
    currency: string;
    isPaid: boolean;
    method?: string;
    paidDate?: string;
  };
}

export interface RecentShipmentItem {
  id: string;
  trackingNumber: string;
  status: 'On the way' | 'Completed' | 'Pending';
  statusColor: 'orange' | 'green' | 'gray';
  origin?: string;
  destination?: string;
  date?: string;
  category?: string;
}

export interface MobileUserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: string;
  memberId: string;
  membershipId?: string;
  date: string;
  memberSince?: string;
  coins: number;
  walletBalance: number;
  activeShipments: number;
  completedShipments: number;
  totalShipments?: number;
  avatar?: any;
  address?: string;
  rating?: number;
}

export const initialUser: MobileUserProfile = {
  id: 'usr-ng-101',
  name: 'Elisha Adamu',
  email: 'elisha.adamu@swiftlogistics.ng',
  phone: '+234 803 456 7890',
  tier: 'Gold Priority Member',
  memberId: 'NG-7842-8920',
  date: '17 Jan, 2024',
  coins: 872,
  walletBalance: 45800,
  activeShipments: 1,
  completedShipments: 14,
};

export const sampleShipments: RecentShipmentItem[] = [
  {
    id: 'ship-1',
    trackingNumber: 'SW-LAG-9428',
    status: 'On the way',
    statusColor: 'orange',
    origin: 'Ikeja Sorting Center, Lagos',
    destination: 'Admiralty Way, Lekki Phase 1, Lagos',
    date: '15 Jan 2025',
    category: 'Priority Express Delivery',
  },
  {
    id: 'ship-2',
    trackingNumber: 'SW-ABJ-1530',
    status: 'Completed',
    statusColor: 'green',
    origin: 'Wuse II Central Hub, Abuja',
    destination: 'Maitama District, Abuja FCT',
    date: '14 Jan 2025',
    category: 'Fragile Electronics & Hardware',
  },
  {
    id: 'ship-3',
    trackingNumber: 'SW-PHC-8821',
    status: 'Completed',
    statusColor: 'green',
    origin: 'Trans-Amadi Industrial Layout, Port Harcourt',
    destination: 'GRA Phase 2, Port Harcourt, Rivers',
    date: '10 Jan 2025',
    category: 'Confidential Legal Documents',
  },
  {
    id: 'ship-4',
    trackingNumber: 'SW-KAN-3210',
    status: 'Pending',
    statusColor: 'gray',
    origin: 'Bompai Industrial Estate, Kano',
    destination: 'Bodija Estate, Ibadan, Oyo',
    date: '18 Jan 2025',
    category: 'Interstate Ground Freight',
  },
];

export const packagesData: Record<string, PackageDetail> = {
  'ship-1': {
    id: 'ship-1',
    trackingNumber: 'SW-LAG-9428',
    status: 'On the way',
    statusColor: 'orange',
    createdDate: '15 Jan 2025',
    estimatedDelivery: 'Today, by 16:30',
    recipientName: 'Elisha Adamu',
    parcelData: {
      weight: '2.4 kg',
      dimensions: '30 × 22 × 14 cm',
      category: 'Priority Express Delivery',
      sender: 'Computer Village Express Hub, Ikeja, Lagos',
      destination: 'Block B, Plot 14 Admiralty Way, Lekki Phase 1, Lagos',
    },
    timeline: [
      {
        id: 'step-created',
        title: 'Shipment Registered',
        location: 'IKEJA COMPUTER VILLAGE HUB, LAGOS',
        date: '15 Jan 2025, 08:30 AM',
        icon: 'created',
        statusColor: 'yellow',
        completed: true,
      },
      {
        id: 'step-transit',
        title: 'On the way',
        location: 'CROSSING THIRD MAINLAND BRIDGE → LEKKI TOLL',
        date: 'Current Live GPS Location',
        icon: 'transit',
        statusColor: 'orange',
        isCollapsible: true,
        isExpanded: true,
        active: true,
        subSteps: [
          { title: 'Package inspected and barcoded at Ikeja Depot', date: '15 Jan 2025, 09:15 AM', completed: true },
          { title: 'Dispatched to Oshodi Central Sorting Station', date: '15 Jan 2025, 11:20 AM', completed: true },
          { title: 'Cleared automated conveyor inspection', date: '15 Jan 2025, 01:10 PM', completed: true },
          { title: 'Loaded onto courier delivery motorcycle #LAG-882', date: '15 Jan 2025, 02:40 PM', completed: true },
          { title: 'Courier en route on Lekki-Epe expressway', date: 'Estimated 04:30 PM', completed: false },
        ],
      },
      {
        id: 'step-received',
        title: 'Handover & Delivery',
        location: 'PLOT 14 ADMIRALTY WAY, LEKKI PHASE 1, LAGOS',
        icon: 'received',
        statusColor: 'gray',
        isCollapsible: true,
        isExpanded: false,
        completed: false,
      },
    ],
    payment: {
      shipmentCost: 22500,
      insurance: 2000,
      vat: 1837.5,
      total: 26337.5,
      currency: '₦',
      isPaid: false,
    },
  },

  'ship-2': {
    id: 'ship-2',
    trackingNumber: 'SW-ABJ-1530',
    status: 'Completed',
    statusColor: 'green',
    createdDate: '12 Jan 2025',
    deliveredDate: '14 Jan 2025, 02:28 PM',
    recipientName: 'Elisha Adamu',
    parcelData: {
      weight: '1.8 kg',
      dimensions: '24 × 18 × 10 cm',
      category: 'Fragile Electronics & Hardware (Sealed)',
      sender: 'Wuse II Distribution Hub, Aminu Kano Cres, Abuja',
      destination: 'Maitama District, Abuja FCT',
    },
    timeline: [
      {
        id: 'step-created',
        title: 'Created & Manifest Approved',
        location: 'WUSE II CENTRAL HUB, ABUJA',
        date: '12 Jan 2025, 09:00 AM',
        icon: 'created',
        statusColor: 'green',
        completed: true,
      },
      {
        id: 'step-transit',
        title: 'In Transit',
        location: 'CENTRAL BUSINESS DISTRICT → MAITAMA',
        date: '13 Jan 2025',
        icon: 'transit',
        statusColor: 'green',
        isCollapsible: true,
        isExpanded: false,
        completed: true,
        subSteps: [
          { title: 'Security scan completed at Wuse II facility', date: '12 Jan 2025, 11:30 AM', completed: true },
          { title: 'Transferred to Maitama dispatch depot', date: '13 Jan 2025, 04:15 PM', completed: true },
          { title: 'Out for final doorstep delivery with dispatch rider', date: '14 Jan 2025, 10:20 AM', completed: true },
        ],
      },
      {
        id: 'step-received',
        title: 'Delivered & Handed Over',
        location: 'MAITAMA DISTRICT, ABUJA FCT',
        date: '14 Jan 2025, 02:28 PM',
        icon: 'received',
        statusColor: 'green',
        isCollapsible: true,
        isExpanded: true,
        completed: true,
        signature: 'Signed by recipient: Elisha Adamu (NIN Verified)',
        subSteps: [
          { title: 'Rider arrived at residence gate', date: '14 Jan, 02:22 PM', completed: true },
          { title: 'OTP verification confirmed (Code #5591)', date: '14 Jan, 02:26 PM', completed: true },
          { title: 'Parcel handed over to recipient', date: '14 Jan, 02:28 PM', completed: true },
        ],
      },
    ],
    payment: {
      shipmentCost: 16500,
      insurance: 1500,
      vat: 1350,
      total: 19350,
      currency: '₦',
      isPaid: true,
      method: 'Debit Card (Paystack •••• 4012)',
      paidDate: '12 Jan 2025',
    },
  },

  'ship-3': {
    id: 'ship-3',
    trackingNumber: 'SW-PHC-8821',
    status: 'Completed',
    statusColor: 'green',
    createdDate: '08 Jan 2025',
    deliveredDate: '10 Jan 2025, 11:15 AM',
    recipientName: 'Corporate Receptionist Desk',
    parcelData: {
      weight: '0.9 kg',
      dimensions: '35 × 26 × 4 cm',
      category: 'Confidential Legal Documents & Stamp',
      sender: 'Trans-Amadi Logistics Depot, Port Harcourt',
      destination: 'GRA Phase 2, Port Harcourt, Rivers State',
    },
    timeline: [
      {
        id: 'step-created',
        title: 'Dispatch Order Created',
        location: 'TRANS-AMADI CARGO TERMINAL, PHC',
        date: '08 Jan 2025, 02:15 PM',
        icon: 'created',
        statusColor: 'green',
        completed: true,
      },
      {
        id: 'step-transit',
        title: 'In Transit',
        location: 'TRANS-AMADI → GRA PHASE 2',
        date: '09 Jan 2025',
        icon: 'transit',
        statusColor: 'green',
        isCollapsible: true,
        isExpanded: false,
        completed: true,
        subSteps: [
          { title: 'Tamper-proof security seal affixed', date: '08 Jan 2025, 04:00 PM', completed: true },
          { title: 'Night transit to Port Harcourt South sorting center', date: '09 Jan 2025, 08:30 AM', completed: true },
        ],
      },
      {
        id: 'step-received',
        title: 'Delivered & Received',
        location: 'GRA PHASE 2, PORT HARCOURT',
        date: '10 Jan 2025, 11:15 AM',
        icon: 'received',
        statusColor: 'green',
        isCollapsible: true,
        isExpanded: true,
        completed: true,
        signature: 'Signed by Front Desk: Chinedu O. (ID 8841)',
        subSteps: [
          { title: 'Delivered to corporate front reception', date: '10 Jan, 11:12 AM', completed: true },
          { title: 'Receiver signature stamped & uploaded', date: '10 Jan, 11:15 AM', completed: true },
        ],
      },
    ],
    payment: {
      shipmentCost: 11000,
      insurance: 1500,
      vat: 937.5,
      total: 13437.5,
      currency: '₦',
      isPaid: true,
      method: 'Bank Transfer (Kuda Bank)',
      paidDate: '08 Jan 2025',
    },
  },

  'ship-4': {
    id: 'ship-4',
    trackingNumber: 'SW-KAN-3210',
    status: 'Pending',
    statusColor: 'gray',
    createdDate: '18 Jan 2025',
    estimatedDelivery: '21 Jan 2025',
    recipientName: 'Bodija Tech Hub Receiving',
    parcelData: {
      weight: '4.5 kg',
      dimensions: '42 × 32 × 22 cm',
      category: 'Interstate Ground Freight',
      sender: 'Bompai Industrial Estate, Kano',
      destination: 'Bodija Housing Estate, Ibadan, Oyo State',
    },
    timeline: [
      {
        id: 'step-created',
        title: 'Booking Confirmed',
        location: 'BOMPAI INDUSTRIAL ESTATE, KANO',
        date: '18 Jan 2025, 10:00 AM',
        icon: 'created',
        statusColor: 'yellow',
        completed: true,
      },
      {
        id: 'step-transit',
        title: 'Courier Collection Pending',
        location: 'Awaiting Long-Haul Freight Truck',
        date: 'Scheduled for 19 Jan, Morning',
        icon: 'transit',
        statusColor: 'gray',
        isCollapsible: true,
        isExpanded: true,
        completed: false,
        subSteps: [
          { title: 'Waybill & barcodes generated', date: '18 Jan 2025, 10:05 AM', completed: true },
          { title: 'Assigned to North-South Freight Route 6', date: '18 Jan 2025, 01:30 PM', completed: true },
          { title: 'Warehouse dispatch in progress', date: 'Pending driver pickup', completed: false },
        ],
      },
      {
        id: 'step-received',
        title: 'Final Delivery',
        location: 'BODIJA ESTATE, IBADAN, OYO',
        icon: 'received',
        statusColor: 'gray',
        completed: false,
      },
    ],
    payment: {
      shipmentCost: 18500,
      insurance: 2000,
      vat: 1537.5,
      total: 22037.5,
      currency: '₦',
      isPaid: true,
      method: 'Swift Wallet Balance',
      paidDate: '18 Jan 2025',
    },
  },
};

export const primaryPackage: PackageDetail = packagesData['ship-1'];

export function getPackageById(idOrTrackingNumber: string): PackageDetail {
  if (!idOrTrackingNumber) return packagesData['ship-1'];
  
  if (packagesData[idOrTrackingNumber]) {
    return packagesData[idOrTrackingNumber];
  }

  const found = Object.values(packagesData).find(
    (p) => p.trackingNumber.toLowerCase() === idOrTrackingNumber.trim().toLowerCase()
  );

  return found || packagesData['ship-1'];
}

export function markPackageAsPaid(idOrTrackingNumber: string, method: string = 'Paystack Instant Transfer'): PackageDetail {
  const pkg = getPackageById(idOrTrackingNumber);
  if (pkg) {
    pkg.payment.isPaid = true;
    pkg.payment.method = method;
    pkg.payment.paidDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
  return pkg;
}

// Nigerian Logistics Hubs & Smart Lockers
export interface LogisticsHub {
  id: string;
  name: string;
  type: 'hub' | 'locker' | 'express';
  typeLabel: string;
  address: string;
  state: string;
  distance: string;
  hours: string;
  isOpen: boolean;
  lockersAvailable?: number;
  phone: string;
  badgeColor: string;
}

export const sampleHubs: LogisticsHub[] = [
  {
    id: 'hub-1',
    name: 'Lekki Phase 1 24/7 Smart Locker Station',
    type: 'locker',
    typeLabel: '24/7 Contactless Smart Locker',
    address: 'Plot 14, Admiralty Way, Lekki Phase 1',
    state: 'Lagos State',
    distance: '1.2 km away',
    hours: 'Open 24/7 (Contactless QR Pickup)',
    isOpen: true,
    lockersAvailable: 18,
    phone: '+234 1 889 0421',
    badgeColor: '#22c55e',
  },
  {
    id: 'hub-2',
    name: 'Ikeja Computer Village Express Hub',
    type: 'express',
    typeLabel: 'High-Volume Priority Depot',
    address: 'Otigba St, Computer Village, Ikeja',
    state: 'Lagos State',
    distance: '3.8 km away',
    hours: '07:30 AM - 08:30 PM (Mon - Sat)',
    isOpen: true,
    lockersAvailable: 34,
    phone: '+234 1 774 9012',
    badgeColor: '#f59e0b',
  },
  {
    id: 'hub-3',
    name: 'Abuja Wuse II Central Distribution Hub',
    type: 'hub',
    typeLabel: 'Full-Service Regional Freight Terminal',
    address: 'Plot 822, Aminu Kano Crescent, Wuse II',
    state: 'Abuja FCT',
    distance: 'Interstate',
    hours: '08:00 AM - 09:00 PM (Mon - Sun)',
    isOpen: true,
    lockersAvailable: 48,
    phone: '+234 9 901 8420',
    badgeColor: '#3b82f6',
  },
  {
    id: 'hub-4',
    name: 'Victoria Island Corporate Drop-off Point',
    type: 'express',
    typeLabel: 'Corporate Express Desk',
    address: 'Adeola Odeku Street, Victoria Island',
    state: 'Lagos State',
    distance: '4.5 km away',
    hours: '08:00 AM - 07:00 PM (Mon - Fri)',
    isOpen: true,
    lockersAvailable: 12,
    phone: '+234 1 448 3920',
    badgeColor: '#22c55e',
  },
  {
    id: 'hub-5',
    name: 'Port Harcourt Trans-Amadi Cargo Terminal',
    type: 'hub',
    typeLabel: 'South-South Regional Depot',
    address: 'Plot 18, Trans-Amadi Industrial Layout',
    state: 'Rivers State',
    distance: 'Interstate',
    hours: '08:00 AM - 06:00 PM (Mon - Sat)',
    isOpen: false,
    lockersAvailable: 0,
    phone: '+234 84 920 118',
    badgeColor: '#6b7280',
  },
];

// Nigerian Logistics News & Updates
export interface LogisticsNewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  isFeatured?: boolean;
}

export const sampleNews: LogisticsNewsItem[] = [
  {
    id: 'news-1',
    title: 'Interstate Next-Day Express Expanded Across Lagos, Abuja & Port Harcourt',
    category: 'Network Expansion',
    date: '14 Jan 2025',
    readTime: '3 min read',
    isFeatured: true,
    summary: 'Guaranteed 24-hour delivery between Lagos, Abuja FCT, and Rivers State now operating 7 days a week with daily dedicated freight flights.',
    content: 'Swift Logistics Nigeria has expanded its high-speed interstate priority courier network connecting Murtala Muhammed Airport (Lagos), Nnamdi Azikiwe Airport (Abuja), and Port Harcourt International Airport. All packages deposited before 12:00 PM are guaranteed for next-morning arrival across all three commercial metropolises, supported by over 250 local dispatch bikes and vans.',
  },
  {
    id: 'news-2',
    title: 'CNG & Electric Delivery Fleet Deployed on Lagos Island & Mainland Corridors',
    category: 'Green Logistics',
    date: '12 Jan 2025',
    readTime: '2 min read',
    summary: '50 Compressed Natural Gas vans and electric cargo two-wheelers deployed to mitigate urban fuel volatility and lower client delivery tariffs.',
    content: 'In partnership with clean energy providers, our Lagos metro dispatch has initiated phase one of our eco-fleet transition. By utilizing natural gas and solar-charged electric bikes, local intra-city delivery tariffs remain permanently protected from sudden PMS fuel price swings.',
  },
  {
    id: 'news-3',
    title: 'Lekki Deep Sea Port Clearance Fully Automated on Mobile App',
    category: 'Customs & Port',
    date: '08 Jan 2025',
    readTime: '4 min read',
    summary: 'Import and export manifests at Lekki Deep Sea Port now clear customs electronically within 6 hours of ship berthing.',
    content: 'Our integrated logistics customs engine now integrates directly with the Nigeria Customs Service (NCS) single-window trade portal. Shippers can monitor container de-stuffing, pay port charges in Naira, and request immediate haulage to warehouses across Nigeria.',
  },
  {
    id: 'news-4',
    title: 'Instant QR Smart Locker Pickup Launched in Lekki, Ikeja & Abuja Wuse II',
    category: 'Innovation',
    date: '04 Jan 2025',
    readTime: '2 min read',
    summary: 'Collect deliveries 24/7 without waiting for dispatch riders by scanning your app barcode at any automated neighborhood locker.',
    content: 'No more waiting at home or arguing with dispatch riders about apartment directions. Simply select your nearest Smart Locker as your delivery point, receive an instant SMS/app notification with a dynamic QR code upon arrival, scan, and retrieve your package in 3 seconds.',
  },
];

// Service & Protection FAQs
export interface ServiceFaq {
  question: string;
  answer: string;
  category: string;
}

export const sampleFaqs: ServiceFaq[] = [
  {
    category: 'Insurance',
    question: 'What does the ₦2,000 Premium Protection Shield cover?',
    answer: 'The Premium Shield covers 100% of your parcel’s declared invoice value up to ₦2,500,000 against road transit accidents, water damage, theft, and loss across all 36 Nigerian states. Claims are verified and paid directly to your bank account within 24 hours.',
  },
  {
    category: 'Insurance',
    question: 'Is standard ground shipping automatically insured?',
    answer: 'Yes! Every intra-state and inter-state shipment booked on Swift Logistics includes automatic complimentary coverage up to ₦50,000 at zero additional charge.',
  },
  {
    category: 'Delivery',
    question: 'What happens if a dispatch rider misses me at home?',
    answer: 'Your rider will call your phone and make up to two delivery attempts on the same day. If unreachable, your package will be deposited safely at your nearest 24/7 Smart Locker for free pickup anytime within 7 days.',
  },
  {
    category: 'Tracking',
    question: 'How accurate is the live courier motorcycle GPS tracking?',
    answer: 'Our dispatch motorcycle tracking ping refreshes every 30 seconds once your order status moves to "Out for Delivery", providing you with a live delivery countdown and rider phone direct line.',
  },
];

export const savedAddresses = [
  {
    id: 'addr-1',
    label: 'Home (Lekki)',
    address: 'Plot 14 Admiralty Way, Apt 3B',
    city: 'Lekki Phase 1, Lagos State',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office (Ikeja)',
    address: 'Suite 204, Ikeja Plaza, Allen Avenue',
    city: 'Ikeja, Lagos State',
    isDefault: false,
  },
  {
    id: 'addr-3',
    label: 'Abuja Branch',
    address: 'Plot 822 Aminu Kano Crescent',
    city: 'Wuse II, Abuja FCT',
    isDefault: false,
  },
];
