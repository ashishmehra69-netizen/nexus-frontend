import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function NeuralNode({ position, color }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
  });
  
  return (
    <Sphere ref={meshRef} position={position} args={[0.1, 32, 32]}>
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
}

function NeuralConnection({ start, end }) {
  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ];
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#667eea" opacity={0.3} transparent />
    </line>
  );
}

function NeuralNetwork() {
  // Define node positions (input layer, hidden layers, output layer)
  const nodes = [
    // Input layer
    { pos: [-4, 2, 0], color: '#667eea' },
    { pos: [-4, 0, 0], color: '#667eea' },
    { pos: [-4, -2, 0], color: '#667eea' },
    
    // Hidden layer 1
    { pos: [-2, 2.5, 0], color: '#2de2a0' },
    { pos: [-2, 0.5, 0], color: '#667eea' },
    { pos: [-2, -1.5, 0], color: '#2de2a0' },
    
    // Hidden layer 2
    { pos: [0, 2, 0], color: '#667eea' },
    { pos: [0, 0, 0], color: '#2de2a0' },
    { pos: [0, -2, 0], color: '#667eea' },
    
    // Output layer
    { pos: [2, 1, 0], color: '#2de2a0' },
    { pos: [2, -1, 0], color: '#667eea' },
  ];
  
  const connections = [
    [[-4, 2, 0], [-2, 2.5, 0]],
    [[-4, 0, 0], [-2, 0.5, 0]],
    [[-4, -2, 0], [-2, -1.5, 0]],
    [[-2, 2.5, 0], [0, 2, 0]],
    [[-2, 0.5, 0], [0, 0, 0]],
    [[-2, -1.5, 0], [0, -2, 0]],
    [[0, 2, 0], [2, 1, 0]],
    [[0, -2, 0], [2, -1, 0]],
  ];
  
  return (
    <>
      {nodes.map((node, i) => (
        <NeuralNode key={i} position={node.pos} color={node.color} />
      ))}
      {connections.map((conn, i) => (
        <NeuralConnection key={i} start={conn[0]} end={conn[1]} />
      ))}
    </>
  );
}

export default function NeuralBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <NeuralNetwork />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
