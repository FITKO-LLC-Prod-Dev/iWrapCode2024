import { Camera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { degToRad } from "three/src/math/MathUtils.js";

function createCamControls(camera: Camera, domElement: HTMLElement) {
    const camControls = new OrbitControls(camera, domElement);
    camControls.target.set(0, 1, 0);
    camControls.enablePan = false;
    camControls.enableZoom = false;
    camControls.minAzimuthAngle = degToRad(-60);
    camControls.maxAzimuthAngle = degToRad(60);
    camControls.minPolarAngle = degToRad(40);
    camControls.maxPolarAngle = degToRad(65);
    camControls.minDistance = 2;
    camControls.maxDistance = 4;
    camControls.update();
    (camControls as any).tick = () => camControls.update();
    return camControls;
}

export { createCamControls };
