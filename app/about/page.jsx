export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600">
      <div className="container py-8">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="max-w-none">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Tech & the City is a culture × tech journal curated by <strong className="text-white">The Pharmacist</strong>. 
              We cover European startups with Athens energy — essays, on‑feet interviews, and field notes.
            </p>
            
            <h2 className="text-3xl font-bold text-white mb-6">What We Do</h2>
            <ul className="text-gray-300 text-lg space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-white mr-3 text-xl">•</span>
                <span><strong className="text-white">Essays:</strong> Deep dives into tech culture and innovation</span>
              </li>
              <li className="flex items-start">
                <span className="text-white mr-3 text-xl">•</span>
                <span><strong className="text-white">Interviews:</strong> On-feet conversations with European entrepreneurs</span>
              </li>
              <li className="flex items-start">
                <span className="text-white mr-3 text-xl">•</span>
                <span><strong className="text-white">Field Notes:</strong> Real-time insights from the startup scene</span>
              </li>
              <li className="flex items-start">
                <span className="text-white mr-3 text-xl">•</span>
                <span><strong className="text-white">Events:</strong> Curated gatherings for the tech community</span>
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-white mb-6">Our Focus</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              We believe in the power of technology to transform culture and society. 
              Our content bridges the gap between technical innovation and cultural impact, 
              focusing on European startups that are making a difference.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

