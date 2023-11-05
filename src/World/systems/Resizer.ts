import { PerspectiveCamera, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

class Resizer {
    readonly container: HTMLElement;
    readonly camera: PerspectiveCamera;
    readonly renderer: WebGLRenderer;
    readonly composer: EffectComposer;

    constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer, composer: EffectComposer) {
        this.container = container;
        this.camera = camera;
        this.renderer = renderer;
        this.composer = composer;
        // set initial size
        this.updateSize();
        window.addEventListener("resize", () => {
            this.updateSize();
        });
    }

    updateSize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.composer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}

export { Resizer };
