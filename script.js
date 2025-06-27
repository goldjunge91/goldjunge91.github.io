// Three.js Scene Setup
let scene, camera, renderer, stars = [], loadingObject;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Loading Progress
let loadingProgress = 0;
const loadingDuration = 3000; // 3 seconds

// Initialize Everything
document.addEventListener('DOMContentLoaded', function() {
    initLoading();
    initTheme();
    initNavigation();
    initAnimations();
    startLoading();
});

// Loading Screen with 3D Effects
function initLoading() {
    const loadingContainer = document.getElementById('loading-3d');
    
    // Create Three.js scene for loading
    const loadingScene = new THREE.Scene();
    const loadingCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const loadingRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    loadingRenderer.setSize(128, 128);
    loadingRenderer.setClearColor(0x000000, 0);
    loadingContainer.appendChild(loadingRenderer.domElement);
    
    // Create spinning energy ball
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    loadingObject = new THREE.Mesh(geometry, material);
    loadingScene.add(loadingObject);
    
    // Add particles around the energy ball
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xb300ff,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    loadingScene.add(particles);
    
    loadingCamera.position.z = 3;
    
    // Animation loop for loading screen
    function animateLoading() {
        if (loadingObject) {
            loadingObject.rotation.x += 0.02;
            loadingObject.rotation.y += 0.02;
            particles.rotation.x -= 0.01;
            particles.rotation.y += 0.01;
            
            loadingRenderer.render(loadingScene, loadingCamera);
            requestAnimationFrame(animateLoading);
        }
    }
    
    animateLoading();
}

// Start Loading Process
function startLoading() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const startTime = Date.now();
    
    function updateProgress() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / loadingDuration, 1);
        
        progressFill.style.width = `${progress * 100}%`;
        progressText.textContent = `${Math.round(progress * 100)}%`;
        
        if (progress < 1) {
            requestAnimationFrame(updateProgress);
        } else {
            setTimeout(finishLoading, 500);
        }
    }
    
    updateProgress();
}

// Finish Loading and Show Main Content
function finishLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
            loadingScreen.style.display = 'none';
            loadingObject = null;
            initStarField();
            initScrollAnimations();
        }
    });
}

// Initialize Star Field Background
function initStarField() {
    const container = document.getElementById('star-field');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create stars
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2000;
        positions[i + 1] = (Math.random() - 0.5) * 2000;
        positions[i + 2] = (Math.random() - 0.5) * 2000;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        transparent: true,
        opacity: 0.8
    });
    
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    
    // Add some colored stars
    const coloredStarGeometry = new THREE.BufferGeometry();
    const coloredStarCount = 100;
    const coloredPositions = new Float32Array(coloredStarCount * 3);
    const colors = new Float32Array(coloredStarCount * 3);
    
    for (let i = 0; i < coloredStarCount * 3; i += 3) {
        coloredPositions[i] = (Math.random() - 0.5) * 2000;
        coloredPositions[i + 1] = (Math.random() - 0.5) * 2000;
        coloredPositions[i + 2] = (Math.random() - 0.5) * 2000;
        
        // Random colors between blue and purple
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.3 + 0.5, 1, 0.5);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }
    
    coloredStarGeometry.setAttribute('position', new THREE.BufferAttribute(coloredPositions, 3));
    coloredStarGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const coloredStarMaterial = new THREE.PointsMaterial({
        size: 3,
        transparent: true,
        opacity: 0.8,
        vertexColors: true
    });
    
    const coloredStarField = new THREE.Points(coloredStarGeometry, coloredStarMaterial);
    scene.add(coloredStarField);
    
    camera.position.z = 1000;
    
    // Mouse movement effect
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    
    // Animation loop
    animate();
}

// Mouse Movement Handler
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
}

// Window Resize Handler
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate camera based on mouse movement
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Rotate star fields
    scene.children.forEach(child => {
        if (child instanceof THREE.Points) {
            child.rotation.x += 0.0005;
            child.rotation.y += 0.001;
        }
    });
    
    renderer.render(scene, camera);
}

// Theme Toggle
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    // Check for saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.toggle('dark', savedTheme === 'dark');
    updateThemeIcon(savedTheme === 'dark');
    
    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
        
        // Animate theme change
        gsap.to(body, {
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    function updateThemeIcon(isDark) {
        themeIcon.className = isDark ? 'fas fa-sun text-yellow-400' : 'fas fa-moon text-blue-400';
    }
}

// Navigation
function initNavigation() {
    // Star button navigation
    const starButtons = document.querySelectorAll('.star-button');
    
    starButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            const section = document.getElementById(target);
            
            if (section) {
                // Add click animation
                gsap.to(button, {
                    scale: 0.9,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out"
                });
                
                // Smooth scroll to section
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Create particle effect
                createParticleEffect(button);
            }
        });
        
        // Hover effects
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                y: -10,
                rotationX: 10,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                y: 0,
                rotationX: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Regular navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            const section = document.getElementById(target);
            
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Create Particle Effect
function createParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        
        document.body.appendChild(particle);
        
        // Animate particle
        gsap.to(particle, {
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            opacity: 0,
            scale: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => particle.remove()
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    // Fade in animations for sections
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.fromTo(entry.target.children, 
                    {
                        opacity: 0,
                        y: 50
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.2,
                        ease: "power2.out"
                    }
                );
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.getElementById('home');
        
        if (heroSection) {
            gsap.to(heroSection, {
                transform: `translateY(${scrolled * 0.5}px)`,
                duration: 0.1
            });
        }
    });
}

// General Animations
function initAnimations() {
    // Floating animation for cards
    const cards = document.querySelectorAll('.skill-card, .project-card');
    
    cards.forEach((card, index) => {
        gsap.to(card, {
            y: -10,
            duration: 2 + Math.random(),
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: index * 0.1
        });
    });
    
    // Glitch effect for title
    const title = document.querySelector('h1');
    if (title) {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                title.classList.add('glitch');
                title.setAttribute('data-text', title.textContent);
                setTimeout(() => title.classList.remove('glitch'), 500);
            }
        }, 3000);
    }
}

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add success animation
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            button.textContent = 'Gesendet! ✨';
            button.style.background = 'linear-gradient(45deg, #10b981, #059669)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                this.reset();
            }, 2000);
        });
    }
});

// Performance optimization
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    // Update any performance-heavy animations here
    ticking = false;
}

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        // Add any critical images here
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadResources();

// Add smooth reveal animations for elements
gsap.registerPlugin(ScrollTrigger);

// Error handling for Three.js
window.addEventListener('error', function(e) {
    if (e.message.includes('WebGL')) {
        console.warn('WebGL not supported, falling back to CSS animations');
        document.body.classList.add('no-webgl');
    }
});

// Responsive handling
function handleResize() {
    if (renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

window.addEventListener('resize', handleResize);

// Add custom cursor effect
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
    }
});

console.log('🚀 3D Portfolio loaded successfully!');