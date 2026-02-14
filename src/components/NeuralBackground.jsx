export default function NeuralBackground() {
  return (
    <div 
      className="fixed inset-0 bg-red-500" 
      style={{ zIndex: 0 }}  // Changed from -1 to 0
    >
      <h1 className="text-white text-6xl p-20">NEURAL BACKGROUND TEST</h1>
    </div>
  );
}
