import {
    AudioListener,
    AxesHelper,
    DefaultLoadingManager,
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
    loadFailureSoundeffect,
    loadPunchingBagSoundeffects,
    loadSuccessSoundeffect,
    loadTargetMissedSoundeffect,
} from "./components/soundeffects.js";
import { createAudioListener } from "./systems/listener.js";
import { AudioManager } from "./systems/AudioManager.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { loadGround } from "./components/ground.js";
import { CameraBehaviour } from "./systems/CameraBehaviour.js";
import {
    createCamTransitionToStartEndEvent,
    createCountdownEndEvent,
    createCountdownStartEvent,
    createLoadingEndEvent,
    createLoadingProgressEvent,
} from "./systems/events.js";
import { StatsWrapperGUI } from "./systems/StatsWrapperGUI.js";

interface IOptions extends IGameSettings {
    debugGUI?: boolean;
    worldAxis?: boolean;
    statsGUI?: boolean;
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
        if (options.statsGUI == undefined) options.statsGUI = false;
        // debugging GUI
        if (options.debugGUI) this.gui = new GUI();
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
        // loader events
        let lastProgress = 0;
        DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = Math.floor((itemsLoaded / itemsTotal) * 100.0);
            if (progress > lastProgress) lastProgress = progress;
            this.container.dispatchEvent(
                createLoadingProgressEvent({
                    progressPercentage: lastProgress,
                    message: url,
                }),
            );
        };
        // stats debugging GUI
        if (options.statsGUI) {
            const statsWrapper = new StatsWrapperGUI(container);
            this.engine.addBehaviour(statsWrapper);
        }
        // finally add DOM element to the provided container
        container.append(this.renderer.domElement);
    }

    // asynchronous setup here
    async init() {
        // load models and sound effects
        const [
            _bagMesh,
            _targetMesh,
            _groundMesh,
            loadedPunchbagSoundEffects,
            countdownRepeat,
            countdownEnd,
            targetMissed,
            success,
            failure,
        ] = await Promise.all([
            loadBag(),
            loadTarget(),
            loadGround(),
            loadPunchingBagSoundeffects(),
            loadCountdownRepeatSoudeffect(),
            loadCountdownEndSoundeffect(),
            loadTargetMissedSoundeffect(),
            loadSuccessSoundeffect(),
            loadFailureSoundeffect(),
        ]);
        this.bagMesh = _bagMesh;
        this.targetMesh = _targetMesh;
        this.groundMesh = _groundMesh;
        this.scene.add(this.bagMesh, this.groundMesh);
        this.audioManager.addPunchSoundeffects(loadedPunchbagSoundEffects);
        this.audioManager.addCountdownRepeatSoundeffect(countdownRepeat);
        this.audioManager.addCountdownEndSoundeffect(countdownEnd);
        this.audioManager.addTargetMissedSoundeffect(targetMissed);
        this.audioManager.addSuccessSoundeffect(success);
        this.audioManager.addFailureSoundeffect(failure);
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
        this.container.dispatchEvent(createLoadingEndEvent());
    }

    /** Renders a single frame. Use for static background or when no updates are
     * needed to save battery. */
    public render() {
        this.composer.render();
    }

    /** Starts the rendering loop. It is safe to call this function even if the
     * rendering loop is already started. */
    public startLoop() {
        this.engine.start();
    }

    /** Pauses currently running rendering loop. It is safe to call this function
     * even if currently running rendering has already been paused. */
    public pauseLoop() {
        this.engine.pause();
    }

    /** Resumes previously paused rendering loop. It is safe to call this
     * function even if the engine is already running. */
    public resumeLoop() {
        this.engine.resume();
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
            this.cameraBehaviour.transitionToStartState(() =>
                this.container.dispatchEvent(createCamTransitionToStartEndEvent()),
            );
        });
        this.targetBehaviour.start();
    }
}

export { World, IOptions };
