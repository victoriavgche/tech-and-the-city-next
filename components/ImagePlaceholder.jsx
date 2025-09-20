export default function ImagePlaceholder({ src, alt, className = "" }) {
  // Simple image component with error handling
  return (
    <div className="relative">
      <img 
        src={src} 
        alt={alt}
        className={className}
        loading="lazy"
        onError={(e) => {
          // Hide the broken image and show fallback
          e.target.style.display = 'none';
          const fallback = e.target.nextSibling;
          if (fallback) {
            fallback.style.display = 'flex';
          }
        }}
      />
      {/* Fallback placeholder */}
      <div 
        className={`${className} bg-gradient-to-br from-blue-900 via-purple-900 to-orange-800 flex items-center justify-center relative overflow-hidden`}
        style={{ display: 'none' }}
      >
        <div className="text-center text-white p-8">
          <div className="text-4xl mb-4">🏛️</div>
          <h3 className="text-xl font-bold mb-2">Ηρώδειο - Νυχτερινή Παράσταση</h3>
          <p className="text-sm opacity-90">
            Αρχαίο αμφιθέατρο με σύγχρονες προβολές<br/>
            Μπλε, μοβ και πορτοκαλί φωτισμός
          </p>
        </div>
      </div>
    </div>
  );
}
