import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, Bookmark, Flag, MessageCircle, Plus } from "lucide-react";
import { PageHeader, DemoBadge } from "@/components/Layout";
import { FARM_TYPES, PA_COUNTIES, useStored, uid } from "@/lib/data";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [
    { title: "Farmer Community — Keystone Soil Watch" },
    { name: "description", content: "Got questions? Chat with farmers in your area about soil, water, and plastics." },
    { property: "og:title", content: "Farmer Community" },
    { property: "og:description", content: "Discussions among Pennsylvania farmers." },
  ] }),
  component: Community,
});

const CATS = ["Soil Health", "Irrigation and Water Sources", "Plastic Use in Agriculture", "Microplastics Questions", "Testing and Research", "General Farming"];
const KINDS = ["Question", "Personal experience", "Research link"] as const;
type Kind = (typeof KINDS)[number];
interface Post { id: string; title: string; body: string; cat: string; kind: Kind; county?: string; farmType?: string; author: string; likes: number; liked?: boolean; saved?: boolean; reported?: boolean; comments: { id: string; author: string; text: string }[]; demo?: boolean }

const seed = (): Post[] => [
  { id: "d1", demo: true, title: "How do you remove plastic mulch completely?", body: "Every fall I find shreds left in the beds. Curious what tools or timing others use.", cat: "Plastic Use in Agriculture", kind: "Question", county: "Lancaster", farmType: "Vegetables", author: "Demo farmer", likes: 3, comments: [{ id: "c1", author: "Demo farmer 2", text: "(Example reply) We pull it while it's still pliable." }] },
  { id: "d2", demo: true, title: "Switched irrigation from creek to well", body: "Sharing my experience — this is just what we did, not a recommendation.", cat: "Irrigation and Water Sources", kind: "Personal experience", county: "Centre", farmType: "Mixed", author: "Demo farmer 3", likes: 1, comments: [] },
];

const kindStyle: Record<Kind, string> = { "Question": "bg-secondary text-secondary-foreground", "Personal experience": "bg-accent text-accent-foreground", "Research link": "bg-primary text-primary-foreground" };

