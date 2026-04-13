import React, { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;

    // Reduced node count for mobile
    const NODE_COUNT = isMobile ? 25 : 40;
    const CONNECTION_DISTANCE = isMobile ? 120 : 150;
    const SKIP_FRAMES = isMobile ? 2 : 1; // render every 2nd frame on mobile

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simplified node — no per-frame gradient creation
    class Node {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 3 + 2;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
        this.pulsePhase += 0.02;
      }

      draw() {
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 1;

        if (!isMobile) {
          // Outer glow — desktop only (expensive)
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
          gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
          gradient.addColorStop(0.5, 'rgba(102, 126, 234, 0.4)');
          gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Main node
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(102, 126, 234, 1)';
        ctx.fill();

        // Inner bright core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167, 182, 255, 1)';
        ctx.fill();
      }
    }

    // Create nodes
    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push(new Node(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      ));
    }

    let animationFrameId;
    let frameCount = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      frameCount++;

      // Skip frames on mobile for 30fps instead of 60fps
      if (frameCount % SKIP_FRAMES !== 0) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      // Draw connections — O(n²) but with fewer nodes now
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy; // avoid sqrt until needed
          const maxDistSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

          if (distSq < maxDistSq) {
            const distance = Math.sqrt(distSq);
            const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.6;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Glow on close connections — desktop only
            if (!isMobile && distance < 100) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(102, 126, 234, ${opacity * 0.3})`;
              ctx.lineWidth = 4;
              ctx.stroke();
            }
          }
        }
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900 via-gray-900 to-green-900">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}
