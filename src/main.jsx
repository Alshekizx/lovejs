import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const welcomeSection = document.getElementById("Welcome");
const loginSection = document.getElementById("loginSection");
const logindiv = document.getElementById("login");

const navId = document.getElementById("navId");
const menuButton = document.getElementById("menuButton");
const listNav = document.getElementById("listNav");

// Get reference to the joinUs div
const joinUsDiv = document.getElementById("joinUs");

// Set up the scene, renderer, and camera
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-5, 1, 0);
camera.rotation.set(0, 0, 0);
camera.lookAt(0, 1.3, 0);

let model, model3;

// Load 3D models using GLTFLoader
const loader = new GLTFLoader();

// Load the first model
loader.load(
  "src/assets/first.glb",
  function (gltf) {
    model = gltf.scene;
    scene.add(model);
    model.position.set(0, 0, 0);
    animateCameraToModel();
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Load the ground model
loader.load("src/assets/ground.glb", (gltf) => {
  const model2 = gltf.scene;
  scene.add(model2);
});

// Load the second model
loader.load("src/assets/second.glb", (gltf) => {
  model3 = gltf.scene;
  scene.add(model3);
  model3.position.set(10, 0, -10);
});

// Set up a point light
const pointLight1 = new THREE.PointLight(0xffffff);
pointLight1.position.set(0, 5, 5);
scene.add(pointLight1);
pointLight1.intensity = 10;

// Animation/render loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the models if they are loaded
  if (model && model3) {
    model.rotation.y += 0.003;
    model3.rotation.y += 0.003;
  }

  // Render the scene
  renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add event listener for window resize
window.addEventListener("resize", onWindowResize);

// Start the animation loop
animate();

// Function to animate the camera to a specific position
function animateCameraToModel() {
  const initialPosition = new THREE.Vector3(-1, 3, 0);
  const targetPosition = new THREE.Vector3(-3.5, 1.7, 0);
  const animationDuration = 5000;

  const startTime = Date.now();

  // Update camera position gradually
  function updateCameraPosition() {
    const elapsed = Date.now() - startTime;
    const t = Math.min(1, elapsed / animationDuration);

    camera.position.lerpVectors(initialPosition, targetPosition, t);

    if (t < 1) {
      requestAnimationFrame(updateCameraPosition);
    }
  }

  // Start the camera animation
  updateCameraPosition();
}

// Add click event listener to the joinUs div

joinUsDiv.addEventListener("click", function () {
  // Toggle the visibility using classes
  if (welcomeSection.style.display !== "none") {
    welcomeSection.style.display = "none";
    loginSection.style.display = "flex";
    logindiv.classList.add("visible");

    // Animate the position of models when login is visible
    if (model && model3) {
      animateModelPosition(model, new THREE.Vector3(-8, 2, -2));
      animateModelPosition(model3, new THREE.Vector3(-1.5, -0.8, -0.8));
    }
  } else {
    welcomeSection.style.display = "block";
    loginSection.style.display = "none";
    logindiv.classList.remove("visible");

    // Animate the position of models when welcome is visible
    if (model && model3) {
      animateModelPosition(model, new THREE.Vector3(0, 0, 0));
      animateModelPosition(model3, new THREE.Vector3(8, 0, -10));
    }
  }
});

// Function to animate the position of a model
function animateModelPosition(model, targetPosition) {
  const initialPosition = model.position.clone();
  const animationDuration = 2000; // Adjust the duration as needed

  const startTime = Date.now();

  function updateModelPosition() {
    const elapsed = Date.now() - startTime;
    const t = Math.min(1, elapsed / animationDuration);

    model.position.lerpVectors(initialPosition, targetPosition, t);

    if (t < 1) {
      requestAnimationFrame(updateModelPosition);
    }
  }

  updateModelPosition();
}

menuButton.addEventListener("click", () => {
  menuButton.classList.toggle("active");
  navId.classList.toggle("active");
});

listNav.addEventListener("click", () => {
  menuButton.classList.remove("active");
  navId.classList.remove("active");
});
