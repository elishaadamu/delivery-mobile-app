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
  name: string;
  email: string;
  phone: string;
  tier: string;
  date: string;
  coins: number;
  activeShipments: number;
  completedShipments: number;
  avatar?: any;
}

export const initialUser: MobileUserProfile = {
  name: 'Stive Kate',
  email: 'stive.kate@logistics.io',
  phone: '+49 176 8920 4118',
  tier: 'Gold Priority Member',
  date: '17 Jan, 2024',
  coins: 872,
  activeShipments: 1,
  completedShipments: 14,
};

export const sampleShipments: RecentShipmentItem[] = [
  {
    id: 'ship-1',
    trackingNumber: 'A425HYJ8',
    status: 'On the way',
    statusColor: 'orange',
    origin: 'Sauerfort Logistics Center',
    destination: 'Berlin Hub 188047 Otte St.',
    date: '15 Jan 2025',
    category: 'Priority Express',
  },
  {
    id: 'ship-2',
    trackingNumber: 'C782BN91',
    status: 'Completed',
    statusColor: 'green',
    origin: 'Munich Central Depot',
    destination: 'Hamburg North Terminal',
    date: '14 Jan 2025',
    category: 'Fragile Electronics',
  },
  {
    id: 'ship-3',
    trackingNumber: 'K591DX47',
    status: 'Completed',
    statusColor: 'green',
    origin: 'Cologne Airfreight Center',
    destination: 'Frankfurt Financial District',
    date: '10 Jan 2025',
    category: 'Secure Documents',
  },
  {
    id: 'ship-4',
    trackingNumber: 'P820WE19',
    status: 'Pending',
    statusColor: 'gray',
    origin: 'Stuttgart Warehouse 4',
    destination: 'Dresden Tech Park',
    date: '18 Jan 2025',
    category: 'Eco Standard Ground',
  },
];

