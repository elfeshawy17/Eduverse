import React, { useEffect, useRef, useState } from 'react';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const lines: Line[] = [];
    const symbols: Symbol[] = [];
    const particleCount = 25;
    const lineCount = 8;
    const symbolCount = 10;
    
    // Educational platform color palette - more refined blues with accent colors
    const colors = [
      'rgba(41, 98, 155, 0.4)',    // Deep blue
      'rgba(65, 131, 196, 0.3)',   // Medium blue
      'rgba(102, 187, 106, 0.25)', // Success green
      'rgba(94, 114, 228, 0.25)',  // Indigo
    ];
    
    // Educational symbols
    const eduSymbols = [
      '📚', '🎓', '✏️', '🔬', '🧮', '📝', '📊', '🧠', '💻', '📖'
    ];

    // Draw gradient background
    const drawBackground = () => {
      if (!canvas || !ctx) return;
      
      // Create a subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f8fafc');  // Very light blue-gray
      gradient.addColorStop(1, '#eef2f7');  // Light blue-gray
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle pattern - dots instead of grid for a more modern look
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      const dotSpacing = 25;
      const dotSize = 1;
      
      for (let x = dotSpacing; x < canvas.width; x += dotSpacing) {
        for (let y = dotSpacing; y < canvas.height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number = 0;
      speedY: number = 0;
      color: string;
      opacity: number;
      connections: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = Math.random() * 1.5 + 1;
        this.speedX = (Math.random() - 0.5) * 0.08;
        this.speedY = (Math.random() - 0.5) * 0.08;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
        this.connections = 0;
      }

      update() {
        if (!canvas) return;
        
        // Very subtle movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Boundary check with gentle bounce
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX * 0.8;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY * 0.8;
        }
        
        // Keep particles in bounds
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    class Line {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      color: string;
      width: number;
      speed: number;
      progress: number;
      maxLength: number;
      
      constructor() {
        // Start from edge of screen
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        
        if (!canvas) {
          this.startX = 0;
          this.startY = 0;
          this.endX = 0;
          this.endY = 0;
          this.maxLength = 100;
        } else {
          switch(side) {
            case 0: // top
              this.startX = Math.random() * canvas.width;
              this.startY = 0;
              break;
            case 1: // right
              this.startX = canvas.width;
              this.startY = Math.random() * canvas.height;
              break;
            case 2: // bottom
              this.startX = Math.random() * canvas.width;
              this.startY = canvas.height;
              break;
            default: // left
              this.startX = 0;
              this.startY = Math.random() * canvas.height;
              break;
          }
          
          // End point is toward center with some randomness
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const angleToCenter = Math.atan2(centerY - this.startY, centerX - this.startX);
          const distanceToCenter = Math.sqrt(
            Math.pow(centerX - this.startX, 2) + 
            Math.pow(centerY - this.startY, 2)
          );
          
          // End at 30-70% of the way to center
          const endDistance = distanceToCenter * (0.3 + Math.random() * 0.4);
          this.endX = this.startX + Math.cos(angleToCenter) * endDistance;
          this.endY = this.startY + Math.sin(angleToCenter) * endDistance;
          this.maxLength = endDistance;
        }
        
        this.color = 'rgba(41, 98, 155, 0.15)';
        this.width = Math.random() * 0.5 + 0.3;
        this.speed = Math.random() * 0.003 + 0.001;
        this.progress = 0;
      }
      
      update() {
        this.progress += this.speed;
        if (this.progress >= 1) {
          this.reset();
        }
      }
      
      reset() {
        if (!canvas) return;
        
        // Reset to a new position
        const side = Math.floor(Math.random() * 4);
        switch(side) {
          case 0: // top
            this.startX = Math.random() * canvas.width;
            this.startY = 0;
            break;
          case 1: // right
            this.startX = canvas.width;
            this.startY = Math.random() * canvas.height;
            break;
          case 2: // bottom
            this.startX = Math.random() * canvas.width;
            this.startY = canvas.height;
            break;
          default: // left
            this.startX = 0;
            this.startY = Math.random() * canvas.height;
            break;
        }
        
        // New end point
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const angleToCenter = Math.atan2(centerY - this.startY, centerX - this.startX);
        const distanceToCenter = Math.sqrt(
          Math.pow(centerX - this.startX, 2) + 
          Math.pow(centerY - this.startY, 2)
        );
        
        const endDistance = distanceToCenter * (0.3 + Math.random() * 0.4);
        this.endX = this.startX + Math.cos(angleToCenter) * endDistance;
        this.endY = this.startY + Math.sin(angleToCenter) * endDistance;
        this.maxLength = endDistance;
        this.progress = 0;
      }
      
      draw() {
        if (!ctx) return;
        
        const currentX = this.startX + (this.endX - this.startX) * this.progress;
        const currentY = this.startY + (this.endY - this.startY) * this.progress;
        
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.stroke();
      }
    }
    
    class Symbol {
      x: number;
      y: number;
      symbol: string;
      size: number;
      opacity: number;
      speed: number;
      
      constructor() {
        if (!canvas) {
          this.x = 0;
          this.y = 0;
        } else {
          // Position symbols around the edges more than the center
          const positionType = Math.random();
          if (positionType > 0.7) {
            // Near edges
            const edge = Math.floor(Math.random() * 4);
            switch(edge) {
              case 0: // top
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * (canvas.height * 0.3);
                break;
              case 1: // right
                this.x = canvas.width - (Math.random() * (canvas.width * 0.3));
                this.y = Math.random() * canvas.height;
                break;
              case 2: // bottom
                this.x = Math.random() * canvas.width;
                this.y = canvas.height - (Math.random() * (canvas.height * 0.3));
                break;
              default: // left
                this.x = Math.random() * (canvas.width * 0.3);
                this.y = Math.random() * canvas.height;
                break;
            }
          } else {
            // Anywhere else
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
          }
        }
        
        this.symbol = eduSymbols[Math.floor(Math.random() * eduSymbols.length)];
        this.size = Math.random() * 8 + 8; // Font size between 8-16px
        this.opacity = Math.random() * 0.07 + 0.03; // Very subtle
        this.speed = Math.random() * 0.0005 + 0.0001; // Very slow fade
      }
      
      update() {
        // Slowly change opacity for subtle effect
        this.opacity += Math.sin(Date.now() * this.speed) * 0.002;
        this.opacity = Math.max(0.02, Math.min(0.1, this.opacity));
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.font = `${this.size}px Arial`;
        ctx.fillStyle = `rgba(41, 98, 155, ${this.opacity})`;
        ctx.fillText(this.symbol, this.x, this.y);
      }
    }

    // Connect particles with lines if they're close enough
    const connectParticles = () => {
      if (!ctx) return;
      
      const maxDistance = 120;
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].connections = 0;
        
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only connect if within range and not too many connections
          if (distance < maxDistance && particles[i].connections < 2 && particles[j].connections < 2) {
            // Opacity based on distance
            const opacity = 0.08 * (1 - distance / maxDistance);
            
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(41, 98, 155, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            
            particles[i].connections++;
            particles[j].connections++;
          }
        }
      }
    };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Initialize lines
    for (let i = 0; i < lineCount; i++) {
      lines.push(new Line());
    }
    
    // Initialize educational symbols
    for (let i = 0; i < symbolCount; i++) {
      symbols.push(new Symbol());
    }

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Handle mouse move for subtle interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      drawBackground();
      
      // Update and draw symbols first (background layer)
      for (let i = 0; i < symbols.length; i++) {
        symbols[i].update();
        symbols[i].draw();
      }
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      // Connect particles
      connectParticles();
      
      // Update and draw lines
      for (let i = 0; i < lines.length; i++) {
        lines[i].update();
        lines[i].draw();
      }
      
      // Draw subtle radial gradient around mouse if hovering
      if (isHovering) {
        const gradient = ctx.createRadialGradient(
          mousePosition.x, mousePosition.y, 0,
          mousePosition.x, mousePosition.y, 120
        );
        gradient.addColorStop(0, 'rgba(41, 98, 155, 0.03)');
        gradient.addColorStop(1, 'rgba(41, 98, 155, 0)');
        
        ctx.beginPath();
        ctx.arc(mousePosition.x, mousePosition.y, 120, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mousePosition, isHovering]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}; 