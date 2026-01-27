// Centralized parking zones and slots data
export const INITIAL_ZONES = [
  {
    id: 'A',
    name: 'Zone A',
    level: 'Ground Floor',
    totalSlots: 100,
    availableSlots: 45,
    occupiedSlots: 55,
    description: 'Premium parking zone near main entrance',
    color: '#3b82f6',
    features: ['Covered', 'CCTV', 'Easy Access', 'Near Elevator'],
    pricePerHour: 30
  },
  {
    id: 'B',
    name: 'Zone B',
    level: '1st Floor',
    totalSlots: 80,
    availableSlots: 32,
    occupiedSlots: 48,
    description: 'Standard parking zone on first floor',
    color: '#667eea',
    features: ['Covered', 'CCTV', 'Spacious', 'Well-lit'],
    pricePerHour: 30
  },
  {
    id: 'C',
    name: 'Zone C',
    level: '2nd Floor',
    totalSlots: 120,
    availableSlots: 68,
    occupiedSlots: 52,
    description: 'Large parking zone on second floor',
    color: '#764ba2',
    features: ['Covered', 'CCTV', 'Ventilated', 'Fast Exit'],
    pricePerHour: 30
  },
  {
    id: 'D',
    name: 'Zone D',
    level: 'Basement',
    totalSlots: 150,
    availableSlots: 87,
    occupiedSlots: 63,
    description: 'Underground parking with climate control',
    color: '#f59e0b',
    features: ['Climate Controlled', 'CCTV', 'Security Guard', 'Safe'],
    pricePerHour: 40
  },
  {
    id: 'E',
    name: 'Zone E',
    level: '3rd Floor',
    totalSlots: 90,
    availableSlots: 42,
    occupiedSlots: 48,
    description: 'Open-air parking on third floor',
    color: '#10b981',
    features: ['Open Air', 'CCTV', 'Budget Friendly', 'Spacious'],
    pricePerHour: 20
  },
  {
    id: 'F',
    name: 'Zone F',
    level: 'Level -2',
    totalSlots: 110,
    availableSlots: 61,
    occupiedSlots: 49,
    description: 'Deep basement with 24/7 surveillance',
    color: '#8b5cf6',
    features: ['Deep Underground', 'CCTV', 'Secure', 'Safe'],
    pricePerHour: 35
  }
];

