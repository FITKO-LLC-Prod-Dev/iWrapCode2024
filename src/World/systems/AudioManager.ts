import { Audio, AudioListener } from "three";

class AudioManager {
    readonly listener: AudioListener;
    readonly sound: Audio;
    punchSoundeffects: Array<AudioBuffer>;

    constructor(listener: AudioListener) {
        this.listener = listener;
        this.sound = new Audio(this.listener);
        this.sound.setLoop(false);
        this.punchSoundeffects = [];
    }

    addPunchSoundeffect(soundeffect: AudioBuffer): void {
        this.punchSoundeffects.push(soundeffect);
    }

    addPunchSoundeffects(soundeffects: Array<AudioBuffer>): void {
        this.punchSoundeffects = this.punchSoundeffects.concat(soundeffects);
    }

    playPunchSoundeffectRandomly() {
        this.sound.stop();
        const randomSoundeffect = this.punchSoundeffects[Math.floor((Math.random() * this.punchSoundeffects.length))];
        this.sound.setBuffer(randomSoundeffect);
        this.sound.play();
    }
}

export { AudioManager };
