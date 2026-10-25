import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, Sprout, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/map", label: "Explore Map" },
  { to: "/farms", label: "My Farms" },
  { to: "/steps", label: "Recommended Steps" },
  { to: "/community", label: "Farmer Community" },
  { to: "/learn", label: "Learn & Data" },
  { to: "/about", label: "Mission" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-[1000] border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
          <Sprout className="h-5 w-5" /> Keystone Soil Watch
        </Link>
        <nav className="hidden gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-secondary text-secondary-foreground font-semibold" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col border-t px-4 py-2 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-sm">{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Prototype risk-screening tool.</p>
        <p className="mt-1 max-w-3xl">This site estimates potential risk from indirect environmental indicators. It does not detect or measure microplastics, and cannot confirm their presence or concentration in any soil. No real environmental datasets are connected yet.</p>
      </div>
    </footer>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-earth">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{title}</h1>
      {children && <div className="mt-3 max-w-3xl text-muted-foreground">{children}</div>}
    </div>
  );
}

export function DemoBadge({ children = "Demonstration" }: { children?: ReactNode }) {
  return <span className="inline-flex items-center rounded-full bg-warning px-2.5 py-0.5 text-xs font-semibold text-warning-foreground">{children}</span>;
}

export function StatusPill({ status }: { status: string }) {
  return <span className="inline-flex rounded-full border border-dashed border-earth px-2.5 py-0.5 text-xs font-medium text-earth">{status}</span>;
}
