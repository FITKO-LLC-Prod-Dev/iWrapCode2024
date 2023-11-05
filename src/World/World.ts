import { AxesHelper, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";
import { createRenderer } from "./systems/renderer.js";
import { createPointLight, createIndirectLight } from "./components/lights.js";
import { createCamControls } from "./systems/orbiter.js"
import { createComposer } from "./systems/composer.js";
import { loadBag } from "./components/bag.js";
import { Resizer } from "./systems/Resizer.js";
import { Engine } from "./systems/Engine.js";
import { loadTarget } from "./components/target.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { TargetBehaviour, TargetHitOrigin } from "./systems/TargetBehaviour.js";
import { degToRad } from "three/src/math/MathUtils.js";

interface WorldParams {
    debugGUI?: boolean;
    worldAxis?: boolean;
}

class World {
    readonly camera: PerspectiveCamera;
    readonly scene: Scene;
    readonly renderer: WebGLRenderer;
    readonly composer: EffectComposer;
    readonly engine: Engine;
    readonly resizer: Resizer;
    readonly targetHitOrigins: Array<TargetHitOrigin>;
    readonly constantDeltaSampler: (d: number) => number;
    readonly linearDeltaSampler: (d: number) => number;
    readonly maxHits: number;
    // TODO: add exponential reaction time sample
    targetBehaviour!: TargetBehaviour;
    bagMesh!: Object3D;
    targetMesh!: Object3D;
    // debugGUI-related attributes
    debugGUIParams: Object = {};

    constructor(container: HTMLElement, initialDelta: number = 2000, hardestDelta: number = 150, maxHits: number = 200, params: WorldParams = {debugGUI: false, worldAxis: false}) {
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();
        this.composer = createComposer(container, this.renderer, this.scene, this.camera);
        this.engine = new Engine(this.composer);
        this.resizer = new Resizer(container, this.camera, this.renderer, this.composer);
        this.resizer.updateSize();
        // lighting
        const pointLight = createPointLight();
        const indirectLight = createIndirectLight();
        this.scene.add(pointLight, indirectLight);
        // systems
        createCamControls(this.camera, this.renderer.domElement);
        this.targetHitOrigins = [
            {position: new Vector3(0, 0, 0), rotation: new Vector3(0, 0, 0)},
            {position: new Vector3(0, +0.129, 0), rotation: new Vector3(0, 0, 0)},
            {position: new Vector3(0, -0.129, 0), rotation: new Vector3(0, 0, 0)},
            {position: new Vector3(0, 0, 0), rotation: new Vector3(0, degToRad(+28.22), 0)},
            {position: new Vector3(0, 0, 0), rotation: new Vector3(0, degToRad(-28.22), 0)},
            {position: new Vector3(0, +0.129, 0), rotation: new Vector3(0, degToRad(+28.22), 0)},
            {position: new Vector3(0, +0.129, 0), rotation: new Vector3(0, degToRad(-28.22), 0)},
            {position: new Vector3(0, -0.129, 0), rotation: new Vector3(0, degToRad(+28.22), 0)},
            {position: new Vector3(0, -0.129, 0), rotation: new Vector3(0, degToRad(-28.22), 0)},
        ];
        this.constantDeltaSampler = (d: number) => initialDelta;
        this.linearDeltaSampler = (d: number) => Math.floor(- d * (initialDelta - hardestDelta) + initialDelta);
        this.maxHits = maxHits;
        // debug GUI
        if (params.worldAxis) {
            const worldAxis = new AxesHelper(3);
            this.scene.add(worldAxis);
        }

        // finally add DOM element to the provided container
        container.append(this.renderer.domElement);
    }

    // asynchronous setup here
    async init() {
        this.bagMesh = await loadBag();
        this.targetMesh = await loadTarget();
        this.scene.add(this.bagMesh);
        this.targetBehaviour = new TargetBehaviour(this.bagMesh, this.targetMesh, this.camera, this.targetHitOrigins, this.linearDeltaSampler, this.maxHits);
        this.targetBehaviour.start();
    }

    // for render-on-demand use-cases
    render() {
        this.composer.render();
    }

    // for continuous rendering (a stream of frames)
    start() {
        this.engine.animate();
    }
}

export { World };
