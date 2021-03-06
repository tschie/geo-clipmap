import {
  ACESFilmicToneMapping,
  Clock,
  ImageUtils,
  InstancedMesh,
  MathUtils,
  Matrix4,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Quaternion,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  sRGBEncoding,
  Vector3,
  WebGLRenderer,
} from "three";
import { terrainFragmentShader } from "./fragmentShader.glsl";
import { terrainVertexShader } from "./vertexShader.glsl";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import { Sky } from "three/examples/jsm/objects/Sky";
import grassUrl from "./grass.png";

const MIN_SCALE = 7; // controls size of center LOD and overall resolution (lower for better performance)
const GRID_SIZE = Math.pow(2, MIN_SCALE + 1) + 2;
const LEVELS = 12;

const canvas = document.querySelector("canvas");

const renderer = new WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = sRGBEncoding;
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

const scene = new Scene();

/* Camera */
const camera = new PerspectiveCamera(
  75,
  canvas.offsetWidth / canvas.offsetHeight,
  0.1,
  1000000
);
camera.position.set(0, 3000, 0);

const controls = new FlyControls(camera, renderer.domElement);
controls.dragToLook = true;
controls.movementSpeed = 2000;
controls.rollSpeed = 1;

/* Sky */
const sky = new Sky();
sky.scale.setScalar(450000);
scene.add(sky);

const skyUniforms = {
  turbidity: { value: 10 },
  rayleigh: { value: 3 },
  mieCoefficient: { value: 0.005 },
  mieDirectionalG: { value: 0.7 },
  elevation: { value: 35 },
  azimuth: { value: 180 },
  exposure: renderer.toneMappingExposure,
};

const sun = new Vector3();
const phi = MathUtils.degToRad(90 - skyUniforms.elevation.value);
const theta = MathUtils.degToRad(skyUniforms.azimuth.value);
sun.setFromSphericalCoords(1, phi, theta);
skyUniforms.sunPosition = { value: sun };

sky.material.uniforms = {
  ...sky.material.uniforms,
  ...skyUniforms,
};

renderer.toneMappingExposure = skyUniforms.exposure;

/* Terrain */
// single plane geometry shared by each terrain LOD with an extra 1 cell wide border
const geometry = new PlaneBufferGeometry(
  GRID_SIZE / (GRID_SIZE - 2),
  GRID_SIZE / (GRID_SIZE - 2),
  GRID_SIZE,
  GRID_SIZE
);
geometry.rotateX(-Math.PI / 2);

const grassTexture = ImageUtils.loadTexture(grassUrl);
grassTexture.wrapS = RepeatWrapping;
grassTexture.wrapT = RepeatWrapping;

const material = new ShaderMaterial({
  uniforms: {
    grass: {
      type: "t",
      value: grassTexture,
    },
    gridSize: { value: GRID_SIZE },
    sun: { value: sun },
  },
  vertexShader: terrainVertexShader,
  fragmentShader: terrainFragmentShader,
});

const instancedMesh = new InstancedMesh(geometry, material, LEVELS);
scene.add(instancedMesh);

/* GUI */
const stats = Stats();
document.body.appendChild(stats.domElement);

const gui = new GUI();

const updateControl = { update: true };
const clipMapFolder = gui.addFolder("Clip Map");
clipMapFolder.add(updateControl, "update", true);
clipMapFolder.open();

const materialFolder = gui.addFolder("Material");
materialFolder.add(material, "wireframe", false);
materialFolder.open();

/* Resize */
const resize = () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener("resize", resize);

resize();

/* Animate */
const clock = new Clock();

const animate = () => {
  requestAnimationFrame(animate);

  // update camera
  controls.update(clock.getDelta());

  if (updateControl.update) {
    for (let i = 0; i < LEVELS; i++) {
      const scale = Math.pow(2, i + MIN_SCALE + 1);
      instancedMesh.setMatrixAt(
        i,
        new Matrix4().compose(
          new Vector3(
            Math.floor(camera.position.x),
            0.0,
            Math.floor(camera.position.z)
          ),
          new Quaternion(),
          new Vector3(scale, 1, scale)
        )
      );
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.material.needsUpdate = true;
  }

  renderer.render(scene, camera);

  stats.update();
};

animate();
