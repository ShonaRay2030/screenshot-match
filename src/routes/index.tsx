import { createFileRoute, Link } from "@tanstack/react-router";
import { Map, Plus, ListChecks, MessagesSquare, Droplets, Factory, Waves, Info } from "lucide-react";
import hero from "@/assets/hero-farm.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Keystone Soil Watch — Microplastics risk screening for PA farms" },
    { name: "description", content: "Explore environmental indicators that may relate to potential microplastics risk in Pennsylvania agricultural soil." },
    { property: "og:title", content: "Keystone Soil Watch" },
    { property: "og:description", content: "A prototype screening tool and community for Pennsylvania farmers." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="hero-wash">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-earth">For Pennsylvania farmers</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">Know what's around your fields.</h1>
            <p className="mt-4 text-lg text-muted-foreground">Explore environmental indicators near your farm that may be relevant to potential microplastics in agricultural soil — then find practical next steps and talk with farmers nearby.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/map" className="btn btn-primary"><Map className="h-4 w-4" />Explore the Map</Link>
              <Link to="/farms" className="btn btn-outline"><Plus className="h-4 w-4" />Add a Farm</Link>
              <Link to="/steps" className="btn btn-outline"><ListChecks className="h-4 w-4" />Get Recommendations</Link>
              <Link to="/community" className="btn btn-earth"><MessagesSquare className="h-4 w-4" />Ask Farmers in Your Area</Link>
            </div>
          </div>
          <img src={hero} alt="Pennsylvania farmland with a creek" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg" width={1600} height={900} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="-mt-6 flex gap-3 rounded-xl border border-earth/40 bg-warning p-4 text-sm text-warning-foreground">
          <Info className="h-5 w-5 shrink-0" />
          <p><strong>A screening tool, not a test.</strong> This site estimates <em>potential</em> risk from indirect environmental indicators. It cannot confirm whether microplastics are present in your soil or how much. Only a qualified laboratory analysis can do that.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold">How it works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["1. Pick a location", "Search an address, ZIP, or coordinates, or click the map."],
            ["2. Review indicators", "See nearby environmental features from public EPA and Pennsylvania datasets, with sources and limitations."],
            ["3. Plan next steps", "Get questions to investigate, people to consult, and practices to consider."],
          ].map(([t, d]) => <div key={t} className="card-surface p-5"><h3 className="text-lg font-semibold">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>)}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Status: the map includes October 2026 beneficial land use records. Additional datasets and the risk-scoring model are still being developed, so results currently read “Assessment Under Development.”</p>
      </section>

      <section className="bg-muted">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold">Indicators we'll look at</h2>
            <ul className="mt-5 space-y-3">
              {[[Factory, "Wastewater discharge points & facilities"], [Waves, "Receiving waterways"], [Droplets, "Irrigation water sources"]].map(([I, t]) => {
                const Icon = I as typeof Factory;
                return <li key={t as string} className="flex items-center gap-3"><span className="rounded-full bg-secondary p-2 text-primary"><Icon className="h-4 w-4" /></span>{t as string}</li>;
              })}
            </ul>
          </div>
          <div className="card-surface p-6">
            <h3 className="text-xl font-semibold">Recommended steps</h3>
            <p className="mt-2 text-sm text-muted-foreground">Three tracks: understand your results, investigate further, and explore possible mitigation. Mark each step To Do, In Progress, or Completed.</p>
            <Link to="/steps" className="btn btn-primary mt-4">See the steps</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="card-surface grid gap-6 p-8 md:grid-cols-[2fr_1fr] md:items-center">
          <div>
            <h2 className="text-3xl font-semibold">Got questions? Chat with farmers in your area.</h2>
            <p className="mt-2 text-muted-foreground">Share experiences about soil health, irrigation, and plastic use. Filter by county and farm type. Personal experiences are always labeled separately from cited research.</p>
          </div>
          <div className="flex gap-2 md:justify-end">
            <Link to="/community" className="btn btn-earth">Visit the community</Link>
            <Link to="/about" className="btn btn-outline">Our mission</Link>
          </div>
        </div>
      </section>
    </>
  );
}
