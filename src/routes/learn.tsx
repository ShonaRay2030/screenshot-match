import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DemoBadge } from "@/components/Layout";

export const Route = createFileRoute("/learn")({
  head: () => ({ meta: [
    { title: "Learn & Data Sources — Keystone Soil Watch" },
    { name: "description", content: "What microplastics are, how they may reach farmland, and how this tool's methodology works." },
    { property: "og:title", content: "Learn & Data Sources" },
    { property: "og:description", content: "Background, data sources, and methodology." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Learn,
});

const TOPICS = [
  ["What are microplastics?", "Small plastic particles, commonly defined as less than 5 mm across. They come from breakdown of larger plastics or are manufactured small."],
  ["Why study them in farm soil?", "Researchers want to understand how these particles build up in soil and whether they affect soil structure, soil organisms, water movement, and crops."],
  ["Possible pathways", "Plastic agricultural materials (mulch, films, drip tape), wastewater-related sources, irrigation water, and soil amendments such as compost or biosolids."],
  ["What environmental proxies can tell us", "Proxies — like distance to a discharge outfall — point to plausible pathways that might be worth asking about."],
  ["What they cannot tell us", "Indicators cannot measure microplastic concentrations. Only laboratory analysis of soil or water samples can."],
  ["Interpreting uncertainty", "Missing data means 'unknown', not 'safe'. Scores (when available) will be relative screening estimates, not measurements."],
];

const PORTALS = [
  ["EPA ECHO (Enforcement and Compliance History Online)", "https://echo.epa.gov/", "Facility and discharge permit records"],
  ["PA DEP eMapPA", "https://gis.dep.pa.gov/emappa/", "Pennsylvania environmental facility map"],
  ["PASDA — Pennsylvania Spatial Data Access", "https://www.pasda.psu.edu/", "Pennsylvania geospatial datasets"],
  ["Penn State Extension", "https://extension.psu.edu/", "Agricultural extension resources"],
];

function Learn() {
  return (
    <>
      <PageHeader eyebrow="Learn" title="Learn & Data Sources">Background on microplastics in agricultural soil, the data this tool plans to use, and how scores will be built.</PageHeader>
      <div className="mx-auto max-w-6xl space-y-10 px-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map(([t, d]) => <div key={t} className="card-surface p-5"><h2 className="text-lg font-semibold">{t}</h2><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>)}
        </div>

        <section>
          <div className="flex items-center gap-2"><h2 className="text-2xl font-semibold">Data sources</h2><DemoBadge>1 reference layer available</DemoBadge></div>
          <p className="mt-3 text-sm text-muted-foreground">Beneficial Land Uses · PA DEP, user-supplied October 2026 files: 1,125 records mapped, with 4 excluded for inconsistent coordinates. Records describe listed biosolids or residential septage land-application sites; they do not confirm application or microplastic contamination. The supplied projection was used for conversion, but descriptive metadata conflicts and field definitions remain under review. Other datasets below are not yet integrated.</p>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {PORTALS.map(([n, u, d]) => <li key={n} className="card-surface p-4"><a href={u} target="_blank" rel="noreferrer" className="font-semibold text-primary underline">{n} ↗</a><p className="text-sm text-muted-foreground">{d}</p></li>)}
          </ul>
          <div className="card-surface mt-4 border-dashed p-4 text-sm text-muted-foreground"><strong className="text-foreground">Peer-reviewed studies:</strong> none listed yet. Studies will be added here only after they have been identified and verified.</div>
        </section>

        <section className="card-surface p-6">
          <div className="flex items-center gap-2"><h2 className="text-2xl font-semibold">Methodology</h2><DemoBadge>In development</DemoBadge></div>
          <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">
            <div><dt className="font-semibold">Inputs</dt><dd className="text-muted-foreground">Cleaned CSV files from PA and EPA datasets: discharge locations & characteristics, latitude/longitude, receiving waterways, facility type & status, distances to a farm.</dd></div>
            <div><dt className="font-semibold">Variable encoding</dt><dd className="text-muted-foreground">To be documented. Not yet defined.</dd></div>
            <div><dt className="font-semibold">Weights</dt><dd className="text-muted-foreground">Not yet assigned. Weights will be selected and justified from research — not arbitrarily.</dd></div>
            <div><dt className="font-semibold">Missing data</dt><dd className="text-muted-foreground">Locations without enough data will show “Insufficient Data” rather than a score.</dd></div>
            <div><dt className="font-semibold">What a score will mean</dt><dd className="text-muted-foreground">A relative screening estimate of potential exposure pathways — never a measurement.</dd></div>
            <div><dt className="font-semibold">Validation</dt><dd className="text-muted-foreground">The model has not been evaluated. No score will be displayed until it is.</dd></div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">Data processing will run in a separate Python pipeline; this website will read its outputs.</p>
        </section>
      </div>
    </>
  );
}
