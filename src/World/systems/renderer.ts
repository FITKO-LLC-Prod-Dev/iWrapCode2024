import {
  ACESFilmicToneMapping,
  CineonToneMapping,
  LinearToneMapping,
  NoToneMapping,
  ReinhardToneMapping,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

function createRenderer(container: HTMLElement, gui?: GUI): WebGLRenderer {
  const renderer = new WebGLRenderer();
  const params = { exposure: 1 };
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ReinhardToneMapping;
  renderer.toneMappingExposure = params.exposure;
  if (gui !== undefined) {
    const rendererFolder = gui.addFolder("WebGL Renderer");
    rendererFolder
      .add(renderer, "toneMapping", {
        None: NoToneMapping,
        Linear: LinearToneMapping,
        Reinhard: ReinhardToneMapping,
        Cineon: CineonToneMapping,
        ACESFilmic: ACESFilmicToneMapping,
      })
      .name("Tone Mapping");
    rendererFolder
      .add(params, "exposure", 0.1, 2, 0.02)
      .onChange((value: number) => {
        renderer.toneMappingExposure = Math.pow(value, 4.0);
      });
  }
  return renderer;
}

export { createRenderer };
