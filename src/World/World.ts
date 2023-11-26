import {
    AudioListener,
    AxesHelper,
    Mesh,
    Object3D,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three";
import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";
import { createRenderer } from "./systems/renderer.js";
import { createDirectionalLight } from "./components/lights.js";
import { createComposer } from "./systems/composer.js";
import { loadBag } from "./components/bag.js";
import { Resizer } from "./systems/Resizer.js";
import { Engine } from "./systems/Engine.js";
import { loadTarget } from "./components/target.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import {
    TargetBehaviour,
    TargetHitOrigin,
    IGameSettings,
} from "./systems/TargetBehaviour.js";
import { degToRad } from "three/src/math/MathUtils.js";
import {
    loadCountdownEndSoundeffect,
    loadCountdownRepeatSoudeffect,
    loadPunchingBagSoundeffects,
} from "./components/soundeffects.js";
import { createAudioListener } from "./systems/listener.js";
import { AudioManager } from "./systems/AudioManager.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { loadGround } from "./components/ground.js";
import { CameraBehaviour } from "./systems/CameraBehaviour.js";
import {
    createCountdownEndEvent,
    createCountdownStartEvent,
} from "./systems/events.js";

interface IOptions extends IGameSettings {
    debugGUI?: boolean;
    worldAxis?: boolean;
}

class World {
    readonly container: HTMLElement;
    readonly camera: PerspectiveCamera;
    readonly cameraBehaviour: CameraBehaviour;
    readonly scene: Scene;
    readonly renderer: WebGLRenderer;
    readonly composer: EffectComposer;
    readonly engine: Engine;
    readonly resizer: Resizer;
    readonly listener: AudioListener;
    readonly audioManager: AudioManager;
    readonly targetHitOrigins: Array<TargetHitOrigin>;
    readonly gui?: GUI;
    options: IOptions;
    targetBehaviour!: TargetBehaviour;
    bagMesh!: Mesh;
    targetMesh!: Object3D;
    groundMesh!: Object3D;
    bagSoundEffects!: Array<AudioBuffer>;

    constructor(container: HTMLElement, options: IOptions) {
        // set defaults here
        if (options.debugGUI == undefined) options.debugGUI = false;
        if (options.worldAxis == undefined) options.worldAxis = false;
        // debugging GUI
        if (options.debugGUI) {
            this.gui = new GUI();
        }
        this.container = container;
        this.options = options;
        this.scene = createScene(this.gui);
        this.camera = createCamera();
        this.renderer = createRenderer(container, this.gui);
        this.composer = createComposer(
            container,
            this.renderer,
            this.scene,
            this.camera,
            this.gui,
        );
        this.engine = new Engine(this.composer);
        this.cameraBehaviour = new CameraBehaviour(
            this.engine,
            this.camera,
            this.gui,
        );
        this.resizer = new Resizer(
            container,
            this.camera,
            this.renderer,
            this.composer,
        );
        this.resizer.updateSize();
        // audio
        this.listener = createAudioListener(this.camera);
        this.audioManager = new AudioManager(this.listener);
        // lighting
        const directLight = createDirectionalLight(this.gui);
        this.scene.add(directLight);
        // systems
        this.targetHitOrigins = [
            {
                position: new Vector3(0, +0.129, 0),
                rotation: new Vector3(0, degToRad(-28.22), 0),
            },
            {
                position: new Vector3(0, +0.129, 0),
                rotation: new Vector3(0, 0, 0),
            },
            {
                position: new Vector3(0, +0.129, 0),
                rotation: new Vector3(0, degToRad(+28.22), 0),
            },
            {
                position: new Vector3(0, 0, 0),
                rotation: new Vector3(0, degToRad(-28.22), 0),
            },
            {
                position: new Vector3(0, 0, 0),
                rotation: new Vector3(0, 0, 0),
            },
            {
                position: new Vector3(0, 0, 0),
                rotation: new Vector3(0, degToRad(+28.22), 0),
            },
            {
                position: new Vector3(0, -0.129, 0),
                rotation: new Vector3(0, degToRad(-28.22), 0),
            },
            {
                position: new Vector3(0, -0.129, 0),
                rotation: new Vector3(0, 0, 0),
            },
            {
                position: new Vector3(0, -0.129, 0),
                rotation: new Vector3(0, degToRad(+28.22), 0),
            },
        ];
        // camera positions and targets
        if (options.worldAxis) {
            const worldAxis = new AxesHelper(3);
            this.scene.add(worldAxis);
        }
        // finally add DOM element to the provided container
        container.append(this.renderer.domElement);
    }

    // asynchronous setup here
    async init() {
        // load models
        this.bagMesh = await loadBag();
        this.targetMesh = await loadTarget();
        this.groundMesh = await loadGround();
        this.scene.add(this.bagMesh, this.groundMesh);
        // load sound effects
        const loadedPunchbagSoundEffects = await loadPunchingBagSoundeffects();
        const countdownRepeat = await loadCountdownRepeatSoudeffect();
        const countdownEnd = await loadCountdownEndSoundeffect();
        this.audioManager.addPunchSoundeffects(loadedPunchbagSoundEffects);
        this.audioManager.addCountdownRepeatSoundeffect(countdownRepeat);
        this.audioManager.addCountdownEndSoundeffect(countdownEnd);
        // behaviours dependent on asynchronously loaded assets
        this.targetBehaviour = new TargetBehaviour(
            this.container,
            this.engine,
            this.bagMesh,
            this.targetMesh,
            this.camera,
            this.audioManager,
            this.targetHitOrigins,
            this.options,
            this.gui,
        );
    }
    // for render-on-demand use-cases
    render() {
        this.composer.render();
    }

    // for continuous rendering (a stream of frames)
    startLoop() {
        this.engine.start();
    }

    public pauseLoop() {
        this.engine.pause();
    }

    public resumeLoop() {
        this.engine.resume();
    }

    startTutorial() {
        // TODO: implement tutorial logic
    }

    public startGame() {
        this.cameraBehaviour.transitionToGameState(() => {
            this.container.dispatchEvent(
                createCountdownStartEvent({ duration: this.options.countdown }),
            );
            setTimeout(() => {
                this.container.dispatchEvent(
                    createCountdownEndEvent({ duration: this.options.countdown }),
                );
                this.startGameAfterCounter();
            }, this.options.countdown * 1000);
            this.audioManager.playCountdownAudios(this.options.countdown);
        });
    }

    private startGameAfterCounter() {
        this.container.addEventListener("gameover", () => {
            this.cameraBehaviour.transitionToStartState();
        });
        this.targetBehaviour.start();
    }
}

export { World, IOptions };
