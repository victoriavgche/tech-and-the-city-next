export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo with frame - thinner lines, no bottom-left corner */}
      <div className="relative bg-gray-800 p-4 w-20 h-16">
        {/* Frame lines - uniform thickness */}
        <div className="absolute inset-0">
          {/* Top line - full width */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
          {/* Right line - full height */}
          <div className="absolute top-0 right-0 w-1 h-full bg-white"></div>
          {/* Bottom line - only right part, no left part */}
          <div className="absolute bottom-0 right-0 w-8 h-1 bg-white"></div>
          {/* Left line - only top part, no bottom part */}
          <div className="absolute top-0 left-0 w-1 h-8 bg-white"></div>
          {/* Bottom-left corner is completely missing */}
        </div>
        {/* T&C Text */}
        <div className="text-white font-bold text-xl tracking-wide relative z-10 flex items-center justify-center h-full">
          T&C
        </div>
      </div>
      {/* Company Name */}
        <div className="text-white text-xl font-bold tracking-wide" style={{
          fontFamily: '"JetBrains Mono", "Fira Code", "Monaco", "Consolas", "Courier New", monospace',
          fontWeight: '500',
          letterSpacing: '-0.02em',
          wordSpacing: '-0.2em',
          fontSize: '1.73rem',
          fontStyle: 'normal',
          textShadow: 'none',
          textTransform: 'uppercase',
          fontStretch: 'condensed',
          textRendering: 'geometricPrecision',
          fontVariant: 'normal',
          fontFeatureSettings: '"ss01" 1, "ss02" 1, "ss03" 1, "cv01" 1, "cv02" 1',
          fontOpticalSizing: 'none',
          fontVariationSettings: '"wght" 500, "slnt" 0'
        }}>
          Tech <span style={{ fontWeight: '400' }}>&</span> the City
        </div>
    </div>
  );
}
