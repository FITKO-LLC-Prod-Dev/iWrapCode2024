import {
  Camera,
  Clock,
  Mesh,
  Object3D,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import { AudioManager } from "./AudioManager.js";
import {
  createTargetHitEvent,
  createTargetMissEvent,
  createTargetSpawnEvent,
  createGameOverEvent,
  createGameStartEvent,
} from "./events.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { Engine } from "./Engine.js";

interface TargetHitOrigin {
  position: Vector3;
  rotation: Vector3;
}

interface IGameSettings {
  initialPoints: number;
  minimumPoints: number;
  nbrTargets: number;
  startReactionTime: number;
  endReactionTime: number;
  progression: "constant" | "linear" | "exponential";
  keyboardTargetActivated: boolean;
  countdown: number;
}

class TargetBehaviour {
  readonly container: HTMLElement;
  readonly engine: Engine;
  readonly punchingBag: Mesh;
  readonly target: Object3D;
  readonly camera: Camera;
  readonly audioManager: AudioManager;
  readonly localTargetHitOrigins: Array<TargetHitOrigin>;
  readonly raycaster: Raycaster;
  readonly onPunchAttemptRef: (e: MouseEvent) => void;
  readonly clock: Clock;
  readonly gameSettings: IGameSettings;
  readonly reactionTimeSampler: (d: number) => number;
  previousTargetIdx?: number;
  nbrTargetsHit: number;
  private timeoutId?: number;
  nbrTargetsMissed: number;
  scoreMultiplier: number;
  points: number;
  // holds reference to the Mesh that contains valid shape keys
  actualMesh: Mesh;

  constructor(
    container: HTMLElement,
    engine: Engine,
    punchingBag: Mesh,
    target: Object3D,
    camera: Camera,
    audioManager: AudioManager,
    localTargetHitOrigins: Array<TargetHitOrigin>,
    gameSettings: IGameSettings,
    gui?: GUI,
  ) {
    this.container = container;
    this.engine = engine;
    this.punchingBag = punchingBag;
    this.target = target;
    this.camera = camera;
    this.audioManager = audioManager;
    this.localTargetHitOrigins = localTargetHitOrigins;
    this.gameSettings = gameSettings;
    this.raycaster = new Raycaster();
    // it is expected to be in [0, 1]
    switch (this.gameSettings.progression) {
      case "constant":
        this.reactionTimeSampler = (_: number) =>
          this.gameSettings.startReactionTime;
        this.scoreMultiplier = 1;
        break;
      case "linear":
        this.reactionTimeSampler = (t: number) =>
          Math.floor(
            -t *
              (this.gameSettings.startReactionTime -
                this.gameSettings.endReactionTime) +
              this.gameSettings.startReactionTime,
          );
        this.scoreMultiplier = 2;
        break;
      case "exponential": {
        const a: number =
          (Math.exp(1) *
            (this.gameSettings.startReactionTime -
              this.gameSettings.endReactionTime)) /
          (Math.exp(1) - 1);
        const b: number =
          (Math.exp(1) * this.gameSettings.endReactionTime -
            this.gameSettings.startReactionTime) /
          (Math.exp(1) - 1);
        this.reactionTimeSampler = (t: number) =>
          Math.floor(a * Math.exp(-t) + b);
        this.scoreMultiplier = 5;
        break;
      }
    }
    // statistics
    this.nbrTargetsHit = 0;
    this.nbrTargetsMissed = 0;
    this.points = gameSettings.initialPoints;
    // persistent references
    this.onPunchAttemptRef = this.onPunchAttempt.bind(this);
    this.timeoutId = undefined;
    // clock
    this.clock = new Clock(false);
    this.punchingBag.morphTargetDictionary;
    // for some reason child 1 is the one that only works...
    this.actualMesh = this.punchingBag.children[1] as Mesh;
    // debugging
    if (gui !== undefined) {
      if (
        this.actualMesh.morphTargetDictionary !== undefined &&
        this.actualMesh.morphTargetInfluences !== undefined
      ) {
        const shapeKeysFolder = gui.addFolder("Shape Keys");
        const shapeKeyNames = Object.keys(
          this.actualMesh.morphTargetDictionary,
        );
        for (let i = 0; i < shapeKeyNames.length; i++) {
          shapeKeysFolder
            .add(this.actualMesh.morphTargetInfluences, i, 0.0, 1.0)
            .name(shapeKeyNames[i]);
        }
      }
    }
  }

  start(): void {
    this.clock.start();
    this.container.dispatchEvent(createGameStartEvent(this.gameSettings));
    this.punchingBag.add(this.target);
    this.nextTarget();
  }

  reset(): void {
    // reset statistics
    this.nbrTargetsHit = 0;
    this.nbrTargetsMissed = 0;
    this.points = this.gameSettings.initialPoints;
    // reset previous target idx
    this.previousTargetIdx = undefined;
  }

  stop(): void {
    document.removeEventListener("click", this.onPunchAttemptRef);
    this.clearTimeout();
    this.clock.stop();
    this.punchingBag.remove(this.target);
  }

  private setTimeout(reactionTime: number): void {
    this.timeoutId = setTimeout(this.onFailure.bind(this), reactionTime);
  }

  private clearTimeout(): void {
    clearTimeout(this.timeoutId);
    this.timeoutId = undefined;
  }

  nextTarget(): void {
    const currentHitOrigin = this.getRandomHitOrigin();
    this.target.position.set(
      currentHitOrigin.position.x,
      currentHitOrigin.position.y,
      currentHitOrigin.position.z,
    );
    this.target.rotation.setFromVector3(currentHitOrigin.rotation);
    const reactionTime = this.reactionTimeSampler(
      this.nbrTargetsHit / this.gameSettings.nbrTargets,
    );
    this.setTimeout(reactionTime);
    console.log(`Reaction time timeout: ${reactionTime}`);
    this.container.dispatchEvent(
      createTargetSpawnEvent({
        time: this.clock.getElapsedTime(),
        remainingTime: reactionTime,
        targetNumber: this.nbrTargetsHit + 1,
      }),
    );
    document.addEventListener("click", this.onPunchAttemptRef);
    this.clock.getDelta();
  }

  onPunchAttempt(e: MouseEvent): void {
    const pointer = new Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1,
    );
    this.raycaster.setFromCamera(pointer, this.camera);
    const intersectRes = this.raycaster.intersectObject(this.target, false);
    // if target was hit
    if (intersectRes.length > 0) {
      this.audioManager.playPunchSoundeffectRandomly();
      // play hit shape key animation
      this.engine.addBehaviour(
        new TargetPunchAnimationBehaviour(
          this.engine,
          this.actualMesh,
          this.previousTargetIdx!,
        ),
      );
      this.nbrTargetsHit++;
      const reactionTime: number = this.clock.getDelta() * 1000;
      const deltaPoints: number =
        Math.floor(30000 / reactionTime) * this.scoreMultiplier;
      this.points += deltaPoints;
      this.container.dispatchEvent(
        createTargetHitEvent({
          time: this.clock.elapsedTime,
          reactionTime: reactionTime,
          hitWith: "mouse",
          hitPoint: new Vector2(e.clientX, e.clientY),
          deltaPoints: deltaPoints,
          nbrTargetsHit: this.nbrTargetsHit,
          points: this.points,
        }),
      );
      this.clearTimeout();
      if (this.nbrTargetsHit == this.gameSettings.nbrTargets) {
        this.onSuccess();
        return;
      }
      document.removeEventListener("click", this.onPunchAttemptRef);
      this.nextTarget();
    } else {
      const deltaPoints = -5 * this.scoreMultiplier * this.nbrTargetsMissed;
      this.points += deltaPoints;
      ++this.nbrTargetsMissed;
      this.container.dispatchEvent(
        createTargetMissEvent({
          time: this.clock.getElapsedTime(),
          missWith: "mouse",
          missPoint: pointer,
          deltaPoints: deltaPoints,
          nbrTargetsMissed: this.nbrTargetsMissed,
          points: this.points,
        }),
      );
      if (this.points < this.gameSettings.minimumPoints) {
        this.onFailure();
        return;
      }
      this.audioManager.playTargetMissedSoundeffect();
    }
  }

  private onSuccess(): void {
    this.stop();
    console.log(`Gameover Success: ${this.nbrTargetsHit}`);
    this.container.dispatchEvent(
      createGameOverEvent({
        time: this.clock.getElapsedTime(),
        success: true,
        nbrHits: this.nbrTargetsHit,
        nbrMisses: this.nbrTargetsMissed,
        points: this.points,
      }),
    );
    this.reset();
    this.audioManager.playSuccessSoundeffect();
  }

  private onFailure(): void {
    this.stop();
    console.log("Gameover Failure", {
      time: this.clock.getElapsedTime(),
      success: false,
      nbrHits: this.nbrTargetsHit,
      nbrMisses: this.nbrTargetsMissed,
      points: this.points,
    });
    document.removeEventListener<"click">("click", this.onPunchAttemptRef);
    this.container.dispatchEvent(
      createGameOverEvent({
        time: this.clock.getElapsedTime(),
        success: false,
        nbrHits: this.nbrTargetsHit,
        nbrMisses: this.nbrTargetsMissed,
        points: this.points,
      }),
    );
    this.reset();
    this.audioManager.playFailureSoundeffect();
  }

  getRandomHitOrigin(): TargetHitOrigin {
    let newIdx = Math.floor(
      Math.random() *
        (this.localTargetHitOrigins.length - (this.previousTargetIdx ? 1 : 0)),
    );
    if (this.previousTargetIdx && newIdx >= this.previousTargetIdx) {
      ++newIdx;
    }
    this.previousTargetIdx = newIdx;
    return this.localTargetHitOrigins[newIdx];
  }
}

