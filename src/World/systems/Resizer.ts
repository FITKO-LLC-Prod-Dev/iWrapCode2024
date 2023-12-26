import { PerspectiveCamera, WebGLRenderer } from "three";
import { IComposerWrapper } from "./interfaces.js";

class Resizer {
  private readonly container: HTMLElement;
  private readonly camera: PerspectiveCamera;
  private readonly renderer: WebGLRenderer;
  private readonly composer: IComposerWrapper;

  constructor(
    container: HTMLElement,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
    composer: IComposerWrapper,
  ) {
    this.container = container;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = composer;
    // set initial size
    this.updateSize();
    addEventListener("resize", () => {
      this.updateSize();
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
    this.composer.updateSize(this.container);
    this.composer.render();
  }
}

export { Resizer };
