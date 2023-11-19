import { PerspectiveCamera } from "three";

function createCamera(): PerspectiveCamera {
  const camera = new PerspectiveCamera(
    40, // fov
    1, // aspect
    0.1, // near clipping plane
    50, // far clipping plane
  );
  return camera;
}

export { createCamera };
