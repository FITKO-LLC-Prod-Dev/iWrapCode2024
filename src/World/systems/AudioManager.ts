import { Audio, AudioListener } from "three";

class AudioManager {
    readonly listener: AudioListener;
    readonly sound: Audio;
    punchSoundeffects: Array<AudioBuffer>;
    private countdownRepeat?: AudioBuffer;
    private countdownEnd?: AudioBuffer;
    currentCountdown?: number;

    constructor(listener: AudioListener) {
        this.listener = listener;
        this.sound = new Audio(this.listener);
        this.sound.setLoop(false);
        this.punchSoundeffects = [];
    }

    addCountdownRepeatSoundeffect(soundeffect: AudioBuffer): void {
        this.countdownRepeat = soundeffect;
    }

    addCountdownEndSoundeffect(soundeffect: AudioBuffer): void {
        this.countdownEnd = soundeffect;
    }

    addPunchSoundeffect(soundeffect: AudioBuffer): void {
        this.punchSoundeffects.push(soundeffect);
    }

    addPunchSoundeffects(soundeffects: Array<AudioBuffer>): void {
        this.punchSoundeffects = this.punchSoundeffects.concat(soundeffects);
    }

    public playCountdownAudios(countdown: number): void {
        this.currentCountdown = countdown;
        const callback = () => {
            this.sound.stop();
            if (this.currentCountdown == 0) {
                this.sound.setBuffer(this.countdownEnd!);
                this.sound.play();
                return;
            }
            this.sound.setBuffer(this.countdownRepeat!);
            this.sound.play();
            --this.currentCountdown!;
            setTimeout(callback, 1000);
        };
        callback();
    }

    playPunchSoundeffectRandomly() {
        this.sound.stop();
        const randomSoundeffect =
            this.punchSoundeffects[
            Math.floor(Math.random() * this.punchSoundeffects.length)
            ];
        this.sound.setBuffer(randomSoundeffect);
        this.sound.play();
    }
}

export { AudioManager };
