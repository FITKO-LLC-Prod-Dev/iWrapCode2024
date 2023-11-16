class GUI {
  readonly container: HTMLElement;
  readonly startBtn: HTMLButtonElement;
  readonly restartBtn: HTMLButtonElement;
  readonly timer: HTMLProgressElement;
  progressTimerId: number | null;

  constructor(container: HTMLElement) {
    this.container = container;
    // start button
    this.startBtn = document.createElement("button");
    this.startBtn.textContent = "START";
    this.startBtn.classList.add("start-btn");
    // restart button
    this.restartBtn = document.createElement("button");
    this.restartBtn.textContent = "RESTART";
    this.restartBtn.classList.add("restart-btn");
    // timer (progress bar)
    this.timer = document.createElement("progress");
    this.progressTimerId = null;
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

  addTimerProgressBar(maxReactionTime: number) {
    if (this.container.contains(this.timer)) {
      console.warn("Timer progress bar is already added to the container.");
      this.timer.remove();
    }
    console.log(this.timer.max, this.timer.value);
    // this.progressTimerId = setInterval(() => {
    //     this.timer.max
    // }, 100);
    return this.container.appendChild(this.timer);
  }
}

export { GUI };
