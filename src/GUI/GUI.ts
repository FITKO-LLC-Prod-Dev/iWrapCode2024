class GUI {
  readonly container: HTMLElement;
  readonly startBtn: HTMLButtonElement;
  readonly restartBtn: HTMLButtonElement;
  readonly inGameContainer: HTMLDivElement;
  readonly timerBar: HTMLDivElement;
  readonly targetsHitDiv: HTMLDivElement;
  readonly targetsHitText: HTMLSpanElement;
  readonly bestReactionDiv: HTMLDivElement;
  readonly bestReactionText: HTMLSpanElement;
  readonly targetsMissedDiv: HTMLDivElement;
  readonly targetsMissedText: HTMLSpanElement;
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
    this.timerBar = document.createElement("div");
    this.timerBar.classList.add("bar");
    // targets hit
    this.targetsHitDiv = document.createElement("div");
    this.targetsHitDiv.classList.add("targets-hit");
    const targetsHitLabel = document.createElement("label");
    targetsHitLabel.textContent = "targets hit";
    this.targetsHitText = document.createElement("span");
    this.targetsHitText.textContent = "0";
    this.targetsHitDiv.appendChild(targetsHitLabel);
    this.targetsHitDiv.appendChild(this.targetsHitText);
    // targets missed
    this.targetsMissedDiv = document.createElement("div");
    this.targetsMissedDiv.classList.add("targets-missed");
    const targetsMissedLabel = document.createElement("label");
    targetsMissedLabel.textContent = "targets missed";
    this.targetsMissedText = document.createElement("span");
    this.targetsMissedText.textContent = "0";
    this.targetsMissedDiv.appendChild(targetsMissedLabel);
    this.targetsMissedDiv.appendChild(this.targetsMissedText);
    // best reaction time
    this.bestReactionDiv = document.createElement("div");
    this.bestReactionDiv.classList.add("best-reaction");
    const bestReactionLabel = document.createElement("label");
    bestReactionLabel.textContent = "best reaction";
    this.bestReactionText = document.createElement("span");
    this.bestReactionDiv.appendChild(bestReactionLabel);
    this.bestReactionDiv.appendChild(this.bestReactionText);
  }

  addStartButton(onClick: () => void): HTMLButtonElement {
    if (this.container.contains(this.startBtn)) {
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

  public updateTargetsMissed(targetsMissed: number): void {
    this.targetsMissedText.textContent = `${targetsMissed}`;
  }

  public addTargetsMissed(): HTMLDivElement {
    if (this.inGameContainer.contains(this.targetsMissedDiv))
      this.clearTargetsMissed();
    return this.inGameContainer.appendChild(this.targetsMissedDiv);
  }

  public clearTargetsMissed(): void {
    this.targetsMissedText.textContent = "0";
    this.targetsMissedDiv.remove();
  }

  public updateTargetsHit(targetsHit: number, totalTargets: number) {
    this.targetsHitText.textContent = `${targetsHit}/${totalTargets}`;
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

  public addBestReaction(): HTMLDivElement {
    if (this.inGameContainer.contains(this.bestReactionDiv))
      this.clearBestReaction();
    return this.inGameContainer.appendChild(this.bestReactionDiv);
  }

  public updateBestReaction(newReaction: number) {
    this.bestReactionText.textContent = `${newReaction} ms`;
  }

  public clearBestReaction() {
    this.bestReactionText.textContent = "∞";
    this.bestReactionDiv.remove();
  }

  public clearTimerProgressBar() {
    clearInterval(this.progressTimerId);
    this.inGameContainer.style.setProperty("--progress", "100%");
    this.timerBar.remove();
  }

  public addTimerProgressBar(
    maxReactionTime: number,
    updateTime = 200,
  ): HTMLDivElement {
    if (this.inGameContainer.contains(this.timerBar))
      this.clearTimerProgressBar();
    console.log(`maxReactionTime: ${maxReactionTime}ms`);
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
      this.inGameContainer.style.setProperty("--progress", `${percent}%`);
    }, updateTime);
    return this.inGameContainer.appendChild(this.timerBar);
  }
}

export { GUI };
