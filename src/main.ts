import { IOptions, World } from "./World/World.js";
import { GUI, SupportedMenuItemTypes, TMenuItem } from "./GUI/GUI.js";
import { GameOverData } from "./World/systems/events.js";

async function main() {
  const container = document.querySelector<HTMLDivElement>("#scene-container");
  // create game scene (called World)
  const options: IOptions = {
    initialPoints: 100,
    minimumPoints: 0,
    nbrTargets: 20,
    startReactionTime: 10000,
    endReactionTime: 200,
    progression: "linear",
    keyboardTargetActivated: false,
    countdown: 3,
    debugGUI: false,
    worldAxis: false,
    statsGUI: true,
  };
  enum Difficulty {
    Easy = "easy",
    Medium = "medium",
    Hard = "hard",
    Impossible = "impossible",
  }
  const menuItems: TMenuItem[] = [
    {
      type: SupportedMenuItemTypes.InputSpinner,
      id: "select-difficulty-switch",
      defaultOptionIdx: 1,
      options: [
        Difficulty.Easy,
        Difficulty.Medium,
        Difficulty.Hard,
        Difficulty.Impossible,
      ],
      onChange: (diff: string) => {
        switch (diff) {
          case Difficulty.Easy:
            options.progression = "linear";
            options.startReactionTime = 8500;
            options.endReactionTime = 850;
            break;
          case Difficulty.Medium:
            options.progression = "linear";
            options.startReactionTime = 5000;
            options.endReactionTime = 500;
            break;
          case Difficulty.Hard:
            options.progression = "exponential";
            options.startReactionTime = 3600;
            options.endReactionTime = 360;
            break;
          case Difficulty.Impossible:
            options.progression = "exponential";
            options.startReactionTime = 2000;
            options.endReactionTime = 200;
            break;
          default:
            break;
        }
      },
    },
    {
      type: SupportedMenuItemTypes.Button,
      id: "start-simulation-btn",
      text: "START SIMULATION",
      onClick: () => startGameCallback(),
    },
    {
      type: SupportedMenuItemTypes.Button,
      id: "about-us-btn",
      text: "ABOUT US",
      onClick: () =>
        (window.location.href = "https://www.gofitko.com/about-us"),
    },
    {
      type: SupportedMenuItemTypes.Button,
      id: "exit-btn",
      text: "EXIT",
      onClick: () => (window.location.href = "https://www.gofitko.com/"),
    },
  ];
  let bestReaction = Infinity;
  if (container == null) throw new Error("#scene-container not found in DOM.");
  const world = new World(container, options);
  await world.init();
  // render background image once
  world.render();
  // create game GUI
  const gui = new GUI(container, menuItems);
  const restartGameCallback = () => {
    bestReaction = Infinity;
    world.resumeLoop();
    world.startGame();
    gui.clearEndGameUI();
    gui.addInGameUI();
    gui.updateTotalScore(100);
    gui.updateTargetsHit(0, options.nbrTargets);
    gui.setPunchingBoxCursor();
  };
  const startGameCallback = () => {
    bestReaction = Infinity;
    world.startLoop();
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
  container.addEventListener("camtransitiontostartend", () => {
    world.pauseLoop();
  });
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
    gui.addCountdownCounter(options.countdown);
  });
  container.addEventListener("countdownend", (_) => {
    gui.clearCountdownCounter();
  });
}

main().catch((err) => {
  console.error(err);
});
