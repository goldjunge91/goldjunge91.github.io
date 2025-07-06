import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import * as THREE from 'three';

export let interactiveDrone = null;
const clock = new THREE.Clock();

export function initDrone(scene) {
    const loader = new GLTFLoader();
    loader.load(
        '/sci-fi_drone.glb',
        (gltf) => {
            interactiveDrone = gltf.scene;
            interactiveDrone.scale.set(50,50,50);
            interactiveDrone.position.set(0, -200, 100); // Unter dem Text positionieren
            scene.add(interactiveDrone);
            
            console.log('🚁 Drohne geladen - KEINE Animation!');
        },
        undefined,
        console.error
    );
}

export function updateDrone(mouseX, mouseY) {
    if (!interactiveDrone) return;
    // Rotation
    gsap.to(interactiveDrone.rotation, {
        y: mouseX * 0.5,
        x: -mouseY * 0.2,
        duration: 2,
        ease: 'power2.out'
    });
    // Schwebe-Effekt
    interactiveDrone.position.y = Math.sin(clock.getElapsedTime() * 0.7) * 0.15;
}

export function focusDrone(camera) {
    if (!interactiveDrone) return;
    gsap.to(camera.position, {
        x:0,y:0,z:200,duration:1.5,ease:"power2.inOut",
        onUpdate: ()=> camera.lookAt(interactiveDrone.position)
    });
    gsap.to(camera, { fov:60,duration:1.5,ease:"power2.inOut" });
}