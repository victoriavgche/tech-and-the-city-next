export default function Events() {
  return (
    <main className="container py-8">
      <header className="mb-8 bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent mb-2">Events</h1>
        <p className="text-slate-600 max-w-2xl">Upcoming tech events and gatherings in Athens and beyond.</p>
      </header>

      <div className="space-y-6">
        {/* Event 1 */}
        <div className="bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-4xl mb-2">🚀</div>
                  <p className="text-sm font-semibold">Startup Meetup</p>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Athens Tech Meetup</h2>
              <p className="text-gray-600 mb-4">
                Join us for an evening of networking, presentations, and discussions about the latest trends in European tech.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>📅 March 15, 2024</span>
                <span>📍 Athens, Greece</span>
                <span>⏰ 7:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Event 2 */}
        <div className="bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-4xl mb-2">💡</div>
                  <p className="text-sm font-semibold">Innovation Talk</p>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Culture × Tech Panel</h2>
              <p className="text-gray-600 mb-4">
                A deep dive into how technology is reshaping cultural expression and creative industries.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>📅 April 20, 2024</span>
                <span>📍 Online Event</span>
                <span>⏰ 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-200">
          <h2 className="text-xl font-bold text-purple-900 mb-2">More Events Coming Soon</h2>
          <p className="text-purple-700">
            We're planning exciting events for the tech community. Stay tuned for updates!
          </p>
        </div>
      </div>
    </main>
  );
}

