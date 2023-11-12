import { Camera, Clock, Object3D, Raycaster, Vector2, Vector3 } from "three";
import { AudioManager } from "./AudioManager.js";
import {
  createTargetHitEvent,
  createTargetMissEvent,
  createTargetSpawnEvent,
  createGameOverEvent,
  createGameStartEvent,
} from "./events.js";

interface TargetHitOrigin {
  position: Vector3;
  rotation: Vector3;
}

interface GameSettings {
  initialPoints: number;
  minimumPoints: number;
  nbrTargets: number;
  startReactionTime: number;
  endReactionTime: number;
  progression: "constant" | "linear" | "exponential";
  keyboardTargetActivated: boolean;
}

class TargetBehaviour {
  readonly container: HTMLElement;
  readonly punchingBag: Object3D;
  readonly target: Object3D;
  readonly camera: Camera;
  readonly audioManager: AudioManager;
  readonly localTargetHitOrigins: Array<TargetHitOrigin>;
  readonly raycaster: Raycaster;
  readonly onPunchAttemptRef: (e: MouseEvent) => void;
  readonly clock: Clock;
  readonly gameSettings: GameSettings;
  readonly reactionTimeSampler: (d: number) => number;
  nbrTargetsHit: number;
  timeoutId: number;
  nbrTargetsMissed: number;
  points: number;

  constructor(
    container: HTMLElement,
    punchingBag: Object3D,
    target: Object3D,
    camera: Camera,
    audioManager: AudioManager,
    localTargetHitOrigins: Array<TargetHitOrigin>,
    gameSettings: GameSettings,
  ) {
    this.container = container;
    this.punchingBag = punchingBag;
    this.target = target;
    this.camera = camera;
    this.audioManager = audioManager;
    this.localTargetHitOrigins = localTargetHitOrigins;
    this.gameSettings = gameSettings;
    this.raycaster = new Raycaster();
    // t is expected to be in [0, 1]
    switch (this.gameSettings.progression) {
      case "constant":
        this.reactionTimeSampler = (_: number) =>
          this.gameSettings.startReactionTime;
        break;
      case "linear":
        this.reactionTimeSampler = (t: number) =>
          Math.floor(
            -t *
              (this.gameSettings.startReactionTime -
                this.gameSettings.endReactionTime) +
              this.gameSettings.startReactionTime,
          );
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
        break;
      }
    }
    // statistics
    this.nbrTargetsHit = 0;
    this.nbrTargetsMissed = 0;
    this.points = 0;
    // persistent references
    this.onPunchAttemptRef = this.onPunchAttempt.bind(this);
    this.timeoutId = -1;
    // clock
    this.clock = new Clock(false);
  }

  start(): void {
    this.clock.start();
    this.container.dispatchEvent(createGameStartEvent(this.gameSettings));
    this.punchingBag.add(this.target);
    document.addEventListener<"click">("click", this.onPunchAttemptRef);
    this.update();
  }

  stop(): void {
    this.clock.stop();
    document.removeEventListener<"click">("click", this.onPunchAttemptRef);
    clearTimeout(this.timeoutId);
    this.timeoutId = -1;
    this.punchingBag.remove(this.target);
  }

  update(): void {
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
    this.timeoutId = setTimeout(this.onFailure.bind(this), reactionTime);
    this.container.dispatchEvent(
      createTargetSpawnEvent({
        time: this.clock.getElapsedTime(),
        remainingTime: reactionTime,
        targetNumber: this.nbrTargetsHit + 1,
      }),
    );
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
      this.nbrTargetsHit++;
      const reactionTime: number = this.clock.getDelta() * 1000;
      const deltaPoints: number = 500 / reactionTime;
      this.points += deltaPoints;
      this.container.dispatchEvent(
        createTargetHitEvent({
          time: this.clock.elapsedTime,
          reactionTime: reactionTime,
          hitWith: "mouse",
          hitPoint: pointer,
          deltaPoints: deltaPoints,
        }),
      );
      this.audioManager.playPunchSoundeffectRandomly();
      clearTimeout(this.timeoutId);
      if (this.nbrTargetsHit >= this.gameSettings.nbrTargets) {
        this.onSuccess();
        return;
      }
      this.update();
    } else {
      const deltaPoints = -100;
      this.points += deltaPoints;
      this.container.dispatchEvent(
        createTargetMissEvent({
          time: this.clock.getElapsedTime(),
          missWith: "mouse",
          missPoint: pointer,
          deltaPoints: deltaPoints,
        }),
      );
    }
  }

  onSuccess(): void {
    this.container.dispatchEvent(
      createGameOverEvent({
        time: this.clock.getElapsedTime(),
        success: true,
        nbrHits: this.nbrTargetsHit,
        nbrMisses: this.nbrTargetsMissed,
        points: this.points,
      }),
    );
    this.stop();
  }

  onFailure(): void {
    this.container.dispatchEvent(
      createGameOverEvent({
        time: this.clock.getElapsedTime(),
        success: false,
        nbrHits: this.nbrTargetsHit,
        nbrMisses: this.nbrTargetsMissed,
        points: this.points,
      }),
    );
    this.stop();
  }

  getRandomHitOrigin(): TargetHitOrigin {
    return this.localTargetHitOrigins[
      Math.floor(Math.random() * this.localTargetHitOrigins.length)
    ];
  }
}

export { TargetBehaviour, TargetHitOrigin, GameSettings };
