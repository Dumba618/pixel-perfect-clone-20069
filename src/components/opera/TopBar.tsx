import { Bell, ChevronDown, Hotel, Search } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40">
      <div className="flex h-12 items-center gap-3 bg-obsidian px-3">
        <div className="flex items-center gap-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg"
            alt="Oracle"
            className="h-4 w-auto brightness-0 invert"
          />
          <span className="h-5 w-px bg-divider" />
          <span className="text-[14px] font-bold tracking-tight text-white">
            OPERA Cloud Property Management
          </span>
          <button className="ml-1 flex items-center gap-1.5 rounded-sm bg-obsidian-pill px-2 py-1 text-[11px] font-medium text-white/85 ring-1 ring-obsidian-line hover:bg-ribbon-hover">
            <Hotel size={13} className="text-white/70" />
            SAND01 - Grand Plaza Resort (Hub)
            <ChevronDown size={12} className="text-white/60" />
          </button>
        </div>

        <div className="mx-auto">
          <div className="relative w-[420px]">
            <Search
              size={14}
              className="absolute top-1/2 left-2.5 -translate-y-1/2 text-white/45"
            />
            <input
              className="h-7 w-full rounded-sm bg-obsidian-pill pr-3 pl-8 text-[12px] text-white/90 ring-1 ring-obsidian-line outline-none placeholder:text-white/40 focus:ring-primary"
              placeholder="Search Reservations, Rooms, Tasks, Folios... (Ctrl + K)"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-white/70">
            <span className="beacon-dot h-2 w-2 rounded-full bg-inspected" />
            OHIP Gateway: Connected
          </div>
          <span className="rounded-sm bg-obsidian-pill px-2 py-1 font-mono text-[10px] text-white/70 ring-1 ring-obsidian-line">
            Ctrl + F4
          </span>
          <button className="relative text-white/75 hover:text-white">
            <Bell size={16} />
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-urgent text-[9px] font-bold text-white">
              3
            </span>
          </button>
          <span className="h-5 w-px bg-divider" />
          <div className="flex items-center gap-2">
            <img
              src="https://i.pravatar.cc/64?img=12"
              alt="Front Desk Supervisor"
              className="h-6 w-6 rounded-full ring-1 ring-obsidian-line"
            />
            <div className="leading-tight">
              <div className="text-[11px] font-semibold text-white">Front Desk Supervisor</div>
              <div className="text-[9px] tracking-wide text-white/55 uppercase">Admin</div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[3px] bg-primary" />
    </header>
  );
}