export const packagesData: Record<string, PackageDetail> = {
  'ship-1': {
    id: 'ship-1',
    trackingNumber: 'A425HYJ8',
    status: 'On the way',
    statusColor: 'orange',
    createdDate: '15 Jan 2025',
    estimatedDelivery: 'Tomorrow, 14:00 - 17:00',
    recipientName: 'Stive Kate',
    parcelData: {
      weight: '2.4 kg',
      dimensions: '30 × 22 × 14 cm',
      category: 'Express Priority Parcel',
      sender: 'Sauerfort Logistics Center, 67847',
      destination: 'Berlin Hub 188047 Otte St.',
    },
    timeline: [
      {
        id: 'step-created',
        title: 'Created',
        location: 'SAUERFORT, 67847 REBECA SPURS',
        date: '15 Jan 2025, 08:30 AM',
        icon: 'created',
        statusColor: 'yellow',
        completed: true,
      },
      {
        id: 'step-transit',
        title: 'On the way',
        location: 'IN TRANSIT TO BERLIN',
        date: 'Current status',
        icon: 'transit',
        statusColor: 'orange',
        isCollapsible: true,
        isExpanded: true,
        active: true,
        subSteps: [
          { title: 'Package received at Sauerfort Depot', date: '15 Jan 2025, 10:15 AM', completed: true },
          { title: 'Departed sorting facility', date: '16 Jan 2025, 04:20 AM', completed: true },
          { title: 'Cross-dock inspection cleared', date: '17 Jan 2025, 12:45 PM', completed: true },
          { title: 'Out on delivery vehicle to Berlin Otte St.', date: 'Estimated 18 Jan, 09:00 AM', completed: false },
        ],
      },
      {
        id: 'step-received',
        title: 'Received',
        location: 'BERLIN, 188047 OTTE ST.',
        icon: 'received',
        statusColor: 'gray',
        isCollapsible: true,
        isExpanded: false,
        completed: false,
      },
    ],
    payment: {
      shipmentCost: 56.30,
      insurance: 4.00,
      total: 60.30,
      currency: '$',
      isPaid: false,
    },
  },

  'ship-2': {
    id: 'ship-2',
    trackingNumber: 'C782BN91',
    status: 'Completed',
    statusColor: 'green',
    createdDate: '12 Jan 2025',
    deliveredDate: '14 Jan 2025, 02:28 PM',
    recipientName: 'Stive Kate',
    parcelData: {
      weight: '1.8 kg',
      dimensions: '24 × 18 × 10 cm',
      category: 'Fragile Electronics (Tamper Sealed)',
      sender: 'Munich Central Depot, 44021',
      destination: 'Hamburg North Terminal, 20354',
    },
    timeline: [
      {
        id: 'step-created',
        title: 'Created',
        location: 'MUNICH CENTRAL DEPOT, 44021',
        date: '12 Jan 2025, 09:00 AM',
        icon: 'created',
        statusColor: 'green',
        completed: true,
      },
      {
        id: 'step-transit',
        title: 'In Transit',
        location: 'MUNICH → HANOVER → HAMBURG',
        date: '13 Jan 2025',
        icon: 'transit',
        statusColor: 'green',
        isCollapsible: true,
        isExpanded: false,
        completed: true,
        subSteps: [
          { title: 'Electronic manifests approved', date: '12 Jan 2025, 11:30 AM', completed: true },
          { title: 'Arrived at Hanover Central sorting hub', date: '13 Jan 2025, 03:10 AM', completed: true },
          { title: 'Dispatched to Hamburg distribution center', date: '13 Jan 2025, 07:45 PM', completed: true },
          { title: 'Loaded onto courier delivery van #HB-44', date: '14 Jan 2025, 08:15 AM', completed: true },
        ],
      },
      {
        id: 'step-received',
        title: 'Delivered & Received',
        location: 'HAMBURG NORTH TERMINAL, 20354',
        date: '14 Jan 2025, 02:28 PM',
        icon: 'received',
        statusColor: 'green',
        isCollapsible: true,
        isExpanded: true,
        completed: true,
        signature: 'Signed by recipient: S. Kate (ID Verified)',
        subSteps: [
          { title: 'Courier arrival at address', date: '14 Jan, 02:25 PM', completed: true },
          { title: 'Handed directly to recipient', date: '14 Jan, 02:28 PM', completed: true },
          { title: 'Digital signature verified', date: '14 Jan, 02:28 PM', completed: true },
        ],
      },
    ],
    payment: {
      shipmentCost: 44.50,
      insurance: 4.00,
      total: 48.50,
      currency: '$',
      isPaid: true,
      method: 'Apple Pay (Card •••• 4012)',
      paidDate: '12 Jan 2025',
    },
  },

  'ship-3': {
    id: 'ship-3',
    trackingNumber: 'K591DX47',
    status: 'Completed',
    statusColor: 'green',
    createdDate: '08 Jan 2025',
    deliveredDate: '10 Jan 2025, 11:15 AM',
    recipientName: 'Financial Services Desk',
    parcelData: {
      weight: '0.9 kg',
      dimensions: '35 × 26 × 4 cm',
      category: 'Secure Legal Documents & Seals',
      sender: 'Cologne Airfreight Center, 51147',
      destination: 'Frankfurt Financial District, 60311',
    },
    timeline: [
      {
        id: 'step-created',
        title: 'Created',
        location: 'COLOGNE AIRFREIGHT CENTER, 51147',
        date: '08 Jan 2025, 02:15 PM',
        icon: 'created',
        statusColor: 'green',
        completed: true,
      },
      {
        id: 'step-transit',
        title: 'In Transit',
        location: 'COLOGNE → FRANKFURT HUB',
        date: '09 Jan 2025',
        icon: 'transit',
        statusColor: 'green',
        isCollapsible: true,
        isExpanded: false,
        completed: true,
        subSteps: [
          { title: 'High-security pouch registered', date: '08 Jan 2025, 04:00 PM', completed: true },
          { title: 'High-speed rail express transfer', date: '09 Jan 2025, 06:20 AM', completed: true },
          { title: 'Arrived Frankfurt Main distribution center', date: '09 Jan 2025, 10:45 AM', completed: true },
        ],
      },
      {
        id: 'step-received',
        title: 'Delivered & Received',
        location: 'FRANKFURT FINANCIAL DISTRICT, 60311',
        date: '10 Jan 2025, 11:15 AM',
        icon: 'received',
        statusColor: 'green',
        isCollapsible: true,
        isExpanded: true,
        completed: true,
        signature: 'Signed by Building Concierge: M. Weber',
        subSteps: [
          { title: 'Delivery to building mailroom', date: '10 Jan, 11:12 AM', completed: true },
          { title: 'Signature captured and archived', date: '10 Jan, 11:15 AM', completed: true },
        ],
      },
    ],
    payment: {
      shipmentCost: 32.00,
      insurance: 0.00,
      total: 32.00,
      currency: '$',
      isPaid: true,
      method: 'Visa •••• 8821',
      paidDate: '08 Jan 2025',
    },
  },

  'ship-4': {
    id: 'ship-4',
    trackingNumber: 'P820WE19',
    status: 'Pending',
    statusColor: 'gray',
    createdDate: '18 Jan 2025',
    estimatedDelivery: '22 Jan 2025',
    recipientName: 'Tech Park Receiving Bay B',
    parcelData: {
      weight: '3.2 kg',
      dimensions: '40 × 30 × 20 cm',
      category: 'Eco Standard Ground Shipment',
      sender: 'Stuttgart Warehouse 4, 70173',
      destination: 'Dresden Tech Park, 01069',
    },
    timeline: [
      {
        id: 'step-created',
        title: 'Order Created',
        location: 'STUTTGART WAREHOUSE 4, 70173',
        date: '18 Jan 2025, 10:00 AM',
        icon: 'created',
        statusColor: 'yellow',
        completed: true,
      },
      {
        id: 'step-transit',
        title: 'Pickup Scheduled',
        location: 'Awaiting Courier Collection',
        date: 'Scheduled for 19 Jan, Morning',
        icon: 'transit',
        statusColor: 'gray',
        isCollapsible: true,
        isExpanded: true,
        completed: false,
        subSteps: [
          { title: 'Shipping label printed & attached', date: '18 Jan 2025, 10:05 AM', completed: true },
          { title: 'Pickup dispatch assigned to Route 14', date: '18 Jan 2025, 01:30 PM', completed: true },
          { title: 'Courier pickup from origin warehouse', date: 'Pending pickup', completed: false },
        ],
      },
      {
        id: 'step-received',
        title: 'Delivery',
        location: 'DRESDEN TECH PARK, 01069',
        icon: 'received',
        statusColor: 'gray',
        completed: false,
      },
    ],
    payment: {
      shipmentCost: 28.00,
      insurance: 0.00,
      total: 28.00,
      currency: '$',
      isPaid: true,
      method: 'MasterCard •••• 9310',
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

// Logistics Hubs / Points data
export interface LogisticsHub {
  id: string;
  name: string;
  type: 'hub' | 'locker' | 'express';
  typeLabel: string;
  address: string;
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
    name: 'Alexanderplatz 24/7 Smart Locker Hub',
    type: 'locker',
    typeLabel: '24/7 Automated Locker',
    address: 'Alexanderstraße 7, 10178 Berlin',
    distance: '0.8 km',
    hours: 'Open 24/7 (Contactless QR Pickup)',
    isOpen: true,
    lockersAvailable: 16,
    phone: '+49 30 9018 200',
    badgeColor: '#22c55e',
  },
  {
    id: 'hub-2',
    name: 'Potsdamer Platz Logistics Center',
    type: 'hub',
    typeLabel: 'Full Service Distribution Hub',
    address: 'Potsdamer Str. 12, 10785 Berlin',
    distance: '2.3 km',
    hours: '08:00 - 21:00 (Mon - Sat)',
    isOpen: true,
    lockersAvailable: 42,
    phone: '+49 30 8820 441',
    badgeColor: '#3b82f6',
  },
  {
    id: 'hub-3',
    name: 'Friedrichstraße Express Drop-off Point',
    type: 'express',
    typeLabel: 'Priority Express Drop Point',
    address: 'Friedrichstraße 140, 10117 Berlin',
    distance: '3.1 km',
    hours: '07:30 - 20:00 (Mon - Fri)',
    isOpen: true,
    lockersAvailable: 8,
    phone: '+49 30 7712 903',
    badgeColor: '#f59e0b',
  },
  {
    id: 'hub-4',
    name: 'Charlottenburg West Distribution Station',
    type: 'hub',
    typeLabel: 'Regional Parcel Terminal',
    address: 'Kantstraße 54, 10627 Berlin',
    distance: '5.6 km',
    hours: '08:00 - 19:30 (Mon - Sat)',
    isOpen: false,
    lockersAvailable: 0,
    phone: '+49 30 4490 120',
    badgeColor: '#6b7280',
  },
];

// Logistics News data
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
    title: '100% Electric Delivery Fleets Deployed Across Berlin & Munich',
    category: 'Green Logistics',
    date: '14 Jan 2025',
    readTime: '3 min read',
    isFeatured: true,
    summary: 'Our zero-emission last-mile logistics initiative achieves complete electrification across two major metro regions ahead of schedule.',
    content: 'We have officially expanded our 100% electric delivery van fleet into central Berlin and Munich metropolitan zones. Over 450 purpose-built electric delivery vans and e-cargo bikes now handle all residential and commercial deliveries, eliminating over 1,200 metric tons of carbon emissions annually while maintaining guaranteed same-day delivery windows.',
  },
  {
    id: 'news-2',
    title: 'Peak Season Transit Windows Guaranteed: Zero Surcharge Guarantee',
    category: 'Service Alert',
    date: '12 Jan 2025',
    readTime: '2 min read',
    summary: 'Automated sorting sorting capacity expanded by 35% with newly deployed high-speed automated robotic sorters.',
    content: 'Thanks to automated robotic sorting upgrades at the Sauerfort and Frankfurt central hubs, all express and ground parcels will continue on guaranteed standard schedules with zero holiday peak surcharges for gold members.',
  },
  {
    id: 'news-3',
    title: 'New Cross-Border Customs Portal Simplifies European EU-UK Shipments',
    category: 'Customs & Trade',
    date: '08 Jan 2025',
    readTime: '4 min read',
    summary: 'Digital HS-code categorization and automated paperless invoicing now live inside your mobile account.',
    content: 'Shipping packages across borders is now completely paperless. Our integrated customs engine validates commercial invoices, checks recipient tax identifiers, and clears customs pre-arrival, eliminating border clearance delays.',
  },
  {
    id: 'news-4',
    title: 'Smart Locker 2.0: Instant Bluetooth & Dynamic QR Contactless Pickup',
    category: 'Innovation',
    date: '03 Jan 2025',
    readTime: '2 min read',
    summary: 'Unlock your assigned locker compartment in under 2 seconds directly from your phone.',
    content: 'No more typing 6-digit codes on sunny locker touchscreens. Simply walk within 2 meters of your locker compartment with your delivery app active, tap "Open Locker", and retrieve your package immediately.',
  },
];

