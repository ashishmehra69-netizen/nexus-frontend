export default function NeuralBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-green-900 opacity-80"></div>
      
      {/* Animated dots */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
