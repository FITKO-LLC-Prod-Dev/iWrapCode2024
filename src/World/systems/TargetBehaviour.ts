import { Camera, Object3D, Raycaster, Vector2, Vector3 } from "three";
import { AudioManager } from "./AudioManager.js";

interface TargetHitOrigin {
    position: Vector3;
    rotation: Vector3;
}

class TargetBehaviour {
    readonly punchingBag: Object3D;
    readonly target: Object3D;
    readonly camera: Camera;
    readonly audioManager: AudioManager;
    readonly localTargetHitOrigins: Array<TargetHitOrigin>;
    readonly deltaTimeSampler: (difficuly: number) => number;
    readonly raycaster: Raycaster;
    readonly onPunchAttemptRef: (e: MouseEvent) => void;
    readonly maxHits: number;
    nbrTargetsHit: number;
    timeoutId: number;
    nbrTargetsMissed: number;

    constructor(punchingBag: Object3D, target: Object3D, camera: Camera, audioManager: AudioManager,
        localTargetHitOrigins: Array<TargetHitOrigin>,
        deltaTimeSampler: (difficuly: number) => number, maxHits: number) {
        this.punchingBag = punchingBag;
        this.target = target;
        this.camera = camera;
        this.audioManager = audioManager;
        this.localTargetHitOrigins = localTargetHitOrigins;
        this.deltaTimeSampler = deltaTimeSampler;
        this.maxHits = maxHits;
        this.raycaster = new Raycaster();
        // statistics
        this.nbrTargetsHit = 0;
        this.nbrTargetsMissed = 0;
        // persistent references
        this.onPunchAttemptRef = this.onPunchAttempt.bind(this);
        this.timeoutId = -1;
    }

    start(): void {
        this.punchingBag.add(this.target);
        document.addEventListener<"click">("click", this.onPunchAttemptRef);
        this.update();
    }

    pause(): void {
        // TODO: implement target hitting pause
    }

    stop(): void {
        document.removeEventListener<"click">("click", this.onPunchAttemptRef);
        clearTimeout(this.timeoutId);
        this.timeoutId = -1;
        this.punchingBag.remove(this.target);
    }

    update(): void {
        const currentHitOrigin = this.getRandomHitOrigin();
        this.target.position.set(currentHitOrigin.position.x, currentHitOrigin.position.y, currentHitOrigin.position.z);
        this.target.rotation.setFromVector3(currentHitOrigin.rotation);
        this.timeoutId = setTimeout(this.onFailure.bind(this), this.deltaTimeSampler(this.nbrTargetsHit / this.maxHits));
    }

    onPunchAttempt(e: MouseEvent): void {
        const pointer = new Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
        this.raycaster.setFromCamera(pointer, this.camera);
        const intersectRes = this.raycaster.intersectObject(this.target, false);
        if (intersectRes.length > 0) {
            this.audioManager.playPunchSoundeffectRandomly();
            this.nbrTargetsHit++;
            clearTimeout(this.timeoutId);
            if (this.nbrTargetsHit >= this.maxHits) {
                this.onSuccess();
                return;
            }
            this.update();
        }
    }

    onSuccess(): void {
        console.log(`You hit all ${this.maxHits} targets! You are NOT human!`);
        this.stop();
    }

    onFailure(): void {
        console.log(`You failed! You hit ${this.nbrTargetsHit} out of ${this.maxHits}`);
        this.stop();
    }

    getRandomHitOrigin(): TargetHitOrigin {
        return this.localTargetHitOrigins[Math.floor(Math.random() * this.localTargetHitOrigins.length)];
    }

}

export { TargetBehaviour, TargetHitOrigin };
