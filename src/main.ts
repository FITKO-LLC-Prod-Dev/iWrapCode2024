import { IOptions, World } from "./World/World.js";
import { GUI } from "./GUI/GUI.js";

async function main() {
    const container = document.querySelector<HTMLDivElement>("#scene-container");
    let bestReaction = Infinity;
    if (container == null) throw new Error("#scene-container not found in DOM.");
    // create game scene (called World)
    const options: IOptions = {
        initialPoints: 100,
        minimumPoints: 0,
        nbrTargets: 20,
        startReactionTime: 10000,
        endReactionTime: 1000,
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
    const gui = new GUI(container);
    const startGameCallback = () => {
        bestReaction = Infinity;
        world.startGame();
        gui.addTotalScore();
        gui.addTargetsHit();
        gui.addTargetsMissed();
        gui.addBestReaction();
        gui.addInGameUI();
        gui.updateTotalScore(100);
        gui.updateTargetsHit(0, options.nbrTargets);
    };
    const endGameCallback = () => {
        gui.clearTotalScore();
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
        gui.updateTotalScore(ev.detail.points);
        gui.updateTargetsHit(ev.detail.nbrTargetsHit, options.nbrTargets);
        gui.addReactionTimePopup(
            ev.detail.hitPoint.x,
            ev.detail.hitPoint.y,
            ev.detail.reactionTime,
        );
        if (ev.detail.reactionTime < bestReaction) {
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