export const INITIAL_SLOTS = [
  // Zone A Slots
  { id: 'A-001', zone: 'A', zoneDisplay: 'Zone A', floor: 1, status: 'available', type: 'Regular' },
  { id: 'A-002', zone: 'A', zoneDisplay: 'Zone A', floor: 1, status: 'occupied', type: 'Regular' },
  { id: 'A-003', zone: 'A', zoneDisplay: 'Zone A', floor: 1, status: 'available', type: 'Premium' },
  { id: 'A-004', zone: 'A', zoneDisplay: 'Zone A', floor: 2, status: 'occupied', type: 'Regular' },
  { id: 'A-005', zone: 'A', zoneDisplay: 'Zone A', floor: 2, status: 'available', type: 'Regular' },
  { id: 'A-006', zone: 'A', zoneDisplay: 'Zone A', floor: 2, status: 'available', type: 'Regular' },
  { id: 'A-007', zone: 'A', zoneDisplay: 'Zone A', floor: 1, status: 'available', type: 'Premium' },
  { id: 'A-008', zone: 'A', zoneDisplay: 'Zone A', floor: 2, status: 'occupied', type: 'Regular' },

  // Zone B Slots
  { id: 'B-001', zone: 'B', zoneDisplay: 'Zone B', floor: 1, status: 'available', type: 'Regular' },
  { id: 'B-002', zone: 'B', zoneDisplay: 'Zone B', floor: 1, status: 'available', type: 'Premium' },
  { id: 'B-003', zone: 'B', zoneDisplay: 'Zone B', floor: 1, status: 'occupied', type: 'Regular' },
  { id: 'B-004', zone: 'B', zoneDisplay: 'Zone B', floor: 2, status: 'available', type: 'Regular' },
  { id: 'B-005', zone: 'B', zoneDisplay: 'Zone B', floor: 2, status: 'occupied', type: 'Premium' },
  { id: 'B-006', zone: 'B', zoneDisplay: 'Zone B', floor: 1, status: 'available', type: 'Regular' },
  { id: 'B-007', zone: 'B', zoneDisplay: 'Zone B', floor: 2, status: 'occupied', type: 'Regular' },

  // Zone C Slots
  { id: 'C-001', zone: 'C', zoneDisplay: 'Zone C', floor: 1, status: 'available', type: 'Regular' },
  { id: 'C-002', zone: 'C', zoneDisplay: 'Zone C', floor: 1, status: 'available', type: 'Regular' },
  { id: 'C-003', zone: 'C', zoneDisplay: 'Zone C', floor: 2, status: 'occupied', type: 'Regular' },
  { id: 'C-004', zone: 'C', zoneDisplay: 'Zone C', floor: 2, status: 'available', type: 'Regular' },
  { id: 'C-005', zone: 'C', zoneDisplay: 'Zone C', floor: 2, status: 'occupied', type: 'Premium' },
  { id: 'C-006', zone: 'C', zoneDisplay: 'Zone C', floor: 1, status: 'available', type: 'Premium' },
  { id: 'C-007', zone: 'C', zoneDisplay: 'Zone C', floor: 1, status: 'occupied', type: 'Regular' },

  // Zone D Slots
  { id: 'D-001', zone: 'D', zoneDisplay: 'Zone D', floor: 1, status: 'available', type: 'Regular' },
  { id: 'D-002', zone: 'D', zoneDisplay: 'Zone D', floor: 1, status: 'available', type: 'Regular' },
  { id: 'D-003', zone: 'D', zoneDisplay: 'Zone D', floor: 2, status: 'occupied', type: 'Regular' },
  { id: 'D-004', zone: 'D', zoneDisplay: 'Zone D', floor: 2, status: 'available', type: 'Premium' },
  { id: 'D-005', zone: 'D', zoneDisplay: 'Zone D', floor: 1, status: 'occupied', type: 'Regular' },

  // Zone E Slots
  { id: 'E-001', zone: 'E', zoneDisplay: 'Zone E', floor: 1, status: 'available', type: 'Regular' },
  { id: 'E-002', zone: 'E', zoneDisplay: 'Zone E', floor: 1, status: 'available', type: 'Regular' },
  { id: 'E-003', zone: 'E', zoneDisplay: 'Zone E', floor: 2, status: 'occupied', type: 'Regular' },
  { id: 'E-004', zone: 'E', zoneDisplay: 'Zone E', floor: 2, status: 'available', type: 'Regular' },

  // Zone F Slots
  { id: 'F-001', zone: 'F', zoneDisplay: 'Zone F', floor: 1, status: 'available', type: 'Regular' },
  { id: 'F-002', zone: 'F', zoneDisplay: 'Zone F', floor: 1, status: 'occupied', type: 'Regular' },
  { id: 'F-003', zone: 'F', zoneDisplay: 'Zone F', floor: 2, status: 'available', type: 'Premium' },
  { id: 'F-004', zone: 'F', zoneDisplay: 'Zone F', floor: 2, status: 'occupied', type: 'Regular' }
];

// Helper functions to manage dynamic data
export const updateZoneAvailability = (zones, zoneId, availableSlots) => {
  return zones.map(zone => {
    if (zone.id === zoneId) {
      return {
        ...zone,
        availableSlots,
        occupiedSlots: zone.totalSlots - availableSlots
      };
    }
    return zone;
  });
};

export const updateSlotStatus = (slots, slotId, newStatus) => {
  return slots.map(slot => {
    if (slot.id === slotId) {
      return { ...slot, status: newStatus };
    }
    return slot;
  });
};

export const bookSlot = (slots, zones, slotId) => {
  const slot = slots.find(s => s.id === slotId);
  if (!slot || slot.status === 'occupied') {
    return { slots, zones, error: 'Slot is not available' };
  }

  const updatedSlots = updateSlotStatus(slots, slotId, 'occupied');
  const zone = zones.find(z => z.id === slot.zone);
  
  if (!zone) {
    return { slots: updatedSlots, zones, error: 'Zone not found' };
  }

  const updatedZones = updateZoneAvailability(zones, slot.zone, zone.availableSlots - 1);

  return { slots: updatedSlots, zones: updatedZones, error: null };
};

export const releaseSlot = (slots, zones, slotId) => {
  const slot = slots.find(s => s.id === slotId);
  if (!slot || slot.status === 'available') {
    return { slots, zones, error: 'Slot is already available' };
  }

  const updatedSlots = updateSlotStatus(slots, slotId, 'available');
  const zone = zones.find(z => z.id === slot.zone);
  
  if (!zone) {
    return { slots: updatedSlots, zones, error: 'Zone not found' };
  }

  const updatedZones = updateZoneAvailability(zones, slot.zone, zone.availableSlots + 1);

  return { slots: updatedSlots, zones: updatedZones, error: null };
};

export const getSlotsByZone = (slots, zoneId) => {
  return slots.filter(slot => slot.zone === zoneId);
};

export const getAvailableSlots = (slots, zoneId = null) => {
  return zoneId 
    ? slots.filter(slot => slot.zone === zoneId && slot.status === 'available')
    : slots.filter(slot => slot.status === 'available');
};