class TargetPunchAnimationBehaviour {
  private readonly engine: Engine;
  private readonly coverMesh: Mesh;
  private readonly targetIdx: number;
  private readonly inwardAnimationSpeed: number;
  private readonly outwardAnimationSpeed: number;
  private reverse: boolean;
  public uid?: number;

  constructor(
    engine: Engine,
    coverMesh: Mesh,
    targetIdx: number,
    inwardAnimationSpeed: number = 6.4,
    outwardAnimationSpeed: number = 0.7,
  ) {
    this.engine = engine;
    this.coverMesh = coverMesh;
    this.targetIdx = targetIdx;
    this.inwardAnimationSpeed = inwardAnimationSpeed;
    this.outwardAnimationSpeed = outwardAnimationSpeed;
    this.reverse = false;
  }

  update(delta: number) {
    if (!this.reverse) {
      let newInfluence =
        this.coverMesh.morphTargetInfluences![this.targetIdx] +
        delta * this.inwardAnimationSpeed;
      if (newInfluence > 1.0) {
        newInfluence = 1.0;
        this.reverse = true;
      }
      this.coverMesh.morphTargetInfluences![this.targetIdx] = newInfluence;
      return;
    }
    let newInfluence =
      this.coverMesh.morphTargetInfluences![this.targetIdx] -
      delta * this.outwardAnimationSpeed;
    if (newInfluence < 0.0) {
      newInfluence = 0.0;
      this.engine.removeBehaviour(this.uid!);
    }
    this.coverMesh.morphTargetInfluences![this.targetIdx] = newInfluence;
  }

  setUID(uid: number) {
    this.uid = uid;
  }

  getUID() {
    return this.uid;
  }
}

export { TargetBehaviour, TargetHitOrigin, IGameSettings };
