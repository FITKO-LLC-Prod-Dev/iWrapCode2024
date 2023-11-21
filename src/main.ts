import { World } from "./World/World.js";
import { GUI } from "./GUI/GUI.js";

async function main() {
  const container = document.querySelector<HTMLDivElement>("#scene-container");
  if (container == null) throw new Error("#scene-container not found in DOM.");
  // create game scene (called World)
  const world = new World(container, {
    initialPoints: 1000,
    minimumPoints: 0,
    nbrTargets: 20,
    startReactionTime: 10000,
    endReactionTime: 1000,
    progression: "linear",
    keyboardTargetActivated: false,
    debugGUI: false,
    worldAxis: false,
  });
  await world.init();
  world.startLoop();
  // create game GUI
  const gui = new GUI(container);
  const startGameCallback = () => {
    world.startGame();
    gui.addTargetsHit();
    gui.addInGameUI();
  };
  gui.addStartButton(startGameCallback);
  // add event listeners
  container.addEventListener("gameover", (_) => {
    gui.clearTargetsHit();
    gui.clearTimerProgressBar();
    gui.clearInGameUI();
    gui.addRestartButton(startGameCallback);
  });
  container.addEventListener("targetspawn", (ev) => {
    gui.addTimerProgressBar(ev.detail.remainingTime);
  });
  container.addEventListener("targethit", (ev) => {
    gui.updateTargetsHit(ev.detail.nbrTargetsHit);
  });
}

main().catch((err) => {
  console.error(err);
});
