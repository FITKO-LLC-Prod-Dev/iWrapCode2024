import { AudioLoader } from "three";

async function loadPunchingBagSoundeffects(): Promise<Array<AudioBuffer>> {
    const audioLoader = new AudioLoader();
    audioLoader.setPath("/assets/soundeffects/");
    const loadedSoundeffects = await Promise.all([
        audioLoader.loadAsync("punching_bag_soundeffect_01.mp3"),
        audioLoader.loadAsync("punching_bag_soundeffect_02.mp3"),
        audioLoader.loadAsync("punching_bag_soundeffect_03.mp3"),
        audioLoader.loadAsync("punching_bag_soundeffect_04.mp3"),
        audioLoader.loadAsync("punching_bag_soundeffect_05.mp3"),
    ]);
    return loadedSoundeffects;
}

async function loadCountdownRepeatSoudeffect(): Promise<AudioBuffer> {
    const audioLoader = new AudioLoader();
    audioLoader.setPath("/assets/soundeffects/");
    const loadedSoundeffect = await audioLoader.loadAsync(
        "countdown_repeat_soundeffect.mp3",
    );
    return loadedSoundeffect;
}

async function loadCountdownEndSoundeffect(): Promise<AudioBuffer> {
    const audioLoader = new AudioLoader();
    audioLoader.setPath("/assets/soundeffects/");
    const loadedSoundeffect = await audioLoader.loadAsync(
        "countdown_end_soundeffect.mp3",
    );
    return loadedSoundeffect;
}

export {
    loadPunchingBagSoundeffects,
    loadCountdownRepeatSoudeffect,
    loadCountdownEndSoundeffect,
};
