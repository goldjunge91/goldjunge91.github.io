import * as THREE from 'three';
import { gsap } from 'gsap';

// Animation 1: Schneller Eingang (Performance-optimiert)
export function spectacularEntrance(drone, scene) {
    if (!drone) return;
    
    // Startposition: Direkt über der Szene
    drone.position.set(0, 500, 0);
    drone.rotation.set(0, 0, 0);
    drone.scale.set(0.1, 0.1, 0.1);
    
    // Weniger Partikel für bessere Performance
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 30; // Reduziert von 200 auf 30
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 100;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00f5ff,
        size: 4,
        transparent: true,
        opacity: 0.6
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Kurze, schnelle Animation
    const tl = gsap.timeline();
    
    tl.to(drone.position, {
        x: 0, y: 0, z: 0,
        duration: 0.8,
        ease: "power2.out"
    })
    .to(drone.scale, {
        x: 50, y: 50, z: 50,
        duration: 0.6,
        ease: "back.out(1.7)"
    }, 0.2)
    .to(particles.material, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => scene.remove(particles)
    }, 0.5);
    
    console.log('🎆 Schneller Eingang gestartet!');
}

// Animation 2: Einfache Hologramm-Materialisierung (Performance-optimiert)
export function hologramMaterialization(drone, scene) {
    if (!drone) return;
    
    // Startposition: Sichtbar aber transparent
    drone.position.set(0, 0, 0);
    drone.scale.set(50, 50, 50);
    
    // Alle Materialien transparent machen
    const originalMaterials = [];
    drone.traverse((child) => {
        if (child.isMesh) {
            originalMaterials.push(child.material.clone());
            child.material.transparent = true;
            child.material.opacity = 0;
        }
    });
    
    // Einfache Scan-Linie
    const scanGeometry = new THREE.PlaneGeometry(150, 1);
    const scanMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.8
    });
    
    const scanLine = new THREE.Mesh(scanGeometry, scanMaterial);
    scanLine.position.set(0, -75, 0);
    scene.add(scanLine);
    
    // Schnelle Animation
    const tl = gsap.timeline();
    
    // Scan-Linie bewegt sich nach oben
    tl.to(scanLine.position, {
        y: 75,
        duration: 1,
        ease: "power2.inOut"
    })
    
    // Drohne wird sichtbar
    .to(drone.children, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1
    }, 0.3)
    
    // Scan-Linie verschwindet
    .to(scanLine.material, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => scene.remove(scanLine)
    }, 1.2);
    
    console.log('🔮 Einfache Hologramm-Materialisierung gestartet!');
}

// Animation 3: Einfache Zoom-In Animation (Performance-optimiert)
export function zoomInAnimation(drone, scene) {
    if (!drone) return;
    
    // Startposition: Sehr klein in der Mitte
    drone.position.set(0, 0, 0);
    drone.scale.set(0.01, 0.01, 0.01);
    
    // Einfacher Glow-Effekt
    const glowGeometry = new THREE.SphereGeometry(80, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        transparent: true,
        opacity: 0.2
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.scale.set(0.1, 0.1, 0.1);
    scene.add(glow);
    
    // Schnelle Animation
    const tl = gsap.timeline();
    
    // Glow erscheint
    tl.to(glow.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.4,
        ease: "power2.out"
    })
    
    // Drohne zoomt hinein
    .to(drone.scale, {
        x: 50, y: 50, z: 50,
        duration: 0.8,
        ease: "back.out(1.7)"
    }, 0.2)
    
    // Glow verschwindet
    .to(glow.material, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => scene.remove(glow)
    }, 0.6);
    
    console.log('🔍 Zoom-In Animation gestartet!');
}

// Hilfsfunktion: Zufällige Animation auswählen
export function playRandomDroneAnimation(drone, scene) {
    const animations = [spectacularEntrance, hologramMaterialization, zoomInAnimation];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    randomAnimation(drone, scene);
}
