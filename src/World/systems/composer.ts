import { Camera, Scene, Vector2, WebGLRenderer } from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { IComposerWrapper } from "./interfaces.js";

/**
 * @param container - Scene container (ThreeJS Div in which game will be rendered)
 * @param renderer - Renderer. Necessary for render-pass input to composer
 * @param scene - Necessary for creating the render pass
 * @param camera - Necessary for creating the render-pass
 * @param gui - Debugging GUI. If passed, composer parameters will be added to it
 * @returns Created effect composer. Should be used to render for rendering.
 */
function createComposer(
  container: HTMLElement,
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  gui?: GUI,
): IComposerWrapper {
  const composer = new EffectComposer(renderer);
  composer.setSize(container.clientWidth, container.clientHeight);
  // create passes here
  const renderPass = new RenderPass(scene, camera);
  const bloomPostProcessing = new UnrealBloomPass(
    new Vector2(container.clientWidth, container.clientHeight),
    0.05,
    0.5,
    1.5,
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
    bloomFolder.add(bloomPostProcessing, "threshold", 0.0, 5, 0.05);
    composerFolder.add(fxaa, "enabled").name("FXAA");
  }
  const composerWrapped = composer as IComposerWrapper;
  composerWrapped.updateSize = function (container: HTMLElement) {
    this.setSize(container.clientWidth, container.clientHeight);
    fxaa.material.uniforms["resolution"].value.x =
      1.0 / (container.clientWidth * window.devicePixelRatio);
    fxaa.material.uniforms["resolution"].value.y =
      1.0 / (container.clientHeight * window.devicePixelRatio);
  };
  return composerWrapped;
}

export { createComposer };
