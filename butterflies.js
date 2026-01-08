// Pearl Cursor Trail Effect
// Inspired by Unseen Studio's Blossom effect

class Pearl {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.life = 1.0;
    this.decay = 0.015 + Math.random() * 0.008;
    this.size = 12 + Math.random() * 16;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    this.image = image;
    this.targetX = x;
    this.targetY = y;
    this.followSpeed = 0.04 + Math.random() * 0.04;
    this.shimmer = Math.random() * Math.PI * 2;
    this.shimmerSpeed = 0.1 + Math.random() * 0.1;
  }

  update(mouseX, mouseY) {
    // Smooth follow to mouse position with some randomness
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      const force = Math.min(distance * 0.01, 2);
      this.vx += (dx / distance) * force * this.followSpeed;
      this.vy += (dy / distance) * force * this.followSpeed;
    }

    // Add some random movement
    this.vx += (Math.random() - 0.5) * 0.2;
    this.vy += (Math.random() - 0.5) * 0.2;

    // Apply velocity with damping
    this.vx *= 0.93;
    this.vy *= 0.93;

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Slow rotation
    this.rotation += this.rotationSpeed;

    // Shimmer effect
    this.shimmer += this.shimmerSpeed;

    // Decay life
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    const alpha = Math.max(0, Math.min(this.life, 1));
    // Make shimmer less intense as life decreases
    const shimmerIntensity = (Math.sin(this.shimmer) + 1) * 0.2 + 0.6;
    // Double fade for faster disappearance
    const finalAlpha = Math.max(0, alpha * shimmerIntensity * alpha);

    ctx.globalAlpha = finalAlpha;

    if (this.image && this.image.complete) {
      // Draw pearl image
      const size = this.size;
      ctx.drawImage(this.image, -size / 2, -size / 2, size, size);
    } else {
      // Fallback: draw pearl with gradient
      const gradient = ctx.createRadialGradient(
        -this.size * 0.3, -this.size * 0.3, 0,
        0, 0, this.size / 2
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
      gradient.addColorStop(0.5, `rgba(240, 240, 250, ${alpha * 0.7})`);
      gradient.addColorStop(1, `rgba(200, 200, 220, ${alpha * 0.5})`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
      ctx.beginPath();
      ctx.arc(-this.size * 0.2, -this.size * 0.2, this.size * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  isDead() {
    return this.life <= 0;
  }
}

class PearlSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.pearls = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.animationId = null;
    this.pearlImage = new Image();
    this.pearlImage.src = '/images/pearl.png';
    
    this.setupCanvas();
    this.setupEventListeners();
    this.animate();
  }

  setupCanvas() {
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
  }

  setupEventListeners() {
    let lastTime = 0;
    const throttle = 16; // ~60fps

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTime < throttle) return;
      lastTime = now;

      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      // Create new pearl
      if (this.pearls.length < 25) {
        const offsetX = (Math.random() - 0.5) * 50;
        const offsetY = (Math.random() - 0.5) * 50;
        this.pearls.push(
          new Pearl(this.mouseX + offsetX, this.mouseY + offsetY, this.pearlImage)
        );
      }
    });

    // Reduce pearls when mouse stops
    let mouseStopTimer;
    document.addEventListener('mousemove', () => {
      clearTimeout(mouseStopTimer);
      mouseStopTimer = setTimeout(() => {
        // Gradually reduce pearls
        if (this.pearls.length > 0) {
          this.pearls = this.pearls.filter(p => p.life > 0.1);
        }
      }, 2000);
    });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Clear canvas with more aggressive fade for trail effect
    this.ctx.fillStyle = 'rgba(237, 231, 234, 0.25)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw pearls
    this.pearls = this.pearls.filter(pearl => {
      pearl.update(this.mouseX, this.mouseY);
      pearl.draw(this.ctx);
      return !pearl.isDead();
    });

    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Initialize when DOM is ready
let pearlSystem;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPearls);
} else {
  initPearls();
}

function initPearls() {
  const canvas = document.getElementById('pearlCanvas');
  if (canvas) {
    pearlSystem = new PearlSystem(canvas);
  }
}
