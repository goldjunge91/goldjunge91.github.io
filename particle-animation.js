import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Style the renderer's DOM element to cover the entire background
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.zIndex = '-1';

// Particle setup
const particleCount = 5000;
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
    color: rgb(255, 4, 4),
    size: 0.5,
});

const isLightTheme = window.getComputedStyle(document.body).backgroundColor === 'rgb(255, 255, 255)';
particleMaterial.color.set(isLightTheme ? 0x3b82f6 : 0xf59e0b); // Blue for light theme, orange for dark theme

const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// Camera position
camera.position.z = 50;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    particleSystem.rotation.y += 0.001;
    particleSystem.material.size = 1.5 + Math.sin(Date.now() * 0.001) * 0.5;

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('Background color:', window.getComputedStyle(document.body).backgroundColor);
console.log('Is light theme:', isLightTheme);
console.log('Particle color:', particleMaterial.color.getHex());
