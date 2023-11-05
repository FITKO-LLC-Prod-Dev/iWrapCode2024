import { Object3D, Vector3 } from "three";

interface TargetHitOrigin {
    position: Vector3;
    rotation: Vector3;
}

class TargetBehaviour {
    constructor(target: Object3D, localTargetHitOrigins: Array<TargetHitOrigin>) {
        
    }

    /** Randomly repositions the target */
    randomlyReposition() {
    }
}

export { TargetBehaviour };
