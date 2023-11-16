import { World } from "./World/World.js";
import { GUI } from "./GUI/GUI.js";

async function main() {
  const container = document.querySelector<HTMLDivElement>("#scene-container");
  if (container == null) throw new Error("#scene-container not found in DOM.");
  // create game scene (called World)
  const world = new World(
    container,
    {
      initialPoints: 1000,
      minimumPoints: 0,
      nbrTargets: 30,
      startReactionTime: 100000,
      endReactionTime: 100000,
      progression: "constant",
      keyboardTargetActivated: false,
    },
    { debugGUI: false, worldAxis: false },
  );
  await world.init();
  world.startLoop();
  // create game GUI
  const gui = new GUI(container);
  gui.addStartButton(() => {
    world.startGame();
  });
  // add event listeners
  container.addEventListener("gameover", (ev) => {
    console.log(ev.detail);
    gui.addRestartButton(() => {
      world.startGame();
    });
  });
  container.addEventListener("targetspawn", (ev) => {
    console.log(ev.detail);
    gui.addTimerProgressBar(ev.detail.remainingTime);
  });
}

main().catch((err) => {
  console.error(err);
});
