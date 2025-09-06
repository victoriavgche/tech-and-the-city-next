export const metadata = { title: "Subscribe — Tech & the City" };
export default function Subscribe(){
  return (
    <main className="container py-12">
      <h1 className="text-3xl font-semibold">Subscribe</h1>
      <p className="text-white/70 mt-2">Connect your newsletter provider later (Beehiiv/Mailchimp). For now, we show a static form.</p>
      <form className="card p-5 mt-4 max-w-md">
        <input placeholder="Your email" className="w-full rounded-xl bg-black/30 border border-white/15 px-3 py-2 outline-none placeholder:text-white/40" />
        <button className="btn mt-3">Join</button>
      </form>
    </main>
  )
}