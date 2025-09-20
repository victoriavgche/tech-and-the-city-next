export default function Logo() {
  return (
    <div className="flex flex-col items-start gap-2">
      {/* Logo - T&C without box */}
      <div className="relative">
        <div className="text-white font-bold italic text-4xl tracking-wide relative">
          <span className="relative z-10">T</span>
          <span className="relative z-20">&</span>
          <span className="relative z-30">C</span>
        </div>
      </div>
      {/* Text below - larger, bold and normal case */}
      <span className="text-white text-xl font-bold tracking-wide">Tech & the City</span>
    </div>
  );
}
