import {
  AudioListener,
  AxesHelper,
  Object3D,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { createCamera } from "./components/camera.js";
import { createScene } from "./components/scene.js";
import { createRenderer } from "./systems/renderer.js";
import { createPointLight, createIndirectLight } from "./components/lights.js";
import { createCamControls } from "./systems/orbiter.js";
import { createComposer } from "./systems/composer.js";
import { loadBag } from "./components/bag.js";
import { Resizer } from "./systems/Resizer.js";
import { Engine } from "./systems/Engine.js";
import { loadTarget } from "./components/target.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import {
  TargetBehaviour,
  TargetHitOrigin,
  GameSettings,
} from "./systems/TargetBehaviour.js";
import { degToRad } from "three/src/math/MathUtils.js";
import { loadPunchingBagSoundeffects } from "./components/soundeffects.js";
import { createAudioListener } from "./systems/listener.js";
import { AudioManager } from "./systems/AudioManager.js";

interface DebugParams {
  debugGUI: boolean;
  worldAxis: boolean;
}

class World {
  readonly container: HTMLElement;
  readonly camera: PerspectiveCamera;
  readonly scene: Scene;
  readonly renderer: WebGLRenderer;
  readonly composer: EffectComposer;
  readonly engine: Engine;
  readonly resizer: Resizer;
  readonly listener: AudioListener;
  readonly audioManager: AudioManager;
  readonly targetHitOrigins: Array<TargetHitOrigin>;
  readonly debugParams: DebugParams;
  gameSettings: GameSettings;
  // TODO: add exponential reaction time sample
  targetBehaviour!: TargetBehaviour;
  bagMesh!: Object3D;
  targetMesh!: Object3D;
  bagSoundEffects!: Array<AudioBuffer>;

  constructor(
    container: HTMLElement,
    gameSettings: GameSettings = {
      initialPoints: 1000,
      minimumPoints: 0,
      nbrTargets: 30,
      startReactionTime: 2000,
      endReactionTime: 400,
      progression: "linear",
      keyboardTargetActivated: false,
    },
    debugParams: DebugParams = {
      debugGUI: false,
      worldAxis: false,
    },
  ) {
    this.container = container;
    this.gameSettings = gameSettings;
    this.debugParams = debugParams;
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer();
    this.composer = createComposer(
      container,
      this.renderer,
      this.scene,
      this.camera,
    );
    this.engine = new Engine(this.composer);
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
    const pointLight = createPointLight();
    const indirectLight = createIndirectLight();
    this.scene.add(pointLight, indirectLight);
    // systems
    createCamControls(this.camera, this.renderer.domElement);
    this.targetHitOrigins = [
      {
        position: new Vector3(0, 0, 0),
        rotation: new Vector3(0, 0, 0),
      },
      {
        position: new Vector3(0, +0.129, 0),
        rotation: new Vector3(0, 0, 0),
      },
      {
        position: new Vector3(0, -0.129, 0),
        rotation: new Vector3(0, 0, 0),
      },
      {
        position: new Vector3(0, 0, 0),
        rotation: new Vector3(0, degToRad(+28.22), 0),
      },
      {
        position: new Vector3(0, 0, 0),
        rotation: new Vector3(0, degToRad(-28.22), 0),
      },
      {
        position: new Vector3(0, +0.129, 0),
        rotation: new Vector3(0, degToRad(+28.22), 0),
      },
      {
        position: new Vector3(0, +0.129, 0),
        rotation: new Vector3(0, degToRad(-28.22), 0),
      },
      {
        position: new Vector3(0, -0.129, 0),
        rotation: new Vector3(0, degToRad(+28.22), 0),
      },
      {
        position: new Vector3(0, -0.129, 0),
        rotation: new Vector3(0, degToRad(-28.22), 0),
      },
    ];
    // debug GUI
    if (debugParams.worldAxis) {
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
    this.scene.add(this.bagMesh);
    // load soundeffects
    const loadedSoundEffects = await loadPunchingBagSoundeffects();
    this.audioManager.addPunchSoundeffects(loadedSoundEffects);
    // behaviours dependent on asynchronously loaded assets
    this.targetBehaviour = new TargetBehaviour(
      this.container,
      this.bagMesh,
      this.targetMesh,
      this.camera,
      this.audioManager,
      this.targetHitOrigins,
      this.gameSettings,
    );
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
