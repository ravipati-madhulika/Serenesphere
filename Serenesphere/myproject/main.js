import './styles.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let cat = document.getElementById("cat");
let mouseX = 0, mouseY = 0;
let catX = 0, catY = 0;

// Track mouse position
document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smoothly update the cat's position
function moveCat() {
    catX += (mouseX - catX) * 0.1; // Smooth follow effect
    catY += (mouseY - catY) * 0.1; 
    cat.style.transform = `translate(${catX}px, ${catY}px)`;

    requestAnimationFrame(moveCat); // Keep updating
}

// Start movement
moveCat();


// Setup

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus (Donut) with white color
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff,wireframe:true });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Background
const spaceTexture = new THREE.TextureLoader().load('live.webp');
scene.background = spaceTexture;

// Video Texture for the Box
const video = document.createElement('video');
video.src = 'alone5.mp4'; // Ensure this video file exists in your project
video.loop = true;
video.muted = true;
video.play();
const videoTexture = new THREE.VideoTexture(video);

const box = new THREE.Mesh(
  new THREE.BoxGeometry(3, 4, 3),
  new THREE.MeshBasicMaterial({ map: videoTexture })
);
scene.add(box);
box.position.z = -5;
box.position.x = 2;

const textureLoader = new THREE.TextureLoader();
const boxTexture = textureLoader.load('brain.jpg'); // Replace with your image path

const newBox = new THREE.Mesh(
  new THREE.BoxGeometry(6, 6, 6), // Increased size
  new THREE.MeshBasicMaterial({ map: boxTexture }) // Applying the image texture
);

scene.add(newBox);
newBox.position.z = 30;
newBox.position.setX(-10);

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
  
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;
  
    newBox.rotation.x += 0.005; // Adjust speed as needed
    newBox.rotation.y += 0.007;
  
    renderer.render(scene, camera);
  }
  animate();
  
