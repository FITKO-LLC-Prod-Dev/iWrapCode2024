import { Clock } from "three";
import { GameObject } from "./interfaces.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

class Engine {
    readonly composer: EffectComposer;
    readonly clock: Clock;
    updatables: Array<GameObject>;

    constructor(composer: EffectComposer) {
        this.composer = composer;
        this.updatables = [];
        this.clock = new Clock();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const delta = this.clock.getDelta();
        for (const gameObject of this.updatables) {
            gameObject.update(delta);
        }
        this.composer.render();
    }

    stop() {
        // TODO: implement animation stop for efficiency
    }
}

export { Engine };
