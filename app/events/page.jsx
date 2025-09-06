import events from "../../data/events.json";
export const metadata = { title: "Events — Tech & the City" };

export default function Events(){
  return (
    <main className="container py-12">
      <h1 className="text-3xl font-semibold">Events</h1>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {events.upcoming.map((e)=>(
          <div key={e.id} className="card p-5">
            <div className="text-sm text-white/80">{e.name}</div>
            <div className="text-xs text-white/60">{e.date} · {e.city}</div>
            <p className="text-white/70 mt-2">{e.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}