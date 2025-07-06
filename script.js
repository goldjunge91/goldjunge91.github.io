// script.js

// Import Locomotive Scroll
import LocomotiveScroll from 'locomotive-scroll';

// Three.js Scene Setup
let scene, camera, renderer, stars = [], loadingObject;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let scroll; // Declare locomotive scroll instance

// Loading Progress
let loadingProgress = 0;
const loadingDuration = 2500; // Faster loading for immersive feel

// Initialize Everything
document.addEventListener('DOMContentLoaded', function() {
    initLoading();
    initTheme();
    initNavigation();
    initAnimations();
    startLoading();
});

// Loading Screen with 3D Effects (more vibrant/prominent)
function initLoading() {
    const loadingContainer = document.getElementById('loading-3d');
    
    // Create Three.js scene for loading
    const loadingScene = new THREE.Scene();
    const loadingCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const loadingRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    loadingRenderer.setSize(128, 128);
    loadingRenderer.setClearColor(0x000000, 0); // Transparent background
    loadingContainer.appendChild(loadingRenderer.domElement);
    
    // Create spinning energy ball (vibrant neon)
    const geometry = new THREE.IcosahedronGeometry(1.2, 1); // Slightly larger
    const material = new THREE.MeshBasicMaterial({
        color: 0x00f5ff, // Neon Blue
        wireframe: true,
        transparent: true,
        opacity: 0.9 // Higher opacity for prominence
    });
    
    loadingObject = new THREE.Mesh(geometry, material);
    loadingScene.add(loadingObject);
    
    // Add particles around the energy ball (vibrant neon)
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 80; // More particles
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 8; // Wider spread
        positions[i + 1] = (Math.random() - 0.5) * 8;
        positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xb300ff, // Neon Purple
        size: 0.2, // Larger particle size
        transparent: true,
        opacity: 0.8 // Higher opacity
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
            setTimeout(finishLoading, 300); // Shorter delay after full progress
        }
    }
    
    updateProgress();
}

// Finish Loading and Show Main Content
function finishLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    gsap.to(loadingScreen, {
        opacity: 0,
        duration: 0.8, // Faster fade out
        ease: "power2.out",
        onComplete: () => {
            loadingScreen.style.display = 'none';
            loadingObject = null; // Clean up loading object to stop animation
            initStarField();
            initLocomotiveScroll(); // Initialize Locomotive Scroll here
            initScrollAnimations(); // These will now work with LS
        }
    });
}

// Initialize Star Field Background (more immersive)
function initStarField() {
    const container = document.getElementById('star-field');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    
    // Create stars (more of them, larger, prominent white)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1200; // Increased star count
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 2500; // Wider spread
        positions[i + 1] = (Math.random() - 0.5) * 2500;
        positions[i + 2] = (Math.random() - 0.5) * 2500;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xf0f0f0, // Light text color (prominent white)
        size: 2.5, // Larger size
        transparent: true,
        opacity: 0.9 // Higher opacity
    });
    
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    
    // Add some colored stars (vibrant neon)
    const coloredStarGeometry = new THREE.BufferGeometry();
    const coloredStarCount = 150; // More colored stars
    const coloredPositions = new Float32Array(coloredStarCount * 3);
    const colors = new Float32Array(coloredStarCount * 3);
    
    const neonBlue = new THREE.Color(0x00f5ff);
    const neonPurple = new THREE.Color(0xb300ff);
    
    for (let i = 0; i < coloredStarCount * 3; i += 3) {
        coloredPositions[i] = (Math.random() - 0.5) * 2500;
        coloredPositions[i + 1] = (Math.random() - 0.5) * 2500;
        coloredPositions[i + 2] = (Math.random() - 0.5) * 2500;
        
        // Blend between neon blue and neon purple
        const mixRatio = Math.random();
        const color = new THREE.Color().copy(neonBlue).lerp(neonPurple, mixRatio);
        
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }
    
    coloredStarGeometry.setAttribute('position', new THREE.BufferAttribute(coloredPositions, 3));
    coloredStarGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const coloredStarMaterial = new THREE.PointsMaterial({
        size: 3.5, // Larger size
        transparent: true,
        opacity: 1, // Full opacity
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

// Mouse Movement Handler (more sensitive for immersive feel)
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.0005; // Increased multiplier
    mouseY = (event.clientY - windowHalfY) * 0.0005; // Increased multiplier
}

// Window Resize Handler
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Update Locomotive Scroll if present
    if (scroll) {
        scroll.update();
    }
}

// Animation Loop (more dynamic rotation for stars)
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate camera based on mouse movement
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Rotate star fields more dynamically
    scene.children.forEach(child => {
        if (child instanceof THREE.Points) {
            child.rotation.x += 0.0003; // Faster rotation
            child.rotation.y += 0.0005; // Faster rotation
        }
    });
    
    renderer.render(scene, camera);
}

// Initialize Locomotive Scroll
function initLocomotiveScroll() {
    scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        lerp: 0.08, // Adjust for smoother or snappier scroll
        getDirection: true, // Get scroll direction
        getSpeed: true, // Get scroll speed
        // Add other options as needed
        // For debugging: debug: true,
    });

    // Update ScrollTrigger on Locomotive Scroll events
    scroll.on('scroll', ScrollTrigger.update);

    // Pinning with ScrollTrigger and Locomotive Scroll
    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
        scrollTop(value) {
            if (arguments.length) {
                scroll.scrollTo(value, { duration: 0, disableLerp: true });
            }
            return scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
    });

    // Refresh ScrollTrigger and Locomotive Scroll on window resize
    ScrollTrigger.addEventListener('refresh', () => scroll.update());
    ScrollTrigger.refresh();
}


