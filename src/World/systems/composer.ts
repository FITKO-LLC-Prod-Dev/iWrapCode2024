import { Camera, Scene, Vector2, WebGLRenderer } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

function createComposer(
  container: HTMLElement,
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  gui?: GUI,
): EffectComposer {
  const composer = new EffectComposer(renderer);
  composer.setSize(container.clientWidth, container.clientHeight);
  // create passes here
  const renderPass = new RenderPass(scene, camera);
  const bloomPostProcessing = new UnrealBloomPass(
    new Vector2(container.clientWidth, container.clientHeight),
    0.05,
    0.5,
    1,
  );
  const output = new OutputPass();
  const fxaa = new ShaderPass(FXAAShader);
  fxaa.material.uniforms["resolution"].value.x =
    1.0 / (container.clientWidth * window.devicePixelRatio);
  fxaa.material.uniforms["resolution"].value.y =
    1.0 / (container.clientHeight * window.devicePixelRatio);
  // add passes here
  composer.addPass(renderPass);
  composer.addPass(bloomPostProcessing);
  composer.addPass(output);
  composer.addPass(fxaa);
  // add debug gui parameters
  if (gui !== undefined) {
    const composerFolder = gui.addFolder("Post Processing");
    composerFolder.add(bloomPostProcessing, "enabled").name("Unreal Bloom");
    const bloomFolder = composerFolder.addFolder("Unreal Bloom");
    bloomFolder.add(bloomPostProcessing, "strength", 0.0, 3, 0.05);
    bloomFolder.add(bloomPostProcessing, "radius", 0.0, 1, 0.01);
    bloomFolder.add(bloomPostProcessing, "threshold", 0.0, 1, 0.01);
    composerFolder.add(fxaa, "enabled").name("FXAA");
  }

  return composer;
}

export { createComposer };
