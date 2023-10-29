import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { GameObject } from "./interfaces.js"

class Loop {
    readonly camera: PerspectiveCamera;
    readonly scene: Scene;
    readonly renderer: WebGLRenderer;
    readonly clock: Clock;
    updatables: Array<GameObject>;

    constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.updatables = [];
        this.clock = new Clock();
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.update();
            this.renderer.render(this.scene, this.camera);
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null)
    }

    update() {
        const delta = this.clock.getDelta();
        for (const gameObject of this.updatables) {
            gameObject.update(delta);
        }
    }
}

export { Loop };