// Theme Toggle (Updated for new color palette)
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    const applyTheme = (isDark) => {
        if (isDark) {
            body.classList.add('dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeIcon.style.color = '#f0f0f0'; // Light text color for sun icon
        } else {
            body.classList.remove('dark');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            themeIcon.style.color = '#101010'; // Dark text color for moon icon (if light mode is ever fully implemented)
        }
    };

    // Default to dark mode for this immersive design
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme === 'dark');
    
    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        applyTheme(isDark);
    });
}

// Navigation
function initNavigation() {
    // Star button navigation (more dramatic hover)
    const starButtons = document.querySelectorAll('.star-button');
    
    starButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            const section = document.getElementById(target);
            
            if (section && scroll) { // Ensure Locomotive Scroll is initialized
                gsap.to(button, {
                    scale: 0.9,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out"
                });
                // Use Locomotive Scroll for smooth scrolling
                scroll.scrollTo(section, {
                    duration: 1000,
                    easing: [0.77, 0, 0.175, 1] // snp.agency-like easing
                });
                
                createParticleEffect(button);
            }
        });
        
        // Hover effects (more pronounced)
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                y: -10, // More lift
                rotationX: 10, // Reintroduce subtle rotation
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
            
            if (section && scroll) { // Ensure Locomotive Scroll is initialized
                scroll.scrollTo(section, {
                    duration: 1000,
                    easing: [0.77, 0, 0.175, 1]
                });
            } else if (section) { // Fallback if LS not active
                 section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Create Particle Effect (more vibrant and expansive)
function createParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 15; i++) { // More particles
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = Math.random() * 5 + 2 + 'px'; // Larger particles
        particle.style.height = particle.style.width;
        
        // Use neon colors
        particle.style.backgroundColor = Math.random() > 0.5 ? '#00f5ff' : '#b300ff'; // Mix neon blue/purple
        
        document.body.appendChild(particle);
        
        // Animate particle (more expansive movement)
        gsap.to(particle, {
            x: (Math.random() - 0.5) * 300, // Wider spread
            y: (Math.random() - 0.5) * 300, // Wider spread
            opacity: 0,
            scale: 0,
            duration: 1.2, // Longer duration for effect
            ease: "power3.out", // Stronger ease
            onComplete: () => particle.remove()
        });
    }
}

// Scroll Animations (Leveraging ScrollTrigger with Locomotive Scroll)
function initScrollAnimations() {
    // Fade in animations for sections (remains, now powered by ScrollTrigger/Locomotive Scroll)
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        gsap.from(section.children, {
            opacity: 0,
            y: 100, // Stronger starting position
            duration: 1.5, // Longer duration
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                scroller: '[data-scroll-container]', // Link to Locomotive Scroll
                start: 'top 80%', // When top of section is 80% from viewport top
                end: 'bottom top',
                // For debugging: markers: true
            }
        });
    });
    
    // Parallax effect for hero section is now handled by data-scroll-speed in index.html
}

// General Animations
function initAnimations() {
    // Floating animation for cards (re-introducing subtly for dynamism)
    const cards = document.querySelectorAll('.skill-card, .project-card');
    
    cards.forEach((card, index) => {
        gsap.to(card, {
            y: -5, // Subtle floating
            duration: 2.5 + Math.random(), // Varied duration
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut", // Smooth sine wave
            delay: index * 0.1
        });
    });

    // Glitch effect for title (reintroducing for immersive/techy feel)
    const title = document.querySelector('h1');
    if (title) {
        setInterval(() => {
            if (Math.random() < 0.2) { // Higher chance for glitch
                title.classList.add('glitch');
                // For actual glitch text, might need a separate JS library or more complex CSS animation
                setTimeout(() => title.classList.remove('glitch'), 300); // Shorter glitch duration
            }
        }, 1500); // More frequent checks
    }
}

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            button.textContent = 'GESENDET! ✨'; // More impactful text
            button.style.background = '#00f5ff'; // Neon blue for success
            
            gsap.to(button, {
                scale: 1.05,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = ''; // Reset background (will be handled by CSS if defined)
                this.reset();
            }, 2500); // Longer display
        });
    }
});

// Performance optimization (remains as is)
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    ticking = false;
}

// Preload critical resources (remains as is)
function preloadResources() {
    const criticalImages = [
        // Add any critical images here, e.g., your service images from index.html
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadResources();

// Error handling for Three.js (remains as is)
window.addEventListener('error', function(e) {
    if (e.message.includes('WebGL')) {
        console.warn('WebGL not supported, falling back to CSS animations');
        document.body.classList.add('no-webgl');
    }
});

// Responsive handling (remains as is, now includes LS update)
// handleResize function is already added to window.addEventListener('resize') earlier

// Add custom cursor effect (visual styling should be in styles.css)
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.08, // Snappier movement
            ease: "power2.out"
        });
    }
});

console.log('🚀 Immersive 3D Portfolio loaded successfully!');