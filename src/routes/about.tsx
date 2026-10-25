import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DemoBadge } from "@/components/Layout";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "Our Mission — Keystone Soil Watch" },
    { name: "description", content: "Why microplastics in agricultural soil matter and who is building this tool." },
    { property: "og:title", content: "Our Mission — Keystone Soil Watch" },
    { property: "og:description", content: "Why microplastics in soil matter, and the founder behind the project." },
  ] }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader eyebrow="Mission" title="Helping farmers see the bigger picture">Our goal is to give Pennsylvania farmers clear, honest information about environmental factors around their land — and a place to learn from each other.</PageHeader>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2">
        <section className="card-surface p-6">
          <h2 className="text-2xl font-semibold">Why microplastics in soil matter</h2>
          <p className="mt-3 text-muted-foreground">Researchers are increasingly studying how small plastic particles enter farmland — for example through plastic mulch and other agricultural materials, irrigation water, wastewater-related sources, and soil amendments. Questions remain about how these particles affect soil structure, soil life, and crops.</p>
          <p className="mt-3 text-muted-foreground">Because testing soil for microplastics is specialized and not yet routine, understanding nearby environmental indicators can help farmers decide which questions are worth asking.</p>
        </section>
        <section className="card-surface p-6">
          <div className="flex items-center gap-2"><h2 className="text-2xl font-semibold">About the founder</h2><DemoBadge>Placeholder</DemoBadge></div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary font-display text-xl text-primary">?</div>
            <div><p className="font-semibold">Founder name</p><p className="text-sm text-muted-foreground">Role / background</p></div>
          </div>
          <p className="mt-4 text-muted-foreground">This space will share the founder's story and why they started this project. Content has not been provided yet.</p>
        </section>
      </div>
    </>
  );
}
