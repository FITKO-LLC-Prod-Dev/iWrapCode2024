import { Clock } from "three";
import { GameObject } from "./interfaces.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

class Engine {
  readonly composer: EffectComposer;
  readonly clock: Clock;
  private updatables: Map<number, GameObject>;
  // to generate unique IDs
  private uid = 0;
  private requestID?: number;

  constructor(composer: EffectComposer) {
    this.composer = composer;
    this.updatables = new Map<number, GameObject>();
    this.clock = new Clock();
  }

  private animate() {
    this.requestID = requestAnimationFrame(this.animate.bind(this));
    const delta = this.clock.getDelta();
    for (const [_, gameObject] of this.updatables) {
      gameObject.update(delta);
    }
    this.composer.render();
  }

  public addBehaviour<T extends GameObject>(behaviour: T): T {
    this.updatables.set(this.uid, behaviour);
    behaviour.setUID(this.uid);
    ++this.uid;
    return behaviour;
  }

  public removeBehaviour(uid: number): void {
    if (!this.updatables.delete(uid))
      console.warn(
        `Attempt to remove a non-existing behaviour with uid ${uid}`,
      );
  }

  public start(): void {
    // only start if engine isn't running
    if (this.requestID === undefined) {
      for (const [_, gameObject] of this.updatables) {
        if (gameObject.start) gameObject.start();
      }
      this.animate();
    }
  }

  public pause(): void {
    if (this.requestID) cancelAnimationFrame(this.requestID);
    this.requestID = undefined;
  }

  public resume(): void {
    if (this.requestID === undefined) this.animate();
  }
}

export { Engine };
