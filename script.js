import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const SIZES = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const loadingManager = new THREE.LoadingManager(
  () => {},
  (url, loaded, total) => {
    console.log(url, loaded, total);
  },
  (url) => {
    console.log("error: ", url);
  }
);
const textureLoader = new THREE.TextureLoader(loadingManager);
const matcapType1Texture = textureLoader.load(
  new URL("/textures/matcaps/1.png", import.meta.url)
);

matcapType1Texture.colorSpace = THREE.SRGBColorSpace;

const fontLoader = new FontLoader(loadingManager);

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const torusGeometry = new THREE.TorusGeometry(0.3, 0.1, 6, 24);
const torusMaterial = new THREE.MeshMatcapMaterial({
  matcap: matcapType1Texture,
});
Array.from({ length: 1000 }, (_) => {
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.x = (Math.random() - 0.5) * 20;
  torus.position.y = (Math.random() - 0.5) * 20;
  torus.position.z = (Math.random() - 0.5) * 20;
  torus.rotation.x = Math.random() * Math.PI;
  torus.rotation.y = Math.random() * Math.PI;

  const scale = Math.random();
  torus.scale.x = scale;
  torus.scale.y = scale;
  torus.scale.z = scale;

  scene.add(torus);
});

const camera = new THREE.PerspectiveCamera(75, SIZES.width / SIZES.height);
camera.position.set(1, 2, 3);

const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.setSize(SIZES.width, SIZES.height);

const tick = () => {
  control.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

window.addEventListener("resize", () => {
  SIZES.width = window.innerWidth;
  SIZES.height = window.innerHeight;

  camera.aspect = SIZES.width / SIZES.height;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.setSize(SIZES.width, SIZES.height);
});

fontLoader.load(
  new URL("/fonts/winky-sans-regular.json", import.meta.url),
  (font) => {
    const textGeometry = new TextGeometry("DEVIAN", {
      font,
      size: 0.5,
      depth: 0.2,
      curveSegments: 6,
      bevelEnable: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    });

    //   textGeometry.computeBoundingBox();
    //   textGeometry.translate(
    //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
    //   );
    textGeometry.center();

    const textMaterial = new THREE.MeshMatcapMaterial({
      color: 0xffffff,
      // wireframe: true,
      matcap: matcapType1Texture,
    });
    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);
  }
);
