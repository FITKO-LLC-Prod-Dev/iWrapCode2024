import { PerspectiveCamera, WebGLRenderer } from "three";

class Resizer {
    readonly container: HTMLElement;
    readonly camera: PerspectiveCamera;
    readonly renderer: WebGLRenderer;

    constructor(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
        this.container = container;
        this.camera = camera;
        this.renderer = renderer;
        // set initial size
        this.updateSize();
        window.addEventListener("resize", () => {
            this.updateSize();
        });
    }

    updateSize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }
}

export { Resizer };
