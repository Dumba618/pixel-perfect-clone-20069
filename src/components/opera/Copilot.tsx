import { Bot, ChevronRight, Terminal } from "lucide-react";

export type Sim = { emoji: string; label: string; key: string };

const sims: Sim[] = [
  { emoji: "🗣️", label: "Room 312: AC is blowing hot air (Dispatch Giorgi)", key: "hvac" },
  { emoji: "🚨", label: "Room 208: Bathroom pipe burst (Urgent / Dispatch Dato)", key: "plumb" },
  { emoji: "💳", label: "Room 312: Checkout James Wilson (Settle 45 GEL)", key: "checkout" },
];

export function Copilot({
  open,
  onToggle,
  logs,
  onSim,
}: {
  open: boolean;
  onToggle: () => void;
  logs: string[];
  onSim: (key: string) => void;
}) {
  return (
    <aside
      className={`fixed top-[51px] right-0 bottom-0 z-30 flex w-[360px] flex-col border-l border-obsidian-line bg-obsidian transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-[360px]"
      }`}
    >
      <button
        onClick={onToggle}
        className="absolute top-4 -left-8 flex h-8 w-8 items-center justify-center rounded-l-sm bg-obsidian text-white/80 hover:text-white"
        aria-label="Toggle copilot"
      >
        {open ? <ChevronRight size={16} /> : <Bot size={16} />}
      </button>

      <div className="flex items-center gap-2 border-b border-obsidian-line px-3 py-2.5">
        <Bot size={15} className="text-primary" />
        <span className="text-[12px] font-semibold text-white">
          OPERA Cloud Autonomous Copilot (OHIP Agent)
        </span>
        <span className="beacon-dot ml-auto h-2 w-2 rounded-full bg-inspected" />
      </div>

      <div className="space-y-2 p-3">
        <div className="text-[10px] tracking-wider text-white/45 uppercase">
          Voice Simulation Tests
        </div>
        {sims.map((s) => (
          <button
            key={s.key}
            onClick={() => onSim(s.key)}
            className="w-full rounded-sm bg-obsidian-pill px-3 py-2.5 text-left text-[12px] text-white/85 ring-1 ring-obsidian-line hover:bg-ribbon-hover"
          >
            <span className="mr-2">{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-t border-obsidian-line">
        <div className="flex items-center gap-1.5 px-3 py-2 text-[10px] tracking-wider text-white/45 uppercase">
          <Terminal size={12} /> Telemetry
        </div>
        <div className="flex-1 overflow-auto px-3 pb-3 font-mono text-[10.5px] leading-5 text-inspected">
          {logs.length === 0 && <div className="text-white/35">awaiting agent events…</div>}
          {logs.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
    </aside>
  );
}
