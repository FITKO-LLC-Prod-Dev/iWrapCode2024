import { PerspectiveCamera, Vector3 } from "three";
import { Engine } from "./Engine.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

class CameraBehaviour {
  private readonly engine: Engine;
  private readonly camera: PerspectiveCamera;
  private transitionSpeed: number; // in meters per s
  private transitionBehaviourID?: number;
  cameraStartPosition = new Vector3(0, 1.5, 3.5);
  cameraStartTarget = new Vector3(-1.5, 0.8, 0.0);
  cameraGamePosition = new Vector3(0, 2.2, 2.4);
  cameraGameTarget = new Vector3(0.0, 0.94, 0.0);

  constructor(
    engine: Engine,
    camera: PerspectiveCamera,
    transitionSpeed: number = 1, // in meters per s
    gui: GUI | undefined = undefined,
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

  // TODO: optimize distance measurement by using squared distance
  private transitionTo(
    transitionToPosition: Vector3,
    initialTarget: Vector3,
    transitionToTarget: Vector3,
  ): void {
    const initialPosition = this.camera.position;
    const totalDistance = initialPosition.distanceTo(transitionToPosition);
    console.log(totalDistance);
    this.transitionBehaviourID = this.engine.addBehaviour({
      update: (delta: number) => {
        const t =
          (initialPosition.distanceTo(this.camera.position) +
            delta * this.transitionSpeed) /
          totalDistance;
        this.camera.position.lerpVectors(
          initialPosition,
          transitionToPosition,
          t,
        );
        this.camera.lookAt(initialTarget.lerp(transitionToTarget, t));
        if (t > 1.0) this.stopCurrentTransition();
      },
    });
  }

  public stopCurrentTransition(): void {
    if (this.transitionBehaviourID)
      this.engine.removeBehaviour(this.transitionBehaviourID);
  }
}

export { CameraBehaviour };
