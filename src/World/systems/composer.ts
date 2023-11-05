import { Camera, FloatType, NearestFilter, SRGBColorSpace, Scene, Vector2, WebGLRenderTarget, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

function createComposer(container: HTMLElement, renderer: WebGLRenderer, scene: Scene, camera: Camera): EffectComposer {
    const composer = new EffectComposer(renderer);
    composer.setSize(container.clientWidth, container.clientHeight);
    // create passes here
    const renderPass = new RenderPass(scene, camera);
    const bloomPostProcessing = new UnrealBloomPass(new Vector2(container.clientWidth, container.clientHeight), 0.15, 0.85, 1.2);
    const output = new OutputPass();
    const fxaa = new ShaderPass(FXAAShader);
    fxaa.material.uniforms['resolution'].value.x = 1.00 / ( container.clientWidth * window.devicePixelRatio);
    fxaa.material.uniforms['resolution'].value.y = 1.00 / ( container.clientHeight * window.devicePixelRatio);
    // add passes here
    composer.addPass(renderPass);
    composer.addPass(bloomPostProcessing);
    composer.addPass(output);
    composer.addPass(fxaa);
    return composer;
}

export { createComposer };
