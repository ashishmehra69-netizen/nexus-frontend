import React from 'react';

export default function NeuralBackground() {
  return (
    <div className="fixed inset-0 z-10 overflow-hidden bg-gradient-to-br from-purple-900 via-gray-900 to-green-900">
      {/* Animated neural nodes */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-400 rounded-full" style={{animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
      <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-green-400 rounded-full" style={{animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
      <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-purple-300 rounded-full" style={{animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
      <div className="absolute top-2/3 left-2/3 w-3 h-3 bg-green-300 rounded-full" style={{animation: 'pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
      <div className="absolute top-3/4 left-1/4 w-4 h-4 bg-purple-400 rounded-full" style={{animation: 'pulse 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
      <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-green-400 rounded-full" style={{animation: 'pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
      <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-purple-300 rounded-full" style={{animation: 'pulse 3.2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
      <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-green-300 rounded-full" style={{animation: 'pulse 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <line x1="25%" y1="25%" x2="50%" y2="33%" stroke="#667eea" strokeWidth="1" className="animate-pulse" />
        <line x1="50%" y1="33%" x2="33%" y2="50%" stroke="#2de2a0" strokeWidth="1" className="animate-pulse" />
        <line x1="33%" y1="50%" x2="66%" y2="66%" stroke="#667eea" strokeWidth="1" className="animate-pulse" />
        <line x1="66%" y1="66%" x2="25%" y2="75%" stroke="#2de2a0" strokeWidth="1" className="animate-pulse" />
        <line x1="75%" y1="25%" x2="66%" y2="75%" stroke="#667eea" strokeWidth="1" className="animate-pulse" />
      </svg>
      
      </div>
  );
}
