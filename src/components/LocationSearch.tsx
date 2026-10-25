import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { geocode, type GeoResult } from "@/lib/data";

export function LocationSearch({ onPick }: { onPick: (r: GeoResult) => void }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GeoResult[] | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true); setError(null); setResults(null);
    try {
      const r = await geocode(q);
      setResults(r);
      if (r.length === 1) onPick(r[0]!);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally { setLoading(false); }
  }

  return (
    <div>
      <form onSubmit={run} className="flex gap-2">
        <input className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Address, ZIP code, or 40.27, -76.88" aria-label="Search location" />
        <button className="btn btn-primary" disabled={loading} aria-label="Search">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-destructive">{error}. Try again or enter coordinates.</p>}
      {results && results.length === 0 && <p className="mt-2 text-sm text-muted-foreground">No Pennsylvania matches found.</p>}
      {results && results.length > 1 && (
        <ul className="mt-2 max-h-48 overflow-auto rounded-md border bg-card text-sm">
          {results.map((r, i) => (
            <li key={i}><button className="w-full px-3 py-2 text-left hover:bg-muted" onClick={() => { onPick(r); setResults(null); }}>{r.label}</button></li>
          ))}
        </ul>
      )}
      <p className="mt-1 text-xs text-muted-foreground">Searches are sent to OpenStreetMap and are not saved.</p>
    </div>
  );
}