function Community() {
  const [posts, setPosts] = useStored<Post[]>("ksw-posts", seed);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("");
  const [county, setCounty] = useState("");
  const [ftype, setFtype] = useState("");
  const [composing, setComposing] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const shown = useMemo(() => posts.filter((p) => !p.reported &&
    (!cat || p.cat === cat) && (!county || p.county === county) && (!ftype || p.farmType === ftype) &&
    (!search || (p.title + p.body).toLowerCase().includes(search.toLowerCase()))), [posts, cat, county, ftype, search]);
  const patch = (id: string, f: (p: Post) => Post) => setPosts(posts.map((p) => (p.id === id ? f(p) : p)));

  return (
    <>
      <PageHeader eyebrow="Community" title="Got questions? Chat with farmers in your area.">
        <span className="flex flex-wrap items-center gap-2"><DemoBadge>Demonstration board</DemoBadge> Posts and comments stay in this browser only — no one else can see them yet. A shared board needs accounts and moderation, which aren't set up. Farmer posts are opinions and experiences, not scientific facts.</span>
      </PageHeader>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[260px_1fr]">
        <aside className="card-surface h-fit space-y-3 p-4">
          <button className="btn btn-primary w-full" onClick={() => setComposing(true)}><Plus className="h-4 w-4" />New post</button>
          <input className="field" placeholder="Search discussions" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="field" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="field" value={county} onChange={(e) => setCounty(e.target.value)}><option value="">All counties</option>{PA_COUNTIES.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="field" value={ftype} onChange={(e) => setFtype(e.target.value)}><option value="">All farm types</option>{FARM_TYPES.map((c) => <option key={c}>{c}</option>)}</select>
        </aside>
        <div className="space-y-4">
          {composing && <Composer onCancel={() => setComposing(false)} onPost={(p) => { setPosts([p, ...posts]); setComposing(false); }} />}
          {shown.length === 0 && <div className="card-surface p-8 text-center text-muted-foreground">No discussions match these filters.</div>}
          {shown.map((p) => (
            <article key={p.id} className="card-surface p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`rounded-full px-2.5 py-0.5 font-semibold ${kindStyle[p.kind]}`}>{p.kind}</span>
                <span className="text-muted-foreground">{p.cat}</span>
                {p.county && <span className="text-muted-foreground">· {p.county} County</span>}
                {p.farmType && <span className="text-muted-foreground">· {p.farmType}</span>}
                {p.demo && <DemoBadge>Example post</DemoBadge>}
              </div>
              <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
              <p className="mt-1 whitespace-pre-line text-sm">{p.body}</p>
              <p className="mt-2 text-xs text-muted-foreground">by {p.author}</p>
              <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                <button className={`flex items-center gap-1 ${p.liked ? "text-destructive" : ""}`} onClick={() => patch(p.id, (x) => ({ ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) }))}><Heart className="h-4 w-4" />{p.likes}</button>
                <button className={`flex items-center gap-1 ${p.saved ? "text-primary" : ""}`} onClick={() => patch(p.id, (x) => ({ ...x, saved: !x.saved }))}><Bookmark className="h-4 w-4" />{p.saved ? "Saved" : "Save"}</button>
                <button className="flex items-center gap-1" onClick={() => setOpen(open === p.id ? null : p.id)}><MessageCircle className="h-4 w-4" />{p.comments.length}</button>
                <button className="ml-auto flex items-center gap-1" onClick={() => confirm("Report and hide this post?") && patch(p.id, (x) => ({ ...x, reported: true }))}><Flag className="h-4 w-4" />Report</button>
              </div>
              {open === p.id && <Comments post={p} onAdd={(text) => patch(p.id, (x) => ({ ...x, comments: [...x.comments, { id: uid(), author: "You", text }] }))} />}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function Comments({ post, onAdd }: { post: Post; onAdd: (t: string) => void }) {
  const [t, setT] = useState("");
  return (
    <div className="mt-3 space-y-2 border-t pt-3">
      {post.comments.map((c) => <p key={c.id} className="rounded-md bg-muted p-2 text-sm"><span className="font-semibold">{c.author}:</span> {c.text}</p>)}
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (t.trim()) { onAdd(t.trim().slice(0, 500)); setT(""); } }}>
        <input className="field" value={t} onChange={(e) => setT(e.target.value)} placeholder="Write a comment" /><button className="btn btn-primary">Reply</button>
      </form>
    </div>
  );
}

function Composer({ onPost, onCancel }: { onPost: (p: Post) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(""); const [body, setBody] = useState("");
  const [cat, setCat] = useState(CATS[0]); const [kind, setKind] = useState<Kind>("Question");
  const [county, setCounty] = useState(""); const [farmType, setFarmType] = useState(""); const [err, setErr] = useState("");
  return (
    <form className="card-surface space-y-3 p-5" onSubmit={(e) => {
      e.preventDefault();
      if (!title.trim() || !body.trim()) return setErr("Add a title and a message.");
      if (/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b|@\w+\.\w+/.test(body)) return setErr("Please don't share phone numbers or email addresses.");
      onPost({ id: uid(), title: title.trim().slice(0, 120), body: body.trim().slice(0, 2000), cat, kind, county: county || undefined, farmType: farmType || undefined, author: "You", likes: 0, comments: [] });
    }}>
      <h2 className="text-lg font-semibold">New post</h2>
      <input className="field" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="field min-h-24" placeholder="Your message (no addresses or contact info)" value={body} onChange={(e) => setBody(e.target.value)} />
      <div className="grid gap-2 md:grid-cols-2">
        <select className="field" value={kind} onChange={(e) => setKind(e.target.value as Kind)}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select>
        <select className="field" value={cat} onChange={(e) => setCat(e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
        <select className="field" value={county} onChange={(e) => setCounty(e.target.value)}><option value="">Don't share county</option>{PA_COUNTIES.map((c) => <option key={c}>{c}</option>)}</select>
        <select className="field" value={farmType} onChange={(e) => setFarmType(e.target.value)}><option value="">No farm-type tag</option>{FARM_TYPES.map((c) => <option key={c}>{c}</option>)}</select>
      </div>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <div className="flex gap-2"><button className="btn btn-primary">Post</button><button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button></div>
    </form>
  );
}
