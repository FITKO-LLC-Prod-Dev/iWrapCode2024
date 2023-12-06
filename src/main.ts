import { IOptions, World } from "./World/World.js";
import { GUI } from "./GUI/GUI.js";
import { GameOverData } from "./World/systems/events.js";

async function main() {
  const container = document.querySelector<HTMLDivElement>("#scene-container");
  const menuItems = [
    {
      id: "start-simulation-btn",
      text: "START SIMULATION",
      onClick: () => startGameCallback(),
    },
    {
      id: "about-us-btn",
      text: "ABOUT US",
      onClick: () =>
        (window.location.href = "https://www.gofitko.com/about-us"),
    },
    {
      id: "exit-btn",
      text: "EXIT",
      onClick: () => (window.location.href = "https://www.gofitko.com/"),
    },
  ];
  let bestReaction = Infinity;
  if (container == null) throw new Error("#scene-container not found in DOM.");
  // create game scene (called World)
  const options: IOptions = {
    initialPoints: 100,
    minimumPoints: 0,
    nbrTargets: 20,
    startReactionTime: 10000000,
    endReactionTime: 1000000,
    progression: "linear",
    keyboardTargetActivated: false,
    countdown: 3,
    debugGUI: false,
    worldAxis: false,
  };
  const world = new World(container, options);
  await world.init();
  world.startLoop();
  // create game GUI
  const gui = new GUI(container, menuItems);
  const restartGameCallback = () => {
    bestReaction = Infinity;
    world.startGame();
    gui.clearEndGameUI();
    gui.addInGameUI();
    gui.updateTotalScore(100);
    gui.updateTargetsHit(0, options.nbrTargets);
    gui.setPunchingBoxCursor();
  };
  const startGameCallback = () => {
    bestReaction = Infinity;
    world.startGame();
    gui.clearStartMenuUI();
    gui.addInGameUI();
    gui.updateTotalScore(100);
    gui.updateTargetsHit(0, options.nbrTargets);
    gui.setPunchingBoxCursor();
  };
  const endGameCallback = (ev: CustomEvent<GameOverData>) => {
    gui.clearInGameUI();
    gui.resetCursor();
    gui.addEndGameUI(restartGameCallback, ev.detail, bestReaction);
  };
  // add event listeners
  container.addEventListener("gameover", endGameCallback);
  container.addEventListener("targetspawn", (ev) => {
    gui.addTimerProgressBar(ev.detail.remainingTime);
  });
  container.addEventListener("targethit", (ev) => {
    const isBestReaction = ev.detail.reactionTime < bestReaction;
    gui.updateTotalScore(ev.detail.points);
    gui.updateTargetsHit(ev.detail.nbrTargetsHit, options.nbrTargets);
    gui.addReactionTimePopup(
      ev.detail.hitPoint.x,
      ev.detail.hitPoint.y,
      ev.detail.reactionTime,
      isBestReaction,
    );
    if (isBestReaction) {
      bestReaction = ev.detail.reactionTime;
      gui.updateBestReaction(bestReaction);
    }
  });
  container.addEventListener("targetmiss", (ev) => {
    gui.updateTotalScore(ev.detail.points);
    gui.updateTargetsMissed(ev.detail.nbrTargetsMissed);
  });
  container.addEventListener("countdownstart", (_) => {
    console.log("Countdow started");
    gui.addCountdownCounter(options.countdown);
  });
  container.addEventListener("countdownend", (_) => {
    console.log("Countdow ended");
    gui.clearCountdownCounter();
  });
}

main().catch((err) => {
  console.error(err);
});
