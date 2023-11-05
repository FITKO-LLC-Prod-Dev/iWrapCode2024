import { AudioListener, Object3D } from "three";

function createAudioListener(attachTo: Object3D): AudioListener {
    const listener = new AudioListener();
    attachTo.add(listener);
    return listener;
}

export { createAudioListener };
