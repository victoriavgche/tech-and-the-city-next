import data from "../../data/street.json";
export const metadata = { title: "Street Series — Tech & the City" };

export default function Street(){
  return (
    <main className="container py-12">
      <h1 className="text-3xl font-semibold">Street Series</h1>
      <p className="text-white/70 mt-2 max-w-2xl">On‑feet interviews from conferences and underground nights.</p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {data.items.map((v)=> (
          <a key={v.id} href={v.url} target="_blank" className="card aspect-video grid place-items-center hover:border-white/20">
            <span className="text-white/70">{v.title}</span>
          </a>
        ))}
      </div>
    </main>
  )
}