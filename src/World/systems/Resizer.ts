import { Clock, PerspectiveCamera, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

class Resizer {
  private readonly container: HTMLElement;
  private readonly camera: PerspectiveCamera;
  private readonly renderer: WebGLRenderer;
  private readonly composer: EffectComposer;
  private readonly clock: Clock;
  private accumulator = 0;

  constructor(
    container: HTMLElement,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
    composer: EffectComposer,
    throttlingTime: number = 0.15,
  ) {
    this.container = container;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = composer;
    // set initial size
    this.updateSize();
    this.clock = new Clock();
    addEventListener("resize", () => {
      this.accumulator += this.clock.getDelta();
      if (this.accumulator > throttlingTime) {
        this.accumulator = 0;
        this.updateSize();
      }
    });
  }

  updateSize() {
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );
    this.composer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );
    this.composer.render();
  }
}

export { Resizer };
