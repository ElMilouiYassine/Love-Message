import { useState, useEffect } from "react";

export default function LoveMessage() {
    const [showHeart, setShowHeart] = useState(false);
  
    useEffect(() => {
      if (showHeart) {
        // Initialize the particle animation when the heart is shown
        const canvas = document.getElementById("pinkboard");
        const context = canvas.getContext("2d");
        let particles;
        let particleRate;
        let time;
  
        // Settings for particles
        const settings = {
          particles: {
            length: 500,
            duration: 2,
            velocity: 100,
            effect: -0.75,
            size: 30,
          },
        };
  
        // Point class for particle movement
        class Point {
          constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
          }
  
          clone() {
            return new Point(this.x, this.y);
          }
  
          length(length) {
            if (length === undefined) return Math.sqrt(this.x * this.x + this.y * this.y);
            this.normalize();
            this.x *= length;
            this.y *= length;
            return this;
          }
  
          normalize() {
            const len = this.length();
            this.x /= len;
            this.y /= len;
            return this;
          }
        }
  
        // Function to get points on a heart shape
        const pointOnHeart = (t) => {
          return new Point(
            160 * Math.pow(Math.sin(t), 3),
            130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
          );
        };
  
        // Image for particle rendering
        const image = (() => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = settings.particles.size;
          canvas.height = settings.particles.size;
  
          const to = (t) => {
            const point = pointOnHeart(t);
            point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350;
            point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350;
            return point;
          };
  
          context.beginPath();
          let t = -Math.PI;
          let point = to(t);
          context.moveTo(point.x, point.y);
          while (t < Math.PI) {
            t += 0.01;
            point = to(t);
            context.lineTo(point.x, point.y);
          }
          context.closePath();
          context.fillStyle = "#ea80b0";
          context.fill();
  
          const img = new Image();
          img.src = canvas.toDataURL();
          return img;
        })();
  
        // Handle resizing the canvas
        const onResize = () => {
          const canvas = document.getElementById("pinkboard");
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
        };
  
        // Particle pool for handling particles
        class ParticlePool {
          constructor(count) {
            this.particles = [];
            this.count = count;
          }
  
          add(x, y, vx, vy) {
            this.particles.push(new Particle(x, y, vx, vy));
          }
  
          update(deltaTime) {
            for (let i = 0; i < this.particles.length; i++) {
              this.particles[i].update(deltaTime);
              if (this.particles[i].alpha <= 0) {
                this.particles.splice(i, 1);
                i--;
              }
            }
          }
  
          draw(context, image) {
            for (let i = 0; i < this.particles.length; i++) {
              this.particles[i].draw(context, image);
            }
          }
        }
  
        // Particle class for each individual particle
        class Particle {
          constructor(x, y, vx, vy) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.alpha = 1;
            this.size = settings.particles.size;
          }
  
          update(deltaTime) {
            this.x += this.vx * deltaTime;
            this.y += this.vy * deltaTime;
            this.alpha -= deltaTime / settings.particles.duration;
          }
  
          draw(context, image) {
            context.globalAlpha = this.alpha;
            context.drawImage(image, this.x - this.size / 2, this.y - this.size / 2);
          }
        }
  
        // Initialize particle pool and particle rate
        particles = new ParticlePool(settings.particles.length);
        particleRate = settings.particles.length / settings.particles.duration;
  
        // Render function to animate particles
        const render = () => {
          requestAnimationFrame(render);
  
          const newTime = new Date().getTime() / 1000;
          const deltaTime = newTime - (time || newTime);
          time = newTime;
  
          context.clearRect(0, 0, canvas.width, canvas.height);
  
          // Create new particles
          const amount = particleRate * deltaTime;
          for (let i = 0; i < amount; i++) {
            const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
            const dir = pos.clone().length(settings.particles.velocity);
            particles.add(
              canvas.width / 2 + pos.x,
              canvas.height / 2 - pos.y,
              dir.x,
              -dir.y
            );
          }
  
          particles.update(deltaTime);
          particles.draw(context, image);
        };
  
        // Start the animation after a short delay
        setTimeout(() => {
          onResize();
          render();
        }, 10);
  
        // Handle window resize event
        window.onresize = onResize;
      }
    }, [showHeart]);
  
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-pink-50">
        <div className="relative flex items-center justify-center h-full">
          <canvas id="pinkboard" className="absolute inset-0 z-0"></canvas>
          {!showHeart ? (
            <button
              onClick={() => setShowHeart(true)}
              className="love-message-button p-4 bg-pink-400 text-white font-semibold rounded-xl shadow-lg"
            >
              J'ai quelque chose à te dire 
            </button>
          ) : (
            <div class="love-message-text">
            Je t'aime ❤️
            </div>

          )}
        </div>
      </div>
    );
  }
  