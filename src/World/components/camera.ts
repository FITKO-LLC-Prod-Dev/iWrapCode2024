import { PerspectiveCamera, Vector3 } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

function createCamera(gui?: GUI): PerspectiveCamera {
  const camera = new PerspectiveCamera(
    40, // fov
    1, // aspect
    0.1, // near clipping plane
    50, // far clipping plane
  );
  const camTarget = new Vector3(0.0, 0.94, 0.0);
  camera.position.set(0, 2.2, 2.4);
  camera.lookAt(camTarget);
  if (gui !== undefined) {
    const cameraFolder = gui.addFolder("Camera");
    const posFolder = cameraFolder.addFolder("Position");
    posFolder.add(camera.position, "x", -5, 5, 0.05).onChange((_: number) => {
      camera.lookAt(camTarget);
    });
    posFolder.add(camera.position, "y", 0, 5, 0.05).onChange((_: number) => {
      camera.lookAt(camTarget);
    });
    posFolder.add(camera.position, "z", 0, 5, 0.05).onChange((_: number) => {
      camera.lookAt(camTarget);
    });
    const targetFolder = cameraFolder.addFolder("Target");
    targetFolder.add(camTarget, "x", -5, 5, 0.05).onChange((_: number) => {
      camera.lookAt(camTarget);
    });
    targetFolder.add(camTarget, "y", 0, 3, 0.05).onChange((_: number) => {
      camera.lookAt(camTarget);
    });
    targetFolder.add(camTarget, "z", 0, 3, 0.05).onChange((_: number) => {
      camera.lookAt(camTarget);
    });
  }
  return camera;
}

export { createCamera };
