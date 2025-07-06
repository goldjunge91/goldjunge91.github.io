import * as THREE    from 'three';
import { gsap }      from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initDrone, updateDrone, focusDrone, interactiveDrone } from './drone.js';

// Three.js Scene Setup
let scene, camera, renderer, stars = [], loadingObject;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Loading Progress
let loadingProgress = 0;
const loadingDuration = 1500; // 1.5 Sekunden - sichtbar aber nicht zu lang

// Initialisierung aller Komponenten
document.addEventListener('DOMContentLoaded', function() {
    // Ladebildschirm starten und danach alles andere
    initLoading();
    initTheme();
    initNavigation();
    initAnimations();
    startLoading();
});

// Ladebildschirm sofort verstecken
function hideLodingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

// Ladebildschirm mit 3D-Effekten
function initLoading() {
    const loadingContainer = document.getElementById('loading-3d');
    
    // Three.js-Szene für den Ladebildschirm erstellen
    const loadingScene = new THREE.Scene();
    const loadingCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const loadingRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    loadingRenderer.setSize(128, 128);
    loadingRenderer.setClearColor(0x000000, 0);
    loadingContainer.appendChild(loadingRenderer.domElement);
    
    // Spinnenden Energieball erstellen
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    loadingObject = new THREE.Mesh(geometry, material);
    loadingScene.add(loadingObject);
    
    // Partikel um den Energieball hinzufügen
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
    
    // Animations-Loop für den Ladebildschirm
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

// Ladevorgang starten
function startLoading() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const startTime = Date.now();
    
    function updateProgress() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / loadingDuration, 1);
        
        if (progressFill) progressFill.style.width = `${progress * 100}%`;
        if (progressText) progressText.textContent = `${Math.round(progress * 100)}%`;
        
        if (progress < 1) {
            requestAnimationFrame(updateProgress);
        } else {
            // Nach 1.5 Sekunden beenden
            setTimeout(finishLoading, 500);
         }
    }
    
    updateProgress();
}

// Ladevorgang beenden und Hauptinhalt anzeigen
function finishLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
            loadingScreen.style.display = 'none';
            loadingObject = null;
            initThreeJSScene(); // Ruft die neue zentrale Szene-Initialisierungsfunktion auf
            initScrollAnimations(); // Startet die Scroll-Animationen
        }
    });
}

// Zentrale Three.js-Szene initialisieren (ersetzt initStarField)
function initThreeJSScene() {
    const container = document.getElementById('star-field');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lichter hinzufügen
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00d4ff, 3, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Echte Drohne sofort laden
    initDrone(scene);

     // Sterne erstellen (bestehender Code)
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
    
    // Farbige Sterne hinzufügen (bestehender Code)
    const coloredStarGeometry = new THREE.BufferGeometry();
    const coloredStarCount = 100;
    const coloredPositions = new Float32Array(coloredStarCount * 3);
    const colors = new Float32Array(coloredStarCount * 3);
    
    for (let i = 0; i < coloredStarCount * 3; i += 3) {
        coloredPositions[i] = (Math.random() - 0.5) * 2000;
        coloredPositions[i + 1] = (Math.random() - 0.5) * 2000;
        coloredPositions[i + 2] = (Math.random() - 0.5) * 2000;
        
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
    
    // Setzt die initiale Kameraposition und FOV
    camera.position.set(0, -250, 800); // Weiter weg damit Drohne gut sichtbar ist
    camera.fov = 75; 
    camera.updateProjectionMatrix(); 
    
    // Mausbewegungs-Effekt
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    
    // Animations-Loop
    animate();
}

 // Animations-Loop
 function animate() {
     requestAnimationFrame(animate);

     // Kamera basierend auf Mausbewegung rotieren
     camera.position.x += (mouseX - camera.position.x) * 0.01;
     camera.position.y += (-mouseY - camera.position.y) * 0.01;

     // Drohne updaten
     updateDrone(mouseX, mouseY);

     // Sternenfelder rotieren
     scene.children.forEach(child => {
         if (child instanceof THREE.Points) {
             child.rotation.x += 0.0005;
             child.rotation.y += 0.001;
         }
     });
     renderer.render(scene, camera);
 }

// Mausbewegungs-Handler
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
}

