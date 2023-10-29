import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";
import { createRenderer } from "./systems/renderer.js";
import { createDirectLight, createIndirectLight } from "./components/lights.js";
import { createCamControls } from "./systems/cam_controls.js"
import { createGroundPlane } from "./components/ground.js";
import { loadBag } from "./components/bag.js";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/Loop.js";


class World {
    readonly camera: PerspectiveCamera;
    readonly scene: Scene;
    readonly renderer: WebGLRenderer;
    readonly loop: Loop;

    constructor(container: HTMLElement) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();
        const light = createDirectLight();
        const indirectLight = createIndirectLight();
        const groundPlaneMesh = createGroundPlane();
        this.scene.add(light, indirectLight, groundPlaneMesh);
        createCamControls(this.camera, this.renderer.domElement);
        new Resizer(container, this.camera, this.renderer);
        this.loop = new Loop(this.camera, this.scene, this.renderer);
        //this.loop.updatables.push(camControls as any);
        container.append(this.renderer.domElement);
    }

    // asynchronous setup here
    async init() {
        const bagModel = await loadBag();
        this.scene.add(bagModel)
    }

    // for render-on-demand usecases
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    // for continous rendering (a stream of frames)
    start() {
        this.loop.start();
    }

    stop() {
        this.loop.stop();
    }
}

export { World };
