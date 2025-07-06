import * as THREE from 'three';
// This now works because vite.config.js is fixed
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; 
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- SCENE SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 8);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#webgl-canvas'),
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- LIGHTS ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x00d4ff, 3, 100);
pointLight.position.set(-5, 5, 5);
scene.add(pointLight);

// --- LOAD DRONE MODEL (Matching your filename 'dron.glb') ---
const loader = new GLTFLoader();
let drone = null;

loader.load(
    // Corrected path to match your file in the /public folder
    '/dron.glb', 
    (gltf) => {
        drone = gltf.scene;
        scene.add(drone);
        console.log("Drone model loaded successfully!");
    },
    undefined,
    (error) => {
        console.error('An error happened while loading the model:', error);
    }
);

// --- MOUSE INTERACTION ---
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);

    if (drone) {
        // Smoothly rotate the drone to follow the mouse
        gsap.to(drone.rotation, {
            y: mouse.x * 0.5,
            x: -mouse.y * 0.2,
            duration: 2,
            ease: 'power2.out'
        });
        
        // Gentle floating motion
        drone.position.y = Math.sin(clock.getElapsedTime() * 0.7) * 0.15;
    }

    renderer.render(scene, camera);
}
animate();

// --- SCROLL-BASED ANIMATIONS ---
gsap.to(camera.position, {
    z: 4, // Zoom in
    scrollTrigger: {
        trigger: ".content-section",
        start: "top bottom",
        end: "top top",
        scrub: 1.5,
    }
});

gsap.utils.toArray('.content-card').forEach(card => {
    gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });
});

// --- HANDLE WINDOW RESIZE ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});