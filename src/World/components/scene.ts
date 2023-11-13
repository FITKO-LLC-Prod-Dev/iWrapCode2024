import { Color, Scene } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

function createScene(gui?: GUI): Scene {
  const scene = new Scene();
  scene.background = new Color(0xffffff);
  if (gui !== undefined) {
    const sceneFolder = gui.addFolder("Scene");
    sceneFolder.addColor(scene, "background");
  }
  return scene;
}

export { createScene };
