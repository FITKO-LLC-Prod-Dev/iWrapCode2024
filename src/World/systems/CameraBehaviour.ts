import { PerspectiveCamera, Vector3 } from "three";
import { Engine } from "./Engine.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

class CameraBehaviour {
  private readonly engine: Engine;
  private readonly camera: PerspectiveCamera;
  private transitionSpeed: number; // in percents per remaining distance per second
  private transitionBehaviourID?: number;
  private cameraStartPosition = new Vector3(0, 1.5, 3.5);
  private cameraStartTarget = new Vector3(-1.5, 0.8, 0.0);
  private cameraGamePosition = new Vector3(0, 2.2, 2.4);
  private cameraGameTarget = new Vector3(0.0, 0.94, 0.0);

  constructor(
    engine: Engine,
    camera: PerspectiveCamera,
    gui?: GUI,
    transitionSpeed: number = 4.5,
  ) {
    this.engine = engine;
    this.camera = camera;
    // set initial camera position and target
    this.camera.position.set(
      this.cameraStartPosition.x,
      this.cameraStartPosition.y,
      this.cameraStartPosition.z,
    );
    this.camera.lookAt(this.cameraStartTarget);
    this.transitionSpeed = transitionSpeed;
    // debugging stuff
    if (gui !== undefined) {
      const camTarget = this.cameraStartTarget;
      const cameraFolder = gui.addFolder("Camera");
      const posFolder = cameraFolder.addFolder("Position");
      posFolder.add(camera.position, "x", -5, 5, 0.05).onChange((_: number) => {
        camera.lookAt(camTarget);
      });
      posFolder.add(camera.position, "y", 0, 5, 0.05).onChange((_: number) => {
        camera.lookAt(camTarget);
      });
      posFolder.add(camera.position, "z", 0, 5, 0.05).onChange((_: number) => {
        camera.lookAt(camTarget);
      });
      const targetFolder = cameraFolder.addFolder("Target");
      targetFolder.add(camTarget, "x", -5, 5, 0.05).onChange((_: number) => {
        camera.lookAt(camTarget);
      });
      targetFolder.add(camTarget, "y", 0, 3, 0.05).onChange((_: number) => {
        camera.lookAt(camTarget);
      });
      targetFolder.add(camTarget, "z", 0, 3, 0.05).onChange((_: number) => {
        camera.lookAt(camTarget);
      });
    }
  }

  public transitionToGameState(): void {
    this.transitionTo(
      this.cameraGamePosition,
      this.cameraStartTarget,
      this.cameraGameTarget,
    );
  }

  public transitionToStartState(): void {
    this.transitionTo(
      this.cameraStartPosition,
      this.cameraGameTarget,
      this.cameraStartTarget,
    );
  }

  private transitionTo(
    finalPosition: Vector3,
    initialTarget: Vector3,
    finalTarget: Vector3,
  ): void {
    if (this.transitionBehaviourID !== undefined) this.stopCurrentTransition();
    const copiedVect = new Vector3();
    copiedVect.copy(initialTarget);
    this.transitionBehaviourID = this.engine.addBehaviour({
      update: (delta: number) => {
        const t = delta * this.transitionSpeed;
        this.camera.position.lerp(finalPosition, t);
        const camTarget = copiedVect.lerp(finalTarget, t);
        this.camera.lookAt(camTarget);
        if (
          this.camera.position.distanceToSquared(finalPosition) <= 1e-6 &&
          camTarget.distanceToSquared(finalTarget) <= 1e-6
        ) {
          this.camera.position.copy(finalPosition);
          this.camera.lookAt(finalTarget);
          this.stopCurrentTransition();
        }
      },
    });
  }

  public stopCurrentTransition(): void {
    if (this.transitionBehaviourID !== undefined) {
      console.log("STOPED!", this.transitionBehaviourID);
      this.engine.removeBehaviour(this.transitionBehaviourID);
      this.transitionBehaviourID = undefined;
    }
  }
}

export { CameraBehaviour };