// Service & Insurance Info FAQs
export interface ServiceFaq {
  question: string;
  answer: string;
  category: string;
}

export const sampleFaqs: ServiceFaq[] = [
  {
    category: 'Insurance',
    question: 'What does the $4.00 Premium Full-Value Shield cover?',
    answer: 'The Premium Shield covers 100% of your parcel’s declared value up to $2,500 against loss, water or mechanical damage, and theft in transit. Claims are expedited and resolved within 24 hours with zero deductible.',
  },
  {
    category: 'Insurance',
    question: 'Is standard ground shipping automatically insured?',
    answer: 'Yes! Every domestic and international package booked through our platform includes automatic basic coverage of up to $100 at no additional charge.',
  },
  {
    category: 'Delivery',
    question: 'What happens if I miss a home delivery attempt?',
    answer: 'Our courier will attempt redelivery the next business day or immediately reroute your parcel to the nearest 24/7 Smart Locker within 1 km for convenient pickup anytime within 7 days.',
  },
  {
    category: 'Tracking',
    question: 'How accurate are the real-time vehicle GPS estimates?',
    answer: 'Live tracking updates every 60 seconds once your courier is on the final delivery route, giving you a precise 30-minute delivery window.',
  },
];

export const savedAddresses = [
  {
    id: 'addr-1',
    label: 'Home',
    address: '188047 Otte St., Apt 4B',
    city: '10115 Berlin',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office',
    address: 'Friedrichstraße 90, Tech Hub Fl. 3',
    city: '10117 Berlin',
    isDefault: false,
  },
  {
    id: 'addr-3',
    label: 'Preferred Locker Hub',
    address: 'Alexanderplatz 24/7 Smart Locker #14',
    city: '10178 Berlin',
    isDefault: false,
  },
];
