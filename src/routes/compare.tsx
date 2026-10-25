import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/Layout";
import { INDICATORS, seedFarms, useStored, type Farm } from "@/lib/data";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [
    { title: "Compare Farms — Keystone Soil Watch" },
    { name: "description", content: "Compare indicators, data coverage, and assessment status across your farms." },
    { property: "og:title", content: "Compare Farms" },
    { property: "og:description", content: "Side-by-side comparison of your farms." },
  ] }),
  component: Compare,
});

function Compare() {
  const [farms, , ready] = useStored<Farm[]>("ksw-farms", seedFarms);
  const [picked, setPicked] = useState<string[]>([]);
  const sel = farms.filter((f) => picked.includes(f.id));
  return (
    <>
      <PageHeader eyebrow="My Farms" title="Compare farms">Pick two or more farms to compare. Comparisons are not reliable while data are missing — and currently all indicator data are missing.</PageHeader>
      <div className="mx-auto max-w-6xl px-4">
        {!ready ? <p>Loading…</p> : farms.length < 2 ? (
          <div className="card-surface p-8 text-center text-muted-foreground">Add at least two farms to compare. <Link to="/farms" className="font-semibold text-primary underline">Go to My Farms</Link></div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {farms.map((f) => <label key={f.id} className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"><input type="checkbox" checked={picked.includes(f.id)} onChange={(e) => setPicked(e.target.checked ? [...picked, f.id] : picked.filter((x) => x !== f.id))} />{f.name}</label>)}
            </div>
            {sel.length >= 2 && (
              <div className="card-surface mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted text-left"><th className="p-3">Item</th>{sel.map((f) => <th key={f.id} className="p-3">{f.name}</th>)}</tr></thead>
                  <tbody>
                    <tr className="border-b"><td className="p-3 font-medium">County</td>{sel.map((f) => <td key={f.id} className="p-3">{f.county}</td>)}</tr>
                    {INDICATORS.map((i) => <tr key={i.key} className="border-b"><td className="p-3 font-medium">{i.label}</td>{sel.map((f) => <td key={f.id} className="p-3 text-muted-foreground">Missing</td>)}</tr>)}
                    <tr className="border-b"><td className="p-3 font-medium">Data coverage</td>{sel.map((f) => <td key={f.id} className="p-3">0 of {INDICATORS.length}</td>)}</tr>
                    <tr><td className="p-3 font-medium">Risk estimate</td>{sel.map((f) => <td key={f.id} className="p-3">Insufficient Data</td>)}</tr>
                  </tbody>
                </table>
                <p className="p-3 text-xs text-warning-foreground">⚠ This comparison is not reliable: no indicator data are available for any selected farm.</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
