import { PerspectiveCamera, WebGLRenderer } from "three";
import { IComposerWrapper, ICameraWrapper } from "./interfaces.js";

class Resizer {
  private readonly container: HTMLElement;
  private readonly camera: PerspectiveCamera;
  private readonly cameraWrapper: ICameraWrapper;
  private readonly renderer: WebGLRenderer;
  private readonly composer: IComposerWrapper;

  constructor(
    container: HTMLElement,
    cameraWrapper: ICameraWrapper,
    renderer: WebGLRenderer,
    composer: IComposerWrapper,
  ) {
    this.container = container;
    this.cameraWrapper = cameraWrapper;
    this.camera = cameraWrapper.getCamera();
    this.renderer = renderer;
    this.composer = composer;
    // set initial size
    this.updateSize();
    addEventListener("resize", () => {
      this.updateSize();
    });
  }

  updateSize() {
    const aspectRatio =
      this.container.clientWidth / this.container.clientHeight;
    this.cameraWrapper.updateCameraAccordingToRatio(aspectRatio);
    this.camera.aspect = aspectRatio;
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
