import { Audio, AudioListener } from "three";

class AudioManager {
  readonly listener: AudioListener;
  readonly sound: Audio;
  punchSoundeffects: Array<AudioBuffer>;
  private countdownRepeat?: AudioBuffer;
  private countdownEnd?: AudioBuffer;
  private targetMissed?: AudioBuffer;
  private success?: AudioBuffer;
  private failure?: AudioBuffer;
  currentCountdown?: number;

  constructor(listener: AudioListener) {
    this.listener = listener;
    this.sound = new Audio(this.listener);
    this.sound.setLoop(false);
    this.punchSoundeffects = [];
  }

  public addSuccessSoundeffect(soundeffect: AudioBuffer): void {
    this.success = soundeffect;
  }

  public addFailureSoundeffect(soundeffect: AudioBuffer): void {
    this.failure = soundeffect;
  }

  public addTargetMissedSoundeffect(soundeffect: AudioBuffer): void {
    this.targetMissed = soundeffect;
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

  public playPunchSoundeffectRandomly() {
    this.sound.stop();
    const randomSoundeffect =
      this.punchSoundeffects[
        Math.floor(Math.random() * this.punchSoundeffects.length)
      ];
    this.sound.setBuffer(randomSoundeffect);
    this.sound.play();
  }

  public playTargetMissedSoundeffect() {
    this.sound.stop();
    this.sound.setBuffer(this.targetMissed!);
    this.sound.play();
  }

  public playSuccessSoundeffect() {
    this.sound.stop();
    this.sound.setBuffer(this.success!);
    this.sound.play();
  }

  public playFailureSoundeffect() {
    this.sound.stop();
    this.sound.setBuffer(this.failure!);
    this.sound.play();
  }
}

export { AudioManager };
