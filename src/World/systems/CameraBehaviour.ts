import { Camera, PerspectiveCamera, Vector3 } from "three";
import { Engine } from "./Engine.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { GameObject } from "./interfaces.js";

class CameraBehaviour {
  private readonly engine: Engine;
  private readonly camera: PerspectiveCamera;
  private transitionSpeed: number; // in percents per remaining distance per second
  private currentTransitionUID: number | undefined;
  private cameraStartPosition = new Vector3(0, 1.5, 3.5);
  private cameraStartTarget = new Vector3(-1.5, 0.8, 0.0);
  private cameraGamePosition = new Vector3(0, 2.2, 2.5);
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

  public getStartPosition(): Vector3 {
    return this.cameraStartPosition;
  }

  public updateStartPosition(newPos: Vector3): void {
    this.cameraStartPosition = newPos;
    this.camera.position.set(
      this.cameraStartPosition.x,
      this.cameraStartPosition.y,
      this.cameraStartPosition.z,
    );
  }

  public transitionToGameState(callback?: () => void): void {
    this.transitionTo(
      this.cameraGamePosition,
      this.cameraStartTarget,
      this.cameraGameTarget,
      callback,
    );
  }

  public transitionToStartState(callback?: () => void): void {
    this.transitionTo(
      this.cameraStartPosition,
      this.cameraGameTarget,
      this.cameraStartTarget,
      callback,
    );
  }

  private transitionTo(
    finalPosition: Vector3,
    initialTarget: Vector3,
    finalTarget: Vector3,
    callback?: () => void,
  ): void {
    if (this.currentTransitionUID !== undefined) {
      this.engine.removeBehaviour(this.currentTransitionUID);
      this.currentTransitionUID = undefined;
    }
    this.currentTransitionUID = this.engine
      .addBehaviour(
        new CameraTransitionBehaviour(
          this.camera,
          finalPosition,
          initialTarget,
          finalTarget,
          this.transitionSpeed,
          () => {
            this.engine.removeBehaviour(this.currentTransitionUID!);
            this.currentTransitionUID = undefined;
            if (callback) callback();
          },
        ),
      )
      .getUID();
  }
}

class CameraTransitionBehaviour implements GameObject {
  private readonly camera: Camera;
  private readonly finalPosition: Vector3;
  private readonly initialTarget: Vector3;
  private readonly finalTarget: Vector3;
  private readonly transitionSpeed: number;
  private readonly onTransitionEnd: () => void;
  private uid?: number;
  constructor(
    camera: Camera,
    finalPosition: Vector3,
    initialTarget: Vector3,
    finalTarget: Vector3,
    transitionSpeed: number,
    onTransitionEnd: () => void,
  ) {
    this.camera = camera;
    this.finalPosition = finalPosition;
    this.initialTarget = new Vector3();
    this.initialTarget.copy(initialTarget);
    this.finalTarget = finalTarget;
    this.transitionSpeed = transitionSpeed;
    this.onTransitionEnd = onTransitionEnd;
  }

  public update(delta: number) {
    const t = delta * this.transitionSpeed;
    this.camera.position.lerp(this.finalPosition, t);
    this.camera.lookAt(this.initialTarget.lerp(this.finalTarget, t));
    if (this.camera.position.distanceToSquared(this.finalPosition) <= 1e-6) {
      this.camera.position.copy(this.finalPosition);
      this.camera.lookAt(this.finalTarget);
      this.onTransitionEnd();
    }
  }

  public setUID(uid: number) {
    this.uid = uid;
  }

  public getUID(): number | undefined {
    return this.uid;
  }
}

export { CameraBehaviour };
