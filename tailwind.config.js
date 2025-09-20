// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Sophisticated Futuristic Palette
        bg: "#0a0a0f", // Deep Space
        cyber: {
          blue: "#00d4ff",    // Electric Blue
          cyan: "#00ffff",    // Neon Cyan
          purple: "#8b5cf6",  // Quantum Purple
          silver: "#e2e8f0",   // Cyber Silver
          steel: "#1e293b",   // Dark Steel
          pink: "#ff0080",    // Neon Pink
          green: "#00ff88",    // Matrix Green
          orange: "#ff6b35",   // Warning Orange
          dark: "#0a0a0f"     // Background reference
        },
        // Legacy support
        satc: { pink: "#ff0080" }
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 50%, #ff0080 100%)',
        'space-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
        'neon-glow': 'radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)',
        'quantum-bg': 'linear-gradient(45deg, #0a0a0f 0%, #1e293b 100%)',
        'cyber-mesh': 'radial-gradient(circle at 20% 80%, rgba(0,212,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,92,246,0.1) 0%, transparent 50%)'
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0,212,255,0.3)',
        'neon': '0 0 30px rgba(0,255,255,0.4)',
        'quantum': '0 0 25px rgba(139,92,246,0.3)'
      }
    },
  },
  plugins: [],
};
