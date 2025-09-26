export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="max-w-none">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">About</h1>
            
            <div className="text-gray-300 text-lg leading-relaxed space-y-6">
              <p>
                Dear gentle readers,
              </p>
              
              <p>
                Welcome to my platform, dedicated to Athens' vibrant tech and art scene, with stories that also reach across Europe. Here, tech, art, and science meet not with filters, but with sharp edge… sometimes even triggering, yet always unapologetic. My aim is not merely to just recount events, but to provoke thought, to spark curiosity, to push you into seeing beyond the obvious.
              </p>
              
              <p>
                Inspired by Bridgerton's Lady Whistledown from the famous Netflix series, I decided to start this page. This voice is a mixture of her sass and my own curiosity. If you seek polite summaries, you may exit now. But if you crave unfiltered reflection, often thought-provoking, yet always true, then stay, and let us dare to think together.
              </p>
              
              <p className="text-right text-cyan-400 font-medium">
                Yours,<br />
                Whistledown
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

