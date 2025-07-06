// Modern JavaScript for goldjunge91 Portfolio - Inspired by snp.agency

// Global variables
let scene, camera, renderer, particles;
let preloaderScene, preloaderCamera, preloaderRenderer, preloaderParticles;
let isLoaded = false;
let currentTheme = 'light';

// DOM elements
const preloader = document.getElementById('preloader');
const counter = document.getElementById('counter');
const progressFill = document.getElementById('progress-fill');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const nav = document.getElementById('nav');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPreloaderAnimation();
    initPreloader();
    initTheme();
    initNavigation();
    initThreeJS();
    initScrollAnimations();
    initFormHandler();
});

// Initialize spectacular preloader animation
function initPreloaderAnimation() {
    const canvas = document.getElementById('preloader-canvas');
    if (!canvas) return;
    
    // Setup Three.js scene for preloader
    preloaderScene = new THREE.Scene();
    preloaderCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    preloaderRenderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    
    preloaderRenderer.setSize(window.innerWidth, window.innerHeight);
    preloaderRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create spectacular particle system
    createPreloaderParticles();
    
    // Camera position
    preloaderCamera.position.z = 5;
    
    // Mouse interaction
    let mouse = { x: 0, y: 0 };
    let mouseTarget = { x: 0, y: 0 };
    
    document.addEventListener('mousemove', (event) => {
        mouseTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseTarget.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop for preloader
    let time = 0;
    function animatePreloader() {
        if (!preloaderParticles) return;
        
        time += 0.01;
        
        // Smooth mouse following
        mouse.x += (mouseTarget.x - mouse.x) * 0.05;
        mouse.y += (mouseTarget.y - mouse.y) * 0.05;
        
        // Animate particles
        if (preloaderParticles.length) {
            preloaderParticles.forEach((particleSystem, index) => {
                particleSystem.rotation.x = time * 0.2 + index * 0.1;
                particleSystem.rotation.y = time * 0.3 + index * 0.15;
                particleSystem.rotation.z = time * 0.1 + index * 0.05;
                
                // Mouse interaction
                particleSystem.position.x = Math.sin(time + index) * 0.5 + mouse.x * 0.3;
                particleSystem.position.y = Math.cos(time + index) * 0.3 + mouse.y * 0.2;
            });
        }
        
        preloaderRenderer.render(preloaderScene, preloaderCamera);
        
        if (preloader && preloader.style.display !== 'none') {
            requestAnimationFrame(animatePreloader);
        }
    }
    
    animatePreloader();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        preloaderCamera.aspect = window.innerWidth / window.innerHeight;
        preloaderCamera.updateProjectionMatrix();
        preloaderRenderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Create spectacular particle systems for preloader
function createPreloaderParticles() {
    preloaderParticles = [];
    
    // Create multiple particle systems with different properties
    const particleConfigs = [
        { count: 800, size: 0.01, color: 0x3b82f6, speed: 1, spread: 8 },
        { count: 600, size: 0.015, color: 0x8b5cf6, speed: 2.8, spread: 50 },
        { count: 400, size: 0.02, color: 0x10b981, speed: 1.6, spread: 100 },
        { count: 200, size: 0.025, color: 0xffffff, speed: 2.4, spread: 100 }
    ];
    
    particleConfigs.forEach((config, index) => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(config.count * 3);
        const colors = new Float32Array(config.count * 3);
        const sizes = new Float32Array(config.count);
        const velocities = new Float32Array(config.count * 3);
        
        const color = new THREE.Color(config.color);
        
        for (let i = 0; i < config.count; i++) {
            const i3 = i * 3;
            
            // Position - create spiral galaxy effect
            const radius = Math.random() * config.spread;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 4;
            
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = height;
            positions[i3 + 2] = Math.sin(angle) * radius;
            
            // Velocities for movement
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
            
            // Colors with variation
            const colorVariation = 1 + (Math.random() - 0.5) * 0.3;
            colors[i3] = color.r * colorVariation;
            colors[i3 + 1] = color.g * colorVariation;
            colors[i3 + 2] = color.b * colorVariation;
            
            // Sizes - much smaller particles
            sizes[i] = config.size * (0.1 + Math.random() * 0.3);
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: config.size * 0.5, // Even smaller base size
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        const particleSystem = new THREE.Points(geometry, material);
        particleSystem.userData = { velocities, config };
        preloaderScene.add(particleSystem);
        preloaderParticles.push(particleSystem);
    });
    
    // Add animated lights
    const light1 = new THREE.PointLight(0x3b82f6, 1, 100);
    light1.position.set(10, 10, 10);
    preloaderScene.add(light1);
    
    const light2 = new THREE.PointLight(0x8b5cf6, 1, 100);
    light2.position.set(-10, -10, 10);
    preloaderScene.add(light2);
    
    // Animate lights
    gsap.to(light1.position, {
        duration: 4,
        x: -10,
        y: -10,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
    
    gsap.to(light2.position, {
        duration: 3,
        x: 10,
        y: 10,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
}

// Enhanced preloader with progress and effects
function initPreloader() {
    let count = 0;
    const targetCount = 100;
    const duration = 3000; // 3 seconds for more dramatic effect
    const increment = targetCount / (duration / 16); // 60fps

    function updateCounter() {
        count += increment;
        if (count >= targetCount) {
            count = targetCount;
            counter.textContent = String(count).padStart(2, '0');
            progressFill.style.width = '100%';
            
            // Add dramatic pause before hiding
            setTimeout(hidePreloader, 800);
            return;
        }
        
        counter.textContent = String(Math.floor(count)).padStart(2, '0');
        progressFill.style.width = `${count}%`;
        
        // Add particle burst effect at certain milestones
        if (Math.floor(count) % 20 === 0 && Math.floor(count) > 0) {
            createParticleBurst();
        }
        
        requestAnimationFrame(updateCounter);
    }

    // Start counting after particles are initialized
    setTimeout(updateCounter, 1000);
}

// Create particle burst effect for milestones
function createParticleBurst() {
    const particlesContainer = document.getElementById('preloader-particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            border-radius: 50%;
            left: 50%;
            top: 50%;
            pointer-events: none;
            animation: particleFloat 2s ease-out forwards;
            animation-delay: ${i * 0.1}s;
        `;
        
        const angle = (i / 10) * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        
        particle.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--end-y', `${Math.sin(angle) * distance}px`);
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 2000);
    }
}

// Enhanced hide preloader with spectacular exit animation
function hidePreloader() {
    // Create final explosion effect
    createFinalExplosion();
    
    // Animate preloader elements out
    const tl = gsap.timeline();
    
    tl.to('.preloader-progress', {
        scaleX: 0,
        duration: 0.3,
        ease: "power2.in"
    })
    .to('.preloader-counter', {
        scale: 0,
        rotation: 360,
        duration: 0.5,
        ease: "back.in(1.7)"
    }, "-=0.2")
    .to('.preloader-subtitle', {
        y: -50,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
    }, "-=0.3")
    .to('.preloader-logo', {
        scale: 0,
        rotation: -360,
        duration: 0.6,
        ease: "back.in(1.7)"
    }, "-=0.2")
    .to(preloader, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
            preloader.style.display = 'none';
            isLoaded = true;
            // Clean up preloader scene
            if (preloaderRenderer) {
                preloaderRenderer.dispose();
                preloaderRenderer = null;
            }
            // Start main animations
            animateHeroContent();
            if (particles) {
                animateParticles();
            }
        }
    }, "-=0.5");
}

// Create final explosion effect
function createFinalExplosion() {
    const particlesContainer = document.getElementById('preloader-particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        const size = 2 + Math.random() * 6;
        const hue = Math.random() * 360;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: hsl(${hue}, 70%, 60%);
            border-radius: 50%;
            left: 50%;
            top: 50%;
            pointer-events: none;
            box-shadow: 0 0 10px hsl(${hue}, 70%, 60%);
        `;
        
        const angle = (i / 30) * Math.PI * 2;
        const distance = 150 + Math.random() * 200;
        const duration = 1 + Math.random() * 0.5;
        
        particlesContainer.appendChild(particle);
        
        gsap.to(particle, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            scale: 0,
            opacity: 0,
            duration: duration,
            ease: "power2.out",
            onComplete: () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }
        });
    }
}

// Initialize theme system
function initTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    // Theme toggle event
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}

// Apply theme with smooth transitions
function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme icon
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    
    // Update Three.js scene if it exists
    if (scene && particles) {
        updateParticleColors(theme);
    }
}

// Initialize navigation with scroll effects
function initNavigation() {
    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: targetElement, offsetY: 80 },
                    ease: "power2.out"
                });
            }
        });
    });
    
    // Navigation scroll effects
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Navigation background blur effect
        if (currentScrollY > 50) {
            nav.style.background = currentTheme === 'light' 
                ? 'rgba(255, 255, 255, 0.95)' 
                : 'rgba(0, 0, 0, 0.95)';
        } else {
            nav.style.background = currentTheme === 'light' 
                ? 'rgba(255, 255, 255, 0.8)' 
                : 'rgba(0, 0, 0, 0.8)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Initialize Three.js scene
function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvas.appendChild(renderer.domElement);
    
    // Create particle system
    createParticles();
    
    // Camera position
    camera.position.z = 5;
    
    // Mouse interaction
    let mouse = { x: 0, y: 0 };
    let mouseTarget = { x: 0, y: 0 };
    
    document.addEventListener('mousemove', (event) => {
        mouseTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseTarget.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth mouse following
        mouse.x += (mouseTarget.x - mouse.x) * 0.02;
        mouse.y += (mouseTarget.y - mouse.y) * 0.02;
        
        // Rotate particles based on mouse position
        if (particles && isLoaded) {
            particles.rotation.x = mouse.y * 0.1;
            particles.rotation.y = mouse.x * 0.1;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Create particle system
function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 500;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Position
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
        
        // Color
        color.setHSL(0.6, 0.8, Math.random() * 0.5 + 0.5);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        // Size - much smaller
        sizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
        size: 0.02, // Much smaller size
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Update particle colors based on theme
function updateParticleColors(theme) {
    if (!particles) return;
    
    const colors = particles.geometry.attributes.color;
    const color = new THREE.Color();
    
    for (let i = 0; i < colors.count; i++) {
        if (theme === 'dark') {
            color.setHSL(0.6, 0.8, Math.random() * 0.3 + 0.7);
        } else {
            color.setHSL(0.6, 0.8, Math.random() * 0.3 + 0.2);
        }
        
        colors.setXYZ(i, color.r, color.g, color.b);
    }
    
    colors.needsUpdate = true;
}

// Animate particles
function animateParticles() {
    if (!particles) return;
    
    gsap.to(particles.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none"
    });
    
    gsap.to(particles.position, {
        y: "+=0.5",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
}

// Animate hero content
function animateHeroContent() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroCTA = document.querySelector('.hero-cta');
    
    const tl = gsap.timeline();
    
    tl.from(heroTitle, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    })
    .from(heroSubtitle, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8")
    .from(heroDescription, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.6")
    .from(heroCTA.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    }, "-=0.4");
}

// Initialize scroll animations
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    gsap.utils.toArray('.section').forEach(section => {
        gsap.from(section, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // Animate project cards
    gsap.utils.toArray('.project-card').forEach(card => {
        gsap.from(card, {
            y: 80,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // Animate skill cards
    gsap.utils.toArray('.skill-card').forEach(card => {
        gsap.from(card, {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // Parallax effect for sections
    gsap.utils.toArray('.section').forEach(section => {
        gsap.to(section, {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
}

// Form handler
function initFormHandler() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        button.textContent = 'Sending...';
        button.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            gsap.to(form, {
                scale: 0.95,
                opacity: 0.7,
                duration: 0.3,
                onComplete: () => {
                    button.textContent = 'Message Sent!';
                    button.style.background = 'var(--accent-green)';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.background = '';
                        button.disabled = false;
                        form.reset();
                        
                        gsap.to(form, {
                            scale: 1,
                            opacity: 1,
                            duration: 0.3
                        });
                    }, 2000);
                }
            });
            
        } catch (error) {
            console.error('Form submission error:', error);
            button.textContent = 'Error - Try Again';
            button.disabled = false;
            
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }
    });
}

// Add hover effects for interactive elements
function addHoverEffects() {
    // Button hover effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Card hover effects
    document.querySelectorAll('.project-card, .skill-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// Add interaction effects after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addHoverEffects, 100);
});

// Smooth scrolling for all internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: targetElement, offsetY: 80 },
                ease: "power2.out"
            });
        }
    }
});

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Reduce particle count on mobile
    if (window.innerWidth < 768 && particles) {
        particles.material.opacity = 0.3;
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Export for external use
window.portfolioApp = {
    currentTheme,
    applyTheme,
    particles,
    scene,
    camera,
    renderer
};

console.log('Preloader Renderer:', preloaderRenderer);
console.log('Preloader Particles:', preloaderParticles);
console.log('Preloader Scene:', preloaderScene);
console.log('Preloader Camera:', preloaderCamera);
