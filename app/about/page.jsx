export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">About</h1>
          </div>
        </header>

        {/* Content */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="max-w-none">
            
            <div className="text-gray-300 text-lg leading-relaxed space-y-6 text-justify">
              <p>
                Dear gentle readers,
              </p>
              
              <p>
                Welcome to a space where Athens' tech and art scene takes the spotlight, with stories that also extend across Europe. My aim is to approach tech and art through a social lens, adding unapologetic commentary rather than just reporting events and stories.
              </p>
              
              <p>
                Inspired by Bridgerton's character Whistledown and blended with my own voice, the Silicon Whisperer was born. If you seek vanilla writing, you may exit now. But if you crave unfiltered words…then stay.
              </p>
              
              <p className="text-left text-cyan-400 font-medium">
                <em>Yours,</em><br />
                <em>the Silicon Whisperer</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

