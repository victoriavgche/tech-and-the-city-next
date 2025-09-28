export default function Logo() {
  return (
    <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
      {/* Logo with frame - responsive sizing */}
      <div className="relative bg-gray-800 p-4 lg:p-5 w-20 h-16 lg:w-22 lg:h-18">
        {/* Frame lines - uniform thickness */}
        <div className="absolute inset-0">
          {/* Top line - full width */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
          {/* Right line - full height */}
          <div className="absolute top-0 right-0 w-1 h-full bg-white"></div>
          {/* Bottom line - only right part, no left part */}
          <div className="absolute bottom-0 right-0 w-8 lg:w-9 h-1 bg-white"></div>
          {/* Left line - only top part, no bottom part */}
          <div className="absolute top-0 left-0 w-1 h-8 lg:h-9 bg-white"></div>
          {/* Bottom-left corner is completely missing */}
        </div>
        {/* T&C Text */}
        <div className="text-white font-bold text-xl lg:text-2xl tracking-wide relative z-10 flex items-center justify-center h-full">
          T&C
        </div>
      </div>
      {/* Company Name - responsive sizing */}
        <div className="text-white text-xl lg:text-2xl font-bold tracking-wide whitespace-nowrap" style={{
          fontFamily: '"Space Grotesk", "Inter", "SF Pro Display", "Helvetica Neue", "Avenir Next", "Segoe UI", Roboto, sans-serif',
          fontWeight: '500',
          letterSpacing: '-0.02em',
          wordSpacing: '0.01em',
          fontStyle: 'normal',
          textShadow: 'none',
          textTransform: 'uppercase',
          fontStretch: 'condensed',
          textRendering: 'geometricPrecision',
          fontVariant: 'normal',
          fontFeatureSettings: '"ss01" 1, "ss02" 1, "ss03" 1',
          fontOpticalSizing: 'none',
          fontVariationSettings: '"wght" 500, "slnt" 0',
          transform: 'scaleX(0.95)'
        }}>
          TECH <span style={{ fontWeight: '400', fontSize: '0.85em' }}>&</span> THE CITY
        </div>
    </a>
  );
}
