export type Task = {
  id: string;
  room: string;
  category: "HVAC" | "PLUMBING" | "HOUSEKEEPING" | "ELECTRICAL";
  issue: string;
  priority: "CRITICAL" | "HIGH" | "NORMAL";
  tech: string;
  techNative: string;
  status: "DISPATCHED" | "IN_PROGRESS" | "COMPLETED";
  created: string;
  fresh?: boolean;
};

export type Reservation = {
  conf: string;
  guest: string;
  room: string;
  card: string;
  status: "CHECKED_IN" | "BOOKED" | "CHECKED_OUT";
};

export type Room = {
  number: string;
  status: "OCCUPIED" | "DIRTY" | "VACANT_CLEAN";
  note?: string;
};

export type Staff = {
  name: string;
  native: string;
  skill: string;
  location: string;
  state: "Available" | "Busy";
  active: number;
};

export const mockTasks: Task[] = [
  {
    id: "TSK-0001",
    room: "312",
    category: "HVAC",
    issue: "AC not cooling - blowing warm air",
    priority: "HIGH",
    tech: "Giorgi",
    techNative: "გიორგი",
    status: "DISPATCHED",
    created: "4m ago",
  },
  {
    id: "TSK-0002",
    room: "208",
    category: "PLUMBING",
    issue: "Bathroom sink draining slowly, standing water",
    priority: "CRITICAL",
    tech: "Dato",
    techNative: "დათო",
    status: "IN_PROGRESS",
    created: "12m ago",
  },
  {
    id: "TSK-0003",
    room: "405",
    category: "HOUSEKEEPING",
    issue: "Extra towels and turndown service requested",
    priority: "NORMAL",
    tech: "Nino",
    techNative: "ნინო",
    status: "IN_PROGRESS",
    created: "26m ago",
  },
  {
    id: "TSK-0004",
    room: "117",
    category: "ELECTRICAL",
    issue: "Bedside lamp socket sparking on contact",
    priority: "HIGH",
    tech: "Levani",
    techNative: "ლევანი",
    status: "DISPATCHED",
    created: "38m ago",
  },
  {
    id: "TSK-0005",
    room: "221",
    category: "HOUSEKEEPING",
    issue: "Late checkout cleaning - room flagged dirty",
    priority: "NORMAL",
    tech: "Nino",
    techNative: "ნინო",
    status: "COMPLETED",
    created: "1h ago",
  },
  {
    id: "TSK-0006",
    room: "301",
    category: "HVAC",
    issue: "Thermostat display unresponsive after reset",
    priority: "NORMAL",
    tech: "Giorgi",
    techNative: "გიორგი",
    status: "COMPLETED",
    created: "2h ago",
  },
];

export const mockReservations: Reservation[] = [
  { conf: "R_1187", guest: "James Wilson", room: "312", card: "•••• 4417", status: "CHECKED_IN" },
  { conf: "R_1188", guest: "Nino Beridze", room: "208", card: "•••• 2290", status: "CHECKED_IN" },
  { conf: "R_1189", guest: "Anna Petrova", room: "405", card: "•••• 8831", status: "BOOKED" },
  { conf: "R_1190", guest: "Marcus Lehmann", room: "117", card: "•••• 6012", status: "CHECKED_IN" },
  { conf: "R_1191", guest: "Sofia Rossi", room: "221", card: "•••• 1145", status: "CHECKED_OUT" },
  { conf: "R_1192", guest: "Tariel Kapanadze", room: "301", card: "•••• 7723", status: "BOOKED" },
];

const roomStatuses: Array<Room["status"]> = ["OCCUPIED", "DIRTY", "VACANT_CLEAN"];

export const mockRooms: Room[] = (() => {
  const rooms: Room[] = [];
  for (let floor = 1; floor <= 4; floor++) {
    for (let n = 1; n <= 16; n++) {
      const number = `${floor}${String(n).padStart(2, "0")}`;
      const status = roomStatuses[(floor * 5 + n * 3) % 3] as Room["status"];
      rooms.push(
        status === "DIRTY"
          ? { number, status, note: `Dirty ${45 + ((n * 13) % 90)}m` }
          : { number, status },
      );
    }
  }
  return rooms;
})();

export const mockStaff: Staff[] = [
  {
    name: "Giorgi",
    native: "გიორგი",
    skill: "HVAC",
    location: "Floor 3",
    state: "Available",
    active: 1,
  },
  {
    name: "Levani",
    native: "ლევანი",
    skill: "HVAC / Electrical",
    location: "Floor 1",
    state: "Busy",
    active: 3,
  },
  {
    name: "Dato",
    native: "დათო",
    skill: "Plumbing",
    location: "Basement",
    state: "Available",
    active: 1,
  },
  {
    name: "Nino",
    native: "ნინო",
    skill: "Housekeeping",
    location: "Floor 4",
    state: "Busy",
    active: 4,
  },
];

export const API_BASE = "http://localhost:8000";
