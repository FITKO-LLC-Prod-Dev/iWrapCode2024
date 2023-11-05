import { Object3D, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";
import { createRenderer } from "./systems/renderer.js";
import { createPointLight, createIndirectLight } from "./components/lights.js";
import { createCamControls } from "./systems/cam_controls.js"
import { createComposer } from "./systems/composer.js";
import { loadBag } from "./components/bag.js";
import { Resizer } from "./systems/Resizer.js";
import { Engine } from "./systems/Engine.js";
import { loadTarget } from "./components/target.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

interface WorldParams {
    debugGUI: boolean;
}

class World {
    readonly camera: PerspectiveCamera;
    readonly scene: Scene;
    readonly renderer: WebGLRenderer;
    readonly composer: EffectComposer;
    readonly engine: Engine;
    readonly resizer: Resizer;
    bagMesh: Object3D;
    targetMesh: Object3D;
    // debugGUI-related attributes
    debugGUIParams: Object = {};

    constructor(container: HTMLElement, params: WorldParams = {debugGUI: false}) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();
        this.composer = createComposer(container, this.renderer, this.scene, this.camera);
        this.engine = new Engine(this.composer);
        this.bagMesh = new Object3D();  // will be overwritten
        this.targetMesh = new Object3D();  // will be overwritten
        this.resizer = new Resizer(container, this.camera, this.renderer, this.composer);
        this.resizer.updateSize();
        // lighting
        const pointLight = createPointLight();
        const indirectLight = createIndirectLight();
        this.scene.add(pointLight, indirectLight);
        // systems
        createCamControls(this.camera, this.renderer.domElement);
        // debug GUI
        // finally add DOM element to the provided container
        container.append(this.renderer.domElement);
    }

    // asynchronous setup here
    async init() {
        this.bagMesh = await loadBag();
        this.targetMesh = await loadTarget();
        this.bagMesh.add(this.targetMesh);
        this.scene.add(this.bagMesh);
    }

    // for render-on-demand use-cases
    render() {
        this.composer.render();
    }

    // for continuous rendering (a stream of frames)
    start() {
        this.engine.animate();
    }

    addDebugGUI() {
        const gui = new GUI();
    }
}

export { World };
