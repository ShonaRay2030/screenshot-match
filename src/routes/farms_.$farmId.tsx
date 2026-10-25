import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { DemoBadge, StatusPill } from "@/components/Layout";
import { FarmForm } from "@/components/FarmForm";
import { INDICATORS, seedFarms, useStored, type Farm } from "@/lib/data";

export const Route = createFileRoute("/farms_/$farmId")({
  head: () => ({ meta: [
    { title: "Farm dashboard — Keystone Soil Watch" },
    { name: "description", content: "Private farm dashboard with indicators, notes, and next steps." },
    { name: "robots", content: "noindex" },
    { property: "og:title", content: "Farm dashboard" },
    { property: "og:description", content: "Private farm dashboard." },
  ] }),
  component: FarmPage,
});

function FarmPage() {
  const { farmId } = Route.useParams();
  const [farms, setFarms, ready] = useStored<Farm[]>("ksw-farms", seedFarms);
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState("");
  const farm = farms.find((f) => f.id === farmId);
  const update = (patch: Partial<Farm>) => setFarms(farms.map((f) => (f.id === farmId ? { ...f, ...patch } : f)));

  if (!ready) return <p className="mx-auto max-w-6xl px-4 py-10 text-muted-foreground">Loading…</p>;
  if (!farm) return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p>This farm wasn't found in this browser.</p>
      <Link to="/farms" className="btn btn-primary mt-4">Back to My Farms</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/farms" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />My Farms</Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold">{farm.name}</h1>
        {farm.demo && <DemoBadge>Example farm</DemoBadge>}
        <div className="ml-auto flex gap-2">
          <button className="btn btn-outline" onClick={() => setEditing(!editing)}><Pencil className="h-4 w-4" />Edit</button>
          <button className="btn btn-outline" onClick={() => { if (confirm("Remove this farm?")) { setFarms(farms.filter((f) => f.id !== farmId)); history.back(); } }}><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      <p className="text-muted-foreground">{farm.county} County · {farm.types.join(", ") || "No type set"}</p>

      {editing && <div className="card-surface mt-4 p-5"><FarmForm initial={farm} onCancel={() => setEditing(false)} onSave={(f) => { update(f); setEditing(false); }} /></div>}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card-surface p-5 lg:col-span-2">
          <h2 className="text-xl font-semibold">Risk assessment</h2>
          <div className="mt-2 flex gap-2"><StatusPill status="Assessment Under Development" /></div>
          <p className="mt-2 text-sm text-muted-foreground">No score is available. A score will appear only once datasets are connected and the methodology is validated.</p>
          <h3 className="mt-5 font-semibold">Environmental indicators</h3>
          <ul className="mt-2 grid gap-2 md:grid-cols-2">
            {INDICATORS.map((i) => <li key={i.key} className="rounded-md border p-3 text-sm"><p className="font-medium">{i.label}</p><p className="text-xs text-muted-foreground">{i.status}</p></li>)}
          </ul>
          <h3 className="mt-5 font-semibold">Recommended next steps</h3>
          <p className="mt-1 text-sm text-muted-foreground">General guidance only until indicators are available. {farm.types.includes("Vegetables") && "Since you grow vegetables, the plastic mulch section may be relevant."}</p>
          <Link to="/steps" className="btn btn-primary mt-3">Open Recommended Steps</Link>
        </section>
        <section className="card-surface p-5">
          <h2 className="text-xl font-semibold">Notes & observations</h2>
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (note.trim()) { update({ notes: [...farm.notes, note.trim().slice(0, 500)] }); setNote(""); } }}>
            <input className="field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an observation" />
            <button className="btn btn-primary">Add</button>
          </form>
          {farm.notes.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No notes yet.</p> : (
            <ul className="mt-3 space-y-2">{farm.notes.map((n, i) => (
              <li key={i} className="flex justify-between gap-2 rounded-md bg-muted p-2 text-sm">{n}<button className="text-muted-foreground" aria-label="Delete note" onClick={() => update({ notes: farm.notes.filter((_, j) => j !== i) })}>×</button></li>
            ))}</ul>
          )}
          <h2 className="mt-6 text-xl font-semibold">Assessment history</h2>
          {farm.history.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No assessments yet — real assessments will be stored here once available.</p> : (
            <ul className="mt-2 space-y-2 text-sm">{farm.history.map((h, i) => <li key={i} className="rounded-md border p-2"><span className="font-medium">{h.date}</span> · {h.status}<p className="text-xs text-muted-foreground">{h.note}</p></li>)}</ul>
          )}
        </section>
      </div>
    </div>
  );
}
