import { PerspectiveCamera } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

interface GameObject {
  start?: () => void;
  update: (delta: number) => void;
  setUID: (uid: number) => void;
  getUID: () => number | undefined;
}

interface IComposerWrapper extends EffectComposer {
  updateSize: (container: HTMLElement) => void;
}

interface ICameraWrapper {
  getCamera: () => PerspectiveCamera;
  setCameraAccordingToRatio: () => void;
  updateCameraAccordingToRatio: () => void;
}

export { GameObject, IComposerWrapper, ICameraWrapper };
