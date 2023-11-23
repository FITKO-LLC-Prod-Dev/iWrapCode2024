import { World } from "./World/World.js";
import { GUI } from "./GUI/GUI.js";

async function main() {
  const container = document.querySelector<HTMLDivElement>("#scene-container");
  let bestReaction = Infinity;
  if (container == null) throw new Error("#scene-container not found in DOM.");
  // create game scene (called World)
  const totalNbrTargets = 20;
  const countdown = 3;
  const world = new World(container, {
    initialPoints: 1000,
    minimumPoints: 0,
    nbrTargets: totalNbrTargets,
    startReactionTime: 10000,
    endReactionTime: 1000,
    progression: "linear",
    keyboardTargetActivated: false,
    countdown: countdown,
    debugGUI: false,
    worldAxis: false,
  });
  await world.init();
  world.startLoop();
  // create game GUI
  const gui = new GUI(container);
  const startGameCallback = () => {
    bestReaction = Infinity;
    world.startGame();
    gui.addTargetsHit();
    gui.addTargetsMissed();
    gui.addBestReaction();
    gui.addInGameUI();
  };
  const endGameCallback = () => {
    gui.clearTargetsHit();
    gui.clearTargetsMissed();
    gui.clearTimerProgressBar();
    gui.clearBestReaction();
    gui.clearInGameUI();
    gui.clearCountdownCounter();
    gui.addRestartButton(startGameCallback);
  };
  gui.addStartButton(startGameCallback);
  // add event listeners
  container.addEventListener("gameover", endGameCallback);
  container.addEventListener("targetspawn", (ev) => {
    gui.addTimerProgressBar(ev.detail.remainingTime);
  });
  container.addEventListener("targethit", (ev) => {
    gui.updateTargetsHit(ev.detail.nbrTargetsHit, totalNbrTargets);
    if (ev.detail.reactionTime < bestReaction) {
      bestReaction = ev.detail.reactionTime;
      gui.updateBestReaction(bestReaction);
    }
  });
  container.addEventListener("targetmiss", (ev) => {
    gui.updateTargetsMissed(ev.detail.nbrTargetsMissed);
  });
  container.addEventListener("countdownstart", (_) => {
    console.log("Countdow started");
    gui.addCountdownCounter(countdown);
  });
  container.addEventListener("countdownend", (_) => {
    console.log("Countdow ended");
    gui.clearCountdownCounter();
  });
}

main().catch((err) => {
  console.error(err);
});
