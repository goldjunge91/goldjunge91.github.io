import * as THREE from "three";
import { gsap } from "gsap";

// -------------------------
// Loading Screen Setup
// -------------------------
const loadingScreen = document.getElementById("loading-screen");
const loadingCanvas = document.getElementById("loading-canvas");

// Szene, Kamera und Renderer für den Ladescreen
const loadingScene = new THREE.Scene();
const loadingCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
loadingCamera.position.z = 5;
const loadingRenderer = new THREE.WebGLRenderer({ canvas: loadingCanvas, antialias: true });
loadingRenderer.setSize(window.innerWidth, window.innerHeight);

// Erstelle ein rotierendes 3D-Objekt (z.B. einen Stern/Energieball)
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.3, metalness: 0.8 });
const sphere = new THREE.Mesh(geometry, material);
loadingScene.add(sphere);

// Licht für den Ladescreen
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
loadingScene.add(light);

// Animationsschleife für den Loading Screen
function animateLoading() {
  requestAnimationFrame(animateLoading);
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  loadingRenderer.render(loadingScene, loadingCamera);
}
animateLoading();

// Funktion zum Initialisieren der Hauptszene
function initMainScene() {
  console.log("Initialisiere Hauptszene...");
  mainContent.classList.remove("hidden");
  animateStars();
}

// Alternative Variante: GSAP-Animation mit delayedCall (als Fallback)
gsap.delayedCall(4, () => {
  console.log("Starte GSAP-FadeOut für Loading-Screen...");
  gsap.to(loadingScreen, {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      loadingScreen.classList.add("hidden");
      initMainScene();
    }
  });
});

// -------------------------
// Hauptseite: Sternenhimmel und UI
// -------------------------
const mainContent = document.getElementById("main-content");
const starfieldCanvas = document.getElementById("starfield-canvas");

// Szene, Kamera und Renderer für den Sternenhimmel
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 1;
const renderer = new THREE.WebGLRenderer({ canvas: starfieldCanvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);

// Erstelle Sternenfeld
const starGeometry = new THREE.BufferGeometry();
const starVertices = [];

for (let i = 0; i < 1000; i++) {
  const x = THREE.MathUtils.randFloatSpread(600);
  const y = THREE.MathUtils.randFloatSpread(600);
  const z = THREE.MathUtils.randFloatSpread(600);
  starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Animationsschleife für den Sternenhimmel
function animateStars() {
  requestAnimationFrame(animateStars);
  stars.rotation.x += 0.0005;
  stars.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
  
// -------------------------
// Dark Mode Toggle
// -------------------------
const darkModeToggle = document.getElementById("dark-mode-toggle");
const htmlElement = document.documentElement;

// Prüfe gespeicherte Einstellung
if (localStorage.getItem("darkMode") === "true" || 
    (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  htmlElement.classList.add("dark");
} else {
  htmlElement.classList.remove("dark");
}

darkModeToggle.addEventListener("click", () => {
  htmlElement.classList.toggle("dark");
  localStorage.setItem("darkMode", htmlElement.classList.contains("dark"));
});

// -------------------------
// UI Button Event Listener (Navigation-Beispiele)
// -------------------------
document.getElementById("btn-about").addEventListener("click", () => {
  alert("Navigiere zu 'Über mich'");
  // Hier kannst du die Navigation oder modale Details implementieren
});

document.getElementById("btn-skills").addEventListener("click", () => {
  alert("Navigiere zu 'Skills'");
});

document.getElementById("btn-projects").addEventListener("click", () => {
  alert("Navigiere zu 'Projekte'");
});

document.getElementById("btn-contact").addEventListener("click", () => {
  alert("Navigiere zu 'Kontakt'");
});
  
// -------------------------
// Responsives Verhalten und Fenstergrößenänderung
// -------------------------
window.addEventListener("resize", () => {
  // Loading Screen Renderer
  loadingCamera.aspect = window.innerWidth / window.innerHeight;
  loadingCamera.updateProjectionMatrix();
  loadingRenderer.setSize(window.innerWidth, window.innerHeight);

  // Main Scene Renderer
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
