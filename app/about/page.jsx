export default function About() {
  return (
    <main className="container py-8">
      <header className="mb-8 bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent mb-2">About</h1>
        <p className="text-slate-600 max-w-2xl">Learn more about Tech & the City and our mission.</p>
      </header>

      <div className="bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-amber-200">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            Tech & the City is a culture × tech journal curated by <strong>The Pharmacist</strong>. 
            We cover European startups with Athens energy — essays, on‑feet interviews, and field notes.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
          <ul className="text-gray-600 space-y-2">
            <li>• <strong>Essays:</strong> Deep dives into tech culture and innovation</li>
            <li>• <strong>Interviews:</strong> On-feet conversations with European entrepreneurs</li>
            <li>• <strong>Field Notes:</strong> Real-time insights from the startup scene</li>
            <li>• <strong>Events:</strong> Curated gatherings for the tech community</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Focus</h2>
          <p className="text-gray-600">
            We believe in the power of technology to transform culture and society. 
            Our content bridges the gap between technical innovation and cultural impact, 
            focusing on European startups that are making a difference.
          </p>
        </div>
      </div>
    </main>
  );
}

