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

export { loadPunchingBagSoundeffects };
