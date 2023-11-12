import { Color, Scene } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

function createScene(gui?: GUI): Scene {
  const scene = new Scene();
  if (gui !== undefined) {
    const sceneFolder = gui.addFolder("Scene");
  }
  return scene;
}

export { createScene };
