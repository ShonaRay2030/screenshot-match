import { useState } from "react";
import { FARM_TYPES, PA_COUNTIES, type Farm } from "@/lib/data";

type Editable = Pick<Farm, "name" | "county" | "types">;

export function FarmForm({ initial, onSave, onCancel }: { initial?: Editable; onSave: (f: Editable) => void; onCancel: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [county, setCounty] = useState(initial?.county ?? "Centre");
  const [types, setTypes] = useState<string[]>(initial?.types ?? []);
  const [err, setErr] = useState("");
  return (
    <form className="space-y-3" onSubmit={(e) => {
      e.preventDefault();
      if (!name.trim()) return setErr("Please give the farm a name.");
      onSave({ name: name.trim().slice(0, 80), county, types });
    }}>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm font-medium">Farm name<input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} /></label>
        <label className="text-sm font-medium">General location (county)
          <select className="field mt-1" value={county} onChange={(e) => setCounty(e.target.value)}>{PA_COUNTIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
      </div>
      <fieldset>
        <legend className="text-sm font-medium">Farm type / activities</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {FARM_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm">
              <input type="checkbox" checked={types.includes(t)} onChange={(e) => setTypes(e.target.checked ? [...types, t] : types.filter((x) => x !== t))} />{t}
            </label>
          ))}
        </div>
      </fieldset>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <p className="text-xs text-muted-foreground">We only ask for a county. No street address is needed.</p>
      <div className="flex gap-2"><button className="btn btn-primary">Save</button><button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button></div>
    </form>
  );
}
