/**
 * 粒子动画效果
 */
export class ParticleEffect {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.particleCount = 100;
    this.animationId = null;
  }

  // 创建粒子
  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // 随机颜色
      const colors = ['#1890ff', '#52c41a', '#ff4d4f', '#faad14', '#722ed1', '#ff4d4f', '#13c2c2'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // 设置粒子样式
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 10 + 2}px;
        height: ${Math.random() * 10 + 2}px;
        background-color: ${color};
        border-radius: 50%;
        opacity: ${Math.random() * 0.5 + 0.5};
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        box-shadow: 0 0 8px ${color};
      `;
      
      this.container.appendChild(particle);
      this.particles.push({
        element: particle,
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        life: 1,
        decay: Math.random() * 0.02 + 0.01
      });
    }
  }

  // 动画循环
  animate() {
    this.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= particle.decay;
      
      particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
      particle.element.style.opacity = particle.life;
      
      // 添加重力效果
      particle.vy += 0.1;
      
      // 添加阻力
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      
      // 移除生命周期结束的粒子
      if (particle.life <= 0) {
        particle.element.remove();
        this.particles.splice(index, 1);
      }
    });
    
    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }

  // 启动粒子效果
  start() {
    this.createParticles();
    this.animate();
  }

  // 停止粒子效果
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.particles.forEach(particle => {
      particle.element.remove();
    });
    this.particles = [];
  }
}

// 使用示例
export function showSuccessEffect(container) {
  const effect = new ParticleEffect(container);
  effect.start();
  
  // 2秒后自动停止
  setTimeout(() => {
    effect.stop();
  }, 2000);
}

// 显示错误效果
export function showErrorEffect(container) {
  const effect = new ParticleEffect(container);
  effect.particleCount = 50;
  effect.createParticles = function() {
    for (let i = 0; i < this.particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // 红色粒子
      const color = '#ff4d4f';
      
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 8 + 2}px;
        height: ${Math.random() * 8 + 2}px;
        background-color: ${color};
        border-radius: 50%;
        opacity: ${Math.random() * 0.5 + 0.5};
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        box-shadow: 0 0 8px ${color};
      `;
      
      this.container.appendChild(particle);
      this.particles.push({
        element: particle,
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        life: 1,
        decay: Math.random() * 0.03 + 0.01
      });
    }
  };
  
  effect.start();
  
  // 1.5秒后自动停止
  setTimeout(() => {
    effect.stop();
  }, 1500);
}