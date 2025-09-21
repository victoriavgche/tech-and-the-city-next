export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">⚡</span>
      </div>
      {/* Text */}
      <div className="flex flex-col">
        <span className="text-white text-lg font-semibold tracking-wide">Tech & the City</span>
        <span className="text-gray-400 text-xs">curated by The Pharmacist</span>
      </div>
    </div>
  );
}
