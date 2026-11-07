import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, DemoBadge } from "@/components/Layout";
import { useStored, uid, type StepState } from "@/lib/data";

export const Route = createFileRoute("/steps")({
  head: () => ({ meta: [
    { title: "Recommended Steps — Keystone Soil Watch" },
    { name: "description", content: "Understand your results, investigate further, and explore possible mitigation options." },
    { property: "og:title", content: "Recommended Steps for Farmers" },
    { property: "og:description", content: "A practical checklist for next steps." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Steps,
});

interface Step { id: string; title: string; detail: string; link?: { label: string; href: string } }
const SECTIONS: { key: string; title: string; intro: string; steps: Step[] }[] = [
  { key: "A", title: "A. Understand your results", intro: "Start by learning what the indicators mean — and what they don't.", steps: [
    { id: "a1", title: "Review which indicators were identified", detail: "Check your farm dashboard for nearby discharge points, waterways, or facilities once data are connected." },
    { id: "a2", title: "Read what each indicator does and does not tell you", detail: "Proximity to a feature is not evidence that plastics reached your soil." },
    { id: "a3", title: "Note missing data and uncertainty", detail: "Missing data means 'unknown', not 'low risk'." },
    { id: "a4", title: "List questions to investigate", detail: "e.g. Where does my irrigation water come from? Have I used biosolids, compost, or plastic mulch?" },
  ] },
  { key: "B", title: "B. Investigate further", intro: "Additional information may be worthwhile if indicators suggest a plausible pathway, such as irrigating from a waterway downstream of discharges.", steps: [
    { id: "b1", title: "Record your farm practices", detail: "Plastic mulch, films, drip tape, bale wrap, and how they are removed or disposed." },
    { id: "b2", title: "Record your water sources", detail: "Well, municipal, pond, or stream — and where the stream comes from." },
    { id: "b3", title: "Record soil amendments", detail: "Types and sources of compost, manure, or biosolids applied." },
    { id: "b4", title: "Talk to your county extension office", detail: "An extension educator can help interpret soil and water questions.", link: { label: "Penn State Extension", href: "https://extension.psu.edu/" } },
    { id: "b5", title: "Consider a qualified laboratory or environmental professional", detail: "Only when your questions warrant it — microplastic analysis is specialized and not routine." },
  ] },
  { key: "C", title: "C. Explore possible mitigation options", intro: "General educational suggestions. Whether any apply depends on your farm's conditions and the suspected source. Do not undertake costly interventions without evidence.", steps: [
    { id: "c1", title: "Reduce plastic left in fields", detail: "Remove plastic mulch and film residues as completely as practical after use." },
    { id: "c2", title: "Ask about the contents of soil amendments", detail: "Ask suppliers about contamination screening for compost or other amendments." },
    { id: "c3", title: "Store and dispose of ag plastics properly", detail: "Look into local agricultural plastic recycling programs rather than burning or burying." },
  ] },
];

function Steps() {
  const [state, setState] = useStored<Record<string, StepState>>("ksw-steps", () => ({}));
  const [notes, setNotes] = useStored<Record<string, string>>("ksw-step-notes", () => ({}));
  const [saved, setSaved] = useStored<{ id: string; text: string }[]>("ksw-questions", () => []);
  const [q, setQ] = useState("");
  const all = SECTIONS.flatMap((s) => s.steps);
  const done = all.filter((s) => state[s.id] === "Completed").length;

  return (
    <>
      <PageHeader eyebrow="Next steps" title="Recommended Steps">
        <span className="flex flex-wrap items-center gap-2"><DemoBadge>General guidance</DemoBadge> These are general educational suggestions, not personalized recommendations — personalization will follow once real indicator data are connected. Progress is saved in this browser.</span>
      </PageHeader>
      <div className="mx-auto max-w-6xl space-y-6 px-4">
        <div className="card-surface p-4">
          <p className="text-sm font-medium">{done} of {all.length} steps completed</p>
          <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${(done / all.length) * 100}%` }} /></div>
        </div>
        {SECTIONS.map((sec) => (
          <section key={sec.key} className="card-surface p-5">
            <h2 className="text-2xl font-semibold">{sec.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{sec.intro}</p>
            <ul className="mt-4 space-y-3">
              {sec.steps.map((s) => (
                <li key={s.id} className="rounded-lg border p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{s.title}</p>
                      <p className="text-sm text-muted-foreground">{s.detail}</p>
                      {s.link && <a className="text-sm font-medium text-primary underline" href={s.link.href} target="_blank" rel="noreferrer">{s.link.label} ↗</a>}
                    </div>
                    <select className="field w-auto" value={state[s.id] ?? "To Do"} onChange={(e) => setState({ ...state, [s.id]: e.target.value as StepState })} aria-label={`Status for ${s.title}`}>
                      <option>To Do</option><option>In Progress</option><option>Completed</option>
                    </select>
                  </div>
                  <input className="field mt-2" placeholder="Progress notes (optional)" value={notes[s.id] ?? ""} onChange={(e) => setNotes({ ...notes, [s.id]: e.target.value.slice(0, 300) })} />
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section className="card-surface p-5">
          <h2 className="text-2xl font-semibold">Saved questions & observations</h2>
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (q.trim()) { setSaved([...saved, { id: uid(), text: q.trim().slice(0, 300) }]); setQ(""); } }}>
            <input className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Something to ask your extension office…" />
            <button className="btn btn-primary">Save</button>
          </form>
          {saved.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">Nothing saved yet.</p> : (
            <ul className="mt-3 space-y-2">{saved.map((s) => <li key={s.id} className="flex justify-between rounded-md bg-muted p-2 text-sm">{s.text}<button aria-label="Delete" onClick={() => setSaved(saved.filter((x) => x.id !== s.id))}>×</button></li>)}</ul>
          )}
        </section>
      </div>
    </>
  );
}
