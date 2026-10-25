import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, GitCompare } from "lucide-react";
import { PageHeader, DemoBadge, StatusPill } from "@/components/Layout";
import { FarmForm } from "@/components/FarmForm";
import { seedFarms, useStored, uid, type Farm } from "@/lib/data";

export const Route = createFileRoute("/farms")({
  head: () => ({ meta: [
    { title: "My Farms — Keystone Soil Watch" },
    { name: "description", content: "Manage multiple farm profiles, notes, and assessment status." },
    { property: "og:title", content: "My Farms — Keystone Soil Watch" },
    { property: "og:description", content: "Add, edit, and compare your farms." },
  ] }),
  component: FarmsPage,
});

function FarmsPage() {
  const [farms, setFarms, ready] = useStored<Farm[]>("ksw-farms", seedFarms);
  const [adding, setAdding] = useState(false);

  return (
    <>
      <PageHeader eyebrow="Profile" title="My Farms">
        <span className="flex flex-wrap items-center gap-2"><DemoBadge>Local demo mode</DemoBadge> Farms are saved only in this browser. There are no accounts and nothing is uploaded or shared.</span>
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-4 flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={() => setAdding(true)}><Plus className="h-4 w-4" />Add a farm</button>
          <Link to="/compare" className="btn btn-outline"><GitCompare className="h-4 w-4" />Compare farms</Link>
        </div>
        {adding && (
          <div className="card-surface mb-6 p-5">
            <h2 className="mb-3 text-xl font-semibold">New farm</h2>
            <FarmForm onCancel={() => setAdding(false)} onSave={(f) => { setFarms([...farms, { ...f, id: uid(), notes: [], history: [] }]); setAdding(false); }} />
          </div>
        )}
        {!ready ? <p className="text-muted-foreground">Loading farms…</p> : farms.length === 0 ? (
          <div className="card-surface p-10 text-center text-muted-foreground">No farms yet. Add your first farm to get started.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {farms.map((f) => (
              <div key={f.id} className="card-surface flex flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold">{f.name}</h3>
                  {f.demo && <DemoBadge>Example</DemoBadge>}
                </div>
                <p className="text-sm text-muted-foreground">{f.county} County · {f.types.join(", ") || "No type set"}</p>
                <div className="mt-3"><StatusPill status="Assessment Under Development" /></div>
                <div className="mt-auto flex gap-2 pt-4">
                  <Link to="/farms/$farmId" params={{ farmId: f.id }} className="btn btn-primary flex-1">Open</Link>
                  <button className="btn btn-outline" aria-label={`Remove ${f.name}`} onClick={() => confirm(`Remove ${f.name}?`) && setFarms(farms.filter((x) => x.id !== f.id))}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
