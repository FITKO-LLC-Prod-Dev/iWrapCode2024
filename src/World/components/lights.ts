import { AmbientLight, DirectionalLight } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

function createDirectionalLight(gui?: GUI): DirectionalLight {
  const light = new DirectionalLight(0xffffff, 6.1);
  light.position.set(0, 3, 5);
  light.lookAt(0, 1.35, 0);
  if (gui !== undefined) {
    const dirLightFolder = gui.addFolder("Direct Light");
    dirLightFolder.add(light, "intensity", 0, 30);
    dirLightFolder.addColor(light, "color");
  }
  return light;
}

function createIndirectLight(gui?: GUI): AmbientLight {
  const ambLight = new AmbientLight(0xffffff, 3);
  if (gui !== undefined) {
    const ambientLightFolder = gui.addFolder("Ambient Light");
    ambientLightFolder.add(ambLight, "intensity", 0.0, 10, 0.02);
    ambientLightFolder.addColor(ambLight, "color");
  }
  return ambLight;
}

export { createIndirectLight, createDirectionalLight };