// Fenstergröße ändern Handler
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Theme-Umschalter
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    // Gespeichertes Theme überprüfen oder Standard auf dunkel setzen
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.toggle('dark', savedTheme === 'dark');
    updateThemeIcon(savedTheme === 'dark');
    
    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
        
        // Theme-Wechsel animieren
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
     const starButtons = document.querySelectorAll('.star-button');
     
     starButtons.forEach(button => {
         button.addEventListener('click', () => {
             const target = button.getAttribute('data-target');
             const section = document.getElementById(target);
             
             if (section) {
                 gsap.to(button, {
                     scale: 0.9,
                     duration: 0.1,
                     yoyo: true,
                     repeat: 1,
                     ease: "power2.out"
                 });
                 
                 section.scrollIntoView({
                     behavior: 'smooth',
                     block: 'start'
                 });
                 
                 createParticleEffect(button);
             }
         });
         
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
             // Drohne fokussieren, wenn nach 'home' navigiert wird
             if (target === 'home') {
                 focusDrone(camera);
             }
         });
     });
 }

// Entfernt: Alle Ladebildschirm-Funktionen und Placeholder-Drohne

// Partikel-Effekt erstellen
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

// Scroll-Animationen
function initScrollAnimations() {
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

    const cameraTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#home",
            start: "top top",
            end: "bottom top",
            scrub: true,
            // markers: true
        }
    });

    camera.position.set(0, 0, 500);
    camera.fov = 75;
    camera.updateProjectionMatrix();

    cameraTimeline
        .to(camera.position, {
            x: 0,
            y: 0,
            z: 200,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: () => interactiveDrone && camera.lookAt(interactiveDrone.position)
        }, 0)
        .to(camera, {
            fov: 60,
            duration: 1,
            ease: "power2.inOut"
        }, 0)

        // Phase 2: Kamera umkreist die Drohne
        .to(camera.position, {
            x: 150,
            y: -50,
            z: 300,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: () => interactiveDrone && camera.lookAt(interactiveDrone.position)
        }, 1)
        .to(camera, {
            fov: 70,
            duration: 1,
            ease: "power2.inOut"
        }, 1)

        // Phase 3: Zeige das Sternenfeld
        .to(camera.position, {
            x: 0,
            y: 0,
            z: 1500,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: () => camera.lookAt(scene.position)
        }, 2)
        .to(camera, {
            fov: 90,
            duration: 1,
            ease: "power2.inOut"
        }, 2);
 }

// Allgemeine Animationen
function initAnimations() {
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
    
    const title = document.querySelector('h1');
    if (title) {
        setInterval(() => {
            if (Math.random() < 0.1) {
                title.classList.add('glitch');
                title.setAttribute('data-text', title.textContent);
                setTimeout(() => title.classList.remove('glitch'), 500);
            }
        }, 3000);
    }
}

// Kontaktformular-Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
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

// Performance-Optimierung
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

// Kritische Ressourcen vorladen
function preloadResources() {
    const criticalImages = [
        // Hier kritische Bilder hinzufügen
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Drohne bereits während des Ladebildschirms vorladen
function preloadDrone() {
    // Erstelle eine temporäre Szene für das Vorladen
    const tempScene = new THREE.Scene();
    initDrone(tempScene);
}

preloadResources();

// Fehlerbehandlung für Three.js
window.addEventListener('error', function(e) {
    if (e.message.includes('WebGL')) {
        console.warn('WebGL wird nicht unterstützt, Fallback auf CSS-Animationen');
        document.body.classList.add('no-webgl');
    }
});

// Responsives Handling
function handleResize() {
    if (renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

window.addEventListener('resize', handleResize);

// Benutzerdefinierter Cursor-Effekt hinzufügen
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

// ScrollTrigger-Plugin registrieren
gsap.registerPlugin(ScrollTrigger);

console.log('🚀 3D Portfolio erfolgreich geladen!');
