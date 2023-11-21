class GUI {
  readonly container: HTMLElement;
  readonly startBtn: HTMLButtonElement;
  readonly restartBtn: HTMLButtonElement;
  readonly inGameContainer: HTMLDivElement;
  readonly timerProgress: HTMLDivElement;
  readonly timerBar: HTMLDivElement;
  readonly targetsHitDiv: HTMLDivElement;
  readonly targetsHitText: HTMLSpanElement;
  readonly bestReactionDiv: HTMLDivElement;
  progressTimerId: number | undefined;
  progressRemainingTime: number | undefined;

  constructor(container: HTMLElement) {
    this.container = container;
    ///////////////////////////////// START UI ////////////////////////////////
    // start button
    this.startBtn = document.createElement("button");
    this.startBtn.textContent = "START";
    this.startBtn.classList.add("start-btn");
    // restart button
    this.restartBtn = document.createElement("button");
    this.restartBtn.textContent = "RESTART";
    this.restartBtn.classList.add("restart-btn");
    /////////////////////////////// GAME MENU UI //////////////////////////////
    // in-game menu container
    this.inGameContainer = document.createElement("div");
    this.inGameContainer.classList.add("in-game-container");
    // progress bar
    this.timerProgress = document.createElement("div");
    this.timerBar = document.createElement("div");
    this.timerProgress.classList.add("progress");
    this.timerBar.classList.add("bar");
    this.timerProgress.appendChild(this.timerBar);
    // targets hit
    this.targetsHitDiv = document.createElement("div");
    this.targetsHitDiv.classList.add("targets-hit");
    const targetsHitLabel = document.createElement("label");
    targetsHitLabel.textContent = "targets hit";
    this.targetsHitText = document.createElement("span");
    this.targetsHitText.textContent = "0";
    this.targetsHitDiv.appendChild(targetsHitLabel);
    this.targetsHitDiv.appendChild(this.targetsHitText);
    // best reaction time
    this.bestReactionDiv = document.createElement("div");
    this.bestReactionDiv.classList.add("best-reaction");
  }

  addStartButton(onClick: () => void): HTMLButtonElement {
    if (this.container.contains(this.startBtn)) {
      console.warn("Start button is already added to the container.");
      this.startBtn.remove();
    }
    this.startBtn.addEventListener("click", (_: MouseEvent) => {
      onClick();
      this.startBtn.remove();
    });
    return this.container.appendChild(this.startBtn);
  }

  addRestartButton(onClick: () => void): HTMLButtonElement {
    if (this.container.contains(this.restartBtn)) {
      console.warn("Restart button is already added to the container.");
      this.restartBtn.remove();
    }
    this.restartBtn.addEventListener("click", (_: MouseEvent) => {
      onClick();
      this.restartBtn.remove();
    });
    return this.container.appendChild(this.restartBtn);
  }

  public addInGameUI(): HTMLDivElement {
    if (this.container.contains(this.inGameContainer)) this.clearInGameUI();
    return this.container.appendChild(this.inGameContainer);
  }

  public clearInGameUI() {
    this.inGameContainer.remove();
  }

  public updateTargetsHit(nbr: number) {
    this.targetsHitText.textContent = `${nbr}`;
  }

  public addTargetsHit(): HTMLDivElement {
    if (this.inGameContainer.contains(this.targetsHitDiv))
      this.clearTargetsHit();
    return this.inGameContainer.appendChild(this.targetsHitDiv);
  }

  public clearTargetsHit() {
    this.targetsHitText.textContent = "0";
    this.targetsHitDiv.remove();
  }

  public clearTimerProgressBar() {
    clearInterval(this.progressTimerId);
    this.timerProgress.style.setProperty("--progress", "100%");
    this.timerProgress.remove();
  }

  public addTimerProgressBar(
    maxReactionTime: number,
    updateTime = 200,
  ): HTMLDivElement {
    if (this.inGameContainer.contains(this.timerProgress))
      this.clearTimerProgressBar();
    console.log(`maxReactionTime: ${updateTime}ms`);
    this.timerBar.style.transition = `width ${updateTime}ms linear`;
    this.progressRemainingTime = maxReactionTime;
    this.progressTimerId = setInterval(() => {
      this.progressRemainingTime! -= updateTime;
      if (this.progressRemainingTime! <= 0) {
        console.log(`Run out of time: ${this.progressRemainingTime!}`);
        this.clearTimerProgressBar();
        return;
      }
      const percent = Math.floor(
        (this.progressRemainingTime! / maxReactionTime) * 100,
      );
      this.timerProgress.style.setProperty("--progress", `${percent}%`);
    }, updateTime);
    return this.inGameContainer.appendChild(this.timerProgress);
  }
}

export { GUI };
