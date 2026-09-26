import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { TopBar } from "@/components/opera/TopBar";
import { Tiles } from "@/components/opera/Tiles";
import {
  ReservationsTable,
  RoomRack,
  StaffDirectory,
  TasksTable,
} from "@/components/opera/Tables";
import { Copilot } from "@/components/opera/Copilot";
import {
  API_BASE,
  mockReservations,
  mockRooms,
  mockStaff,
  mockTasks,
  type Reservation,
  type Room,
  type Task,
} from "@/lib/opera-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OPERA Cloud PMS — Grand Plaza Resort (SAND01)" },
      {
        name: "description",
        content:
          "Oracle Hospitality OPERA Cloud property management workspace: arrivals, occupancy, housekeeping, service requests and the OHIP autonomous copilot.",
      },
      { property: "og:title", content: "OPERA Cloud PMS — Grand Plaza Resort (SAND01)" },
      {
        property: "og:description",
        content:
          "Live front desk dashboard with reservations, room rack, service requests and OHIP agent telemetry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OperaCloud,
});

const TABS = [
  { id: "dash", label: "Dashboard Overview" },
  { id: "tasks", label: "Service Requests & Tasks (/fof/v1)" },
  { id: "rsv", label: "Front Desk Reservations (/rsv/v1)" },
  { id: "rooms", label: "Room Rack & Status (/room/v1)" },
  { id: "staff", label: "Staff Directory (/staff/v1)" },
];

function ts() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

function chime() {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch {
    /* audio unavailable */
  }
}

function OperaCloud() {
  const [tab, setTab] = useState("dash");
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [logs, setLogs] = useState<string[]>([]);
  const [live, setLive] = useState(false);
  const [drawer, setDrawer] = useState(true);
  const seq = useRef(7);

  const log = useCallback((line: string) => {
    setLogs((l) => [...l.slice(-80), `[${ts()}] ${line}`]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const [t, r, ro] = await Promise.all([
          fetch(`${API_BASE}/fof/v1/hotels/SAND01/tasks`),
          fetch(`${API_BASE}/rsv/v1/hotels/SAND01/reservations`),
          fetch(`${API_BASE}/room/v1/hotels/SAND01/rooms`),
        ]);
        if (!t.ok || !r.ok || !ro.ok) throw new Error("bad status");
        const [tj, rj, roj] = await Promise.all([t.json(), r.json(), ro.json()]);
        if (cancelled) return;
        if (Array.isArray(tj) && tj.length) setTasks(tj);
        if (Array.isArray(rj) && rj.length) setReservations(rj);
        if (Array.isArray(roj) && roj.length) setRooms(roj);
        setLive(true);
      } catch {
        if (!cancelled) setLive(false);
      }
    };
    poll();
    const id = setInterval(poll, 1500);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const addTask = useCallback(
    (t: Omit<Task, "id" | "created" | "fresh">) => {
      seq.current += 1;
      const id = `TSK-${String(seq.current).padStart(4, "0")}`;
      const task: Task = { ...t, id, created: "just now", fresh: true };
      setTasks((prev) => [task, ...prev]);
      setTimeout(
        () => setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, fresh: false } : x))),
        2000,
      );
      return id;
    },
    [],
  );

  const runSim = useCallback(
    (key: string) => {
      chime();
      if (key === "hvac") {
        const id = addTask({
          room: "312",
          category: "HVAC",
          issue: "AC blowing hot air — guest reported by voice",
          priority: "HIGH",
          tech: "Giorgi",
          techNative: "გიორგი",
          status: "DISPATCHED",
        });
        log(`POST /fof/v1/hotels/SAND01/tasks -> 200 OK (${id})`);
        log("AGENT dispatch: Giorgi (HVAC, Floor 3) ETA 6m");
      } else if (key === "plumb") {
        const id = addTask({
          room: "208",
          category: "PLUMBING",
          issue: "Bathroom pipe burst — water on floor",
          priority: "CRITICAL",
          tech: "Dato",
          techNative: "დათო",
          status: "DISPATCHED",
        });
        log(`POST /fof/v1/hotels/SAND01/tasks -> 201 CREATED (${id})`);
        log("ESCALATION urgent=true -> Duty Manager notified");
      } else {
        setReservations((prev) =>
          prev.map((r) =>
            r.conf === "R_1187" ? { ...r, status: "CHECKED_OUT" as const } : r,
          ),
        );
        setRooms((prev) =>
          prev.map((r) => (r.number === "312" ? { ...r, status: "DIRTY", note: "Dirty 1m" } : r)),
        );
        log("POST /rsv/v1/hotels/SAND01/reservations/R_1187/checkout -> 200 OK");
        log("POST /csh/v1/folios/R_1187/settle {amount:45, cur:GEL} -> 200 OK");
      }
      setTab("tasks");
    },
    [addTask, log],
  );

  const activeCount = tasks.filter((t) => t.status !== "COMPLETED").length;

  return (
    <div className="min-h-screen bg-canvas">
      <TopBar />

      <nav className="flex items-center gap-0 bg-ribbon px-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2.5 text-[12px] font-medium transition-colors ${
              tab === t.id
                ? "bg-canvas text-ink"
                : "text-white/75 hover:bg-ribbon-hover hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 pr-2 text-[10px] text-white/60">
          <span>
            ACTIVE TASKS <b className="text-white">{activeCount}</b>
          </span>
          <span>
            OCCUPANCY <b className="text-white">88%</b>
          </span>
          <span>{live ? "LIVE · localhost:8000" : "MOCK DATA · offline"}</span>
        </div>
      </nav>

      <main
        className={`space-y-3 p-3 transition-[padding] ${drawer ? "pr-[372px]" : "pr-10"}`}
      >
        {tab === "dash" && (
          <>
            <Tiles tasks={tasks} />
            <TasksTable tasks={tasks.slice(0, 5)} />
          </>
        )}
        {tab === "tasks" && <TasksTable tasks={tasks} />}
        {tab === "rsv" && <ReservationsTable rows={reservations} />}
        {tab === "rooms" && <RoomRack rooms={rooms} />}
        {tab === "staff" && <StaffDirectory staff={mockStaff} />}
      </main>

      <Copilot open={drawer} onToggle={() => setDrawer((d) => !d)} logs={logs} onSim={runSim} />
    </div>
  );
}
