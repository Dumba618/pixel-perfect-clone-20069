import { Plus } from "lucide-react";
import { useState } from "react";
import type { Reservation, Room, Staff, Task } from "@/lib/opera-data";

const catTone: Record<string, string> = {
  HVAC: "var(--dirty)",
  PLUMBING: "var(--plumbing)",
  HOUSEKEEPING: "var(--occupied)",
  ELECTRICAL: "var(--vip)",
};
const prioTone: Record<string, string> = {
  CRITICAL: "var(--urgent)",
  HIGH: "var(--dirty)",
  NORMAL: "var(--slate)",
};
const statusTone: Record<string, string> = {
  DISPATCHED: "var(--occupied)",
  IN_PROGRESS: "var(--dirty)",
  COMPLETED: "var(--inspected)",
  CHECKED_IN: "var(--inspected)",
  BOOKED: "var(--occupied)",
  CHECKED_OUT: "var(--slate)",
};

function Badge({ label, tone, blink }: { label: string; tone: string; blink?: boolean }) {
  return (
    <span
      className={`inline-block rounded-sm px-1.5 py-[2px] text-[9px] font-bold tracking-wide ${blink ? "urgent-blink" : ""}`}
      style={{ backgroundColor: `color-mix(in oklab, ${tone} 14%, white)`, color: tone }}
    >
      {label}
    </span>
  );
}

function avatar(seed: string) {
  return `https://i.pravatar.cc/48?u=${encodeURIComponent(seed)}`;
}

export function TasksTable({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "HVAC", "Plumbing", "Housekeeping"];
  const rows = tasks.filter(
    (t) => filter === "All" || t.category === filter.toUpperCase(),
  );

  return (
    <section className="rounded-[3px] border border-border bg-card shadow-tile">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
              filter === f
                ? "bg-ribbon text-white"
                : "bg-secondary text-slate hover:bg-border"
            }`}
          >
            {f}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-1 rounded-sm bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground hover:bg-oracle-hover">
          <Plus size={12} /> New Service Request
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-canvas">
            {[
              "Task ID",
              "Room",
              "Category",
              "Issue Description",
              "Priority",
              "Assigned Technician",
              "Status",
              "Created",
            ].map((h) => (
              <th key={h} className="table-head border-b border-border px-3 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr
              key={t.id}
              className={`h-[38px] border-b border-border hover:bg-canvas ${t.fresh ? "row-flash" : ""}`}
            >
              <td className="px-3 font-mono text-[11px] text-occupied">{t.id}</td>
              <td className="px-3 text-[13px] font-bold text-ink">{t.room}</td>
              <td className="px-3">
                <Badge label={t.category} tone={catTone[t.category]} />
              </td>
              <td className="max-w-[320px] truncate px-3 text-[12px] text-ink">{t.issue}</td>
              <td className="px-3">
                <Badge
                  label={t.priority}
                  tone={prioTone[t.priority]}
                  blink={t.priority === "CRITICAL"}
                />
              </td>
              <td className="px-3">
                <div className="flex items-center gap-2">
                  <img src={avatar(t.tech)} alt={t.tech} className="h-5 w-5 rounded-full" />
                  <span className="text-[12px] text-ink">
                    {t.tech} ({t.techNative})
                  </span>
                </div>
              </td>
              <td className="px-3">
                <Badge label={t.status} tone={statusTone[t.status]} />
              </td>
              <td className="px-3 text-[11px] text-slate">{t.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function ReservationsTable({ rows }: { rows: Reservation[] }) {
  return (
    <section className="rounded-[3px] border border-border bg-card shadow-tile">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-canvas">
            {["Confirmation", "Guest Name", "Room", "Card on File", "Status", ""].map((h) => (
              <th key={h} className="table-head border-b border-border px-3 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.conf} className="h-[38px] border-b border-border hover:bg-canvas">
              <td className="px-3 font-mono text-[11px] text-occupied">{r.conf}</td>
              <td className="px-3">
                <div className="flex items-center gap-2">
                  <img src={avatar(r.guest)} alt={r.guest} className="h-5 w-5 rounded-full" />
                  <span className="text-[12px] font-medium text-ink">{r.guest}</span>
                </div>
              </td>
              <td className="px-3 text-[13px] font-bold text-ink">{r.room}</td>
              <td className="px-3 font-mono text-[11px] text-slate">{r.card}</td>
              <td className="px-3">
                <Badge label={r.status} tone={statusTone[r.status]} />
              </td>
              <td className="px-3 text-right">
                <button className="rounded-sm border border-border px-2 py-1 text-[11px] font-medium text-ink hover:bg-canvas">
                  View Folio
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

const roomTone: Record<Room["status"], string> = {
  OCCUPIED: "var(--occupied)",
  DIRTY: "var(--dirty)",
  VACANT_CLEAN: "var(--inspected)",
};

export function RoomRack({ rooms }: { rooms: Room[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
      {rooms.map((r) => (
        <div
          key={r.number}
          className="overflow-hidden rounded-[3px] border border-border bg-card shadow-tile"
        >
          <div className="h-1" style={{ backgroundColor: roomTone[r.status] }} />
          <div className="px-2.5 py-2">
            <div className="text-[15px] font-bold text-ink">{r.number}</div>
            <div
              className="mt-1 text-[10px] font-semibold tracking-wide"
              style={{ color: roomTone[r.status] }}
            >
              {r.status.replace("_", " ")}
            </div>
            {r.note && (
              <span className="mt-1.5 inline-block rounded-sm bg-secondary px-1.5 py-[2px] text-[9px] text-slate">
                {r.note}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StaffDirectory({ staff }: { staff: Staff[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      {staff.map((s) => (
        <div key={s.name} className="rounded-[3px] border border-border bg-card p-3 shadow-tile">
          <div className="flex items-center gap-3">
            <img src={avatar(s.name)} alt={s.name} className="h-10 w-10 rounded-full" />
            <div>
              <div className="text-[13px] font-semibold text-ink">
                {s.name} ({s.native})
              </div>
              <div className="text-[11px] text-slate">
                {s.skill} · {s.location}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
            <Badge
              label={s.state.toUpperCase()}
              tone={s.state === "Available" ? "var(--inspected)" : "var(--dirty)"}
            />
            <span className="text-[11px] text-slate">{s.active} active tasks</span>
          </div>
        </div>
      ))}
    </div>
  );
}
