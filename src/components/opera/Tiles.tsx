import { ArrowRight, BedDouble, LogIn, LogOut, Sparkles, Wrench } from "lucide-react";
import type { Task } from "@/lib/opera-data";

function Tile({
  title,
  icon,
  children,
  footer,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  footer?: string;
}) {
  return (
    <div className="flex flex-col rounded-[3px] border border-border bg-card shadow-tile">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="text-slate">{icon}</span>
        <h3 className="text-[12px] font-semibold text-ink">{title}</h3>
      </div>
      <div className="flex-1 px-3 py-3">{children}</div>
      {footer ? (
        <button className="flex items-center gap-1 border-t border-border px-3 py-2 text-[11px] font-medium text-occupied hover:underline">
          {footer} <ArrowRight size={12} />
        </button>
      ) : null}
    </div>
  );
}

function Pill({ children, tone }: { children: React.ReactNode; tone: string }) {
  return (
    <span
      className="rounded-full px-2 py-[3px] text-[10px] font-semibold"
      style={{ backgroundColor: `color-mix(in oklab, ${tone} 12%, white)`, color: tone }}
    >
      {children}
    </span>
  );
}

export function Tiles({ tasks }: { tasks: Task[] }) {
  const urgent = tasks.filter((t) => t.priority === "CRITICAL").length;
  const active = tasks.filter((t) => t.status !== "COMPLETED");

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
      <Tile title="Arrivals" icon={<LogIn size={14} />} footer="Search Arrivals">
        <div className="text-[34px] leading-none font-semibold text-ink">42</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Pill tone="var(--inspected)">24 Checked In</Pill>
          <Pill tone="var(--occupied)">16 Expected</Pill>
          <Pill tone="var(--vip)">2 VIPs</Pill>
        </div>
      </Tile>

      <Tile title="In-House Guests & Occupancy" icon={<BedDouble size={14} />} footer="View In-House">
        <div className="flex items-end gap-2">
          <div className="text-[34px] leading-none font-semibold text-ink">88%</div>
          <div className="pb-1 text-[11px] text-slate">176 / 200 Rooms</div>
        </div>
        <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-secondary">
          <span className="h-full" style={{ width: "71%", backgroundColor: "var(--occupied)" }} />
          <span className="h-full" style={{ width: "17%", backgroundColor: "var(--inspected)" }} />
          <span className="h-full" style={{ width: "12%", backgroundColor: "var(--dirty)" }} />
        </div>
        <div className="mt-2 flex gap-3 text-[10px] text-slate">
          <span>Occupied 142</span>
          <span>Vacant Clean 34</span>
          <span>Dirty 24</span>
        </div>
      </Tile>

      <Tile title="Departures" icon={<LogOut size={14} />} footer="Search Departures">
        <div className="text-[34px] leading-none font-semibold text-ink">31</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Pill tone="var(--inspected)">23 Checked Out</Pill>
          <Pill tone="var(--dirty)">8 Due Out</Pill>
        </div>
      </Tile>

      <Tile title="Room Status & Housekeeping" icon={<Sparkles size={14} />} footer="Open Housekeeping">
        <div className="space-y-2">
          {[
            ["142", "Clean / Inspected", "var(--inspected)"],
            ["28", "Dirty", "var(--dirty)"],
            ["6", "Out of Order", "var(--urgent)"],
          ].map(([n, label, tone]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="h-6 w-1 rounded-full" style={{ backgroundColor: tone }} />
              <span className="text-[18px] font-semibold text-ink">{n}</span>
              <span className="text-[11px] text-slate">{label}</span>
            </div>
          ))}
        </div>
      </Tile>

      <Tile title="Service Requests & Traces (OHIP)" icon={<Wrench size={14} />} footer="Open Task Sheet">
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-semibold text-ink">{active.length}</span>
          <span className="text-[11px] text-slate">Active Work Orders</span>
          {urgent > 0 && (
            <span className="urgent-blink ml-auto rounded-sm bg-urgent px-1.5 py-[2px] text-[9px] font-bold tracking-wide text-white">
              {urgent} URGENT
            </span>
          )}
        </div>
        <div className="mt-3 space-y-2 border-t border-border pt-2">
          {tasks.slice(0, 2).map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-[11px]">
              <span className="font-mono text-[10px] text-occupied">{t.id}</span>
              <span className="font-semibold text-ink">Rm {t.room}</span>
              <span className="truncate text-slate">{t.tech}</span>
            </div>
          ))}
        </div>
      </Tile>
    </div>
  );
}
