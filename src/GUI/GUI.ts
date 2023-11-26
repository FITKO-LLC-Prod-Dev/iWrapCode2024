class GUI {
    private readonly container: HTMLElement;
    private readonly startBtn: HTMLButtonElement;
    private readonly restartBtn: HTMLButtonElement;
    private readonly inGameContainer: HTMLDivElement;
    private readonly timerBar: HTMLDivElement;
    private readonly totalScoreDiv: HTMLDivElement;
    private readonly totalScoreText: HTMLSpanElement;
    private readonly targetsHitDiv: HTMLDivElement;
    private readonly targetsHitText: HTMLSpanElement;
    private readonly bestReactionDiv: HTMLDivElement;
    private readonly bestReactionText: HTMLSpanElement;
    private readonly targetsMissedDiv: HTMLDivElement;
    private readonly targetsMissedText: HTMLSpanElement;
    private readonly counterDiv: HTMLDivElement;
    private readonly counterNumber: HTMLSpanElement;
    private progressTimerId: number | undefined;
    private progressRemainingTime: number | undefined;
    private counterId: number | undefined;
    private counter: number | undefined;
    private readonly base64PunchingGlove =
        "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55lhI52aJw4TC4U2ltuYFQ2VeJI4qqga5fszLiuctzir5Spr3pO/MJTTVpa5TmsQCSxiCSIEyKiihDIsxGjXSDGRovO4hz/i+EVyyeQqgZFjARWokBw/+B/8nq2Znxh3k0JxoPPFtj+GgOAu0KjZ9vexbTdOgMAzcKW1/JU6MP1Jeq2lRY+Avm3g4rqlyXvA5Q4w8KRLhuRIAVr+fB54P6NvygL9t0D3mju35jlOH4A0zSp5AxwcAsMFyl73eHdX+9z+7WnO7wfH43LJm/7wFwAADRppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6MjM0MGE0OGYtZmY4ZS00NjRmLWFlYmUtNDgzMzVmMjk2OTUzIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjFjZDU5NjU4LWM0N2UtNDBiZi1iMDJiLWQ0ODhiNmQ0OTE1MiIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjlkZjE0YmE4LWRiMmQtNGI5Mi1hZTZkLTUzMjFkYzQ5YjhhNSIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IkxpbnV4IgogICBHSU1QOlRpbWVTdGFtcD0iMTcwMDk2MzU5MTI4OTI3MCIKICAgR0lNUDpWZXJzaW9uPSIyLjEwLjMwIgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjk1OTc1MmIxLWUxOWEtNDU4YS04N2ZhLTUyODY0MjcxYjhhMSIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiCiAgICAgIHN0RXZ0OndoZW49IjIwMjMtMTEtMjZUMDI6NTM6MTErMDE6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+TEfYVwAAAAZiS0dEAP8AfwAnyYDm9QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+cLGgE1C7vAdnkAAAPVSURBVEjHlZVdbJNlFMd/z9svCgpGTac1ysIUyXBZCLIFhGWjBqOyIIrcmAwTjILRmGBMjDHuAgNqTLxxkd0Qw4VkasikwUhIQTIuJCCd4sK+CnNmA5p17Vg/3z4fXpSNde3GOFfve855///nvOd/niOYw0arAhVAK7AdqACGgR+AA/5IKMkCTcwBXu98Z9sxx9pav/35t1iJOGhQSQPQAzQcSNjuBoer2osIN0dD8bkInLMd1994t8Xz3pvtrtqaRQBLX1iJ41oYgMlhSapfrU4bcxpYeU0rb7XljAV9gabmaOjyvBWMVgUsa9uGL7zvv/WRVeHDisfwHD+K1X1mOjk3oYlfyAPwV05xIqPY4nAjYAhY1xwNjc0msG6DLxYrfMEpcGdfD96v9hWBA+STevq5xuOgwpo+XyXwU9AXsMoSAEfcH+95aQrc094K2eI+amlIXVVFHwY8zplNbAR2lRCMVgU2itrK19x1axHJSTxHvgZjirMMJPolJlfsXuYo0cjuchVsd25tAocD198XIX2rGNtAYiCPPaoXIsG6oC8gZqvoCeuxRwtskStF2SpnSPRJ8lFdVoK5Urfr9qHVTIJb5GXhzbsEAJk1ZKKKdERh1NxDFJclruvN0ZCa/Yu6VO8AAMlV67h5JsfYOZtU//zgCQmp0vjxcj3okIeD/+qxGM5nqnEd/OCu459SMJQt9mkgYXR7CYE/EsqQk69nvjkUN6kU7qZNOHY0gMMqCz4uoS8NyhSJjCtacskh98s9mx+aa5JXiDWVna5XX6zxvPIyuV9OYH/6XRH4SA5u2MWEEvhHS7L3ad7e4ORBW1ycDItN/kgoO3PQ8EdCV014aH3+2G9H7fMXkH9cuqMmA4OZUvAMhvMqz/1+w4eNTtLjFgPnxbPA4bvdpvuALwFnThfAs7MkmTWGiJYsXyXY+rSD3l7BjcFC7EkvLHPyiT8SOijm2QeNCUnHUBafmjXYSa1JaE19vaD6EYsLfwoSN+7E3RasXoIR8LyYTy1BX+Bx4Htg85RSJpTC9hgCz1lUuAQT3YJEqlAlgNcqVDCqNJ1p+aNYyFYK+gLLgQdGpNy39GFattRbeJKCycuiICEK/UkpqFwEYVtxMqNywC7BPdiv9Y2LN1ZbCTUiXJlIaTxv4FRGErb1TWBHW6zrnHUvBFvWWIhJrHLgWW0IJSVhW18C6tpiXeeKZLoQcx46nbZj4rPSO8nw+6QiJ+l8ylgNbbGu4XllejcbrQp0ADsB/rM13SmNhv1A697xs2bepb9AawFODmb1+p6M3gns3jt+9udyif8DNmmxFgM4xNIAAAAASUVORK5CYII=";

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
        // total score
        this.totalScoreDiv = document.createElement("div");
        this.totalScoreDiv.classList.add("total-score");
        const totalScoreLabel = document.createElement("label");
        totalScoreLabel.textContent = "Score";
        this.totalScoreText = document.createElement("span");
        this.totalScoreText.textContent = "-";
        this.totalScoreDiv.appendChild(totalScoreLabel);
        this.totalScoreDiv.appendChild(this.totalScoreText);
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
        this.bestReactionText.textContent = "∞";
        this.bestReactionDiv.appendChild(bestReactionLabel);
        this.bestReactionDiv.appendChild(this.bestReactionText);
        // counter
        this.counterDiv = document.createElement("div");
        this.counterDiv.classList.add("counter");
        this.counterNumber = document.createElement("span");
        this.counterDiv.appendChild(this.counterNumber);
    }

    public addStartButton(onClick: () => void): HTMLButtonElement {
        if (this.container.contains(this.startBtn)) {
            this.startBtn.remove();
        }
        this.startBtn.addEventListener("click", (_: MouseEvent) => {
            onClick();
            this.startBtn.remove();
        });
        return this.container.appendChild(this.startBtn);
    }

    public addRestartButton(onClick: () => void): HTMLButtonElement {
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

    public updateTotalScore(score: number): void {
        this.totalScoreText.textContent = `${score}`;
    }

    public addTotalScore(): HTMLDivElement {
        if (this.inGameContainer.contains(this.totalScoreDiv))
            this.clearTotalScore();
        return this.inGameContainer.appendChild(this.totalScoreDiv);
    }

    public clearTotalScore(): void {
        this.totalScoreDiv.remove();
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
        this.bestReactionText.textContent = "∞";
        if (this.inGameContainer.contains(this.bestReactionDiv))
            this.clearBestReaction();
        return this.inGameContainer.appendChild(this.bestReactionDiv);
    }

    public updateBestReaction(newReaction: number) {
        this.bestReactionText.textContent = `${Math.ceil(newReaction)} ms`;
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

    public addCountdownCounter(duration: number): HTMLDivElement {
        if (this.container.contains(this.counterDiv)) this.clearCountdownCounter();
        this.counter = Math.floor(duration);
        this.counterNumber.textContent = `${this.counter}`;
        this.counterId = setInterval(() => {
            --this.counter!;
            this.counterNumber.textContent = `${this.counter}`;
        }, 1000);
        return this.container.appendChild(this.counterDiv);
    }

    public clearCountdownCounter() {
        clearInterval(this.counterId);
        this.counterDiv.remove();
    }

    public addReactionTimePopup(
        clientX: number,
        clientY: number,
        reactionTime: number,
        deleteAfter = 600,
    ): HTMLSpanElement {
        const reactionTimeText = document.createElement("span");
        console.log(clientX, clientY);
        reactionTimeText.classList.add("reaction-time-popup");
        reactionTimeText.textContent = `${reactionTime}ms`;
        reactionTimeText.style.transitionDuration = `${deleteAfter}ms`;
        setTimeout(() => {
            reactionTimeText.style.left = `${clientX - reactionTimeText.offsetWidth / 2
                }px`;
            reactionTimeText.style.top = `${clientY - reactionTimeText.offsetHeight / 2
                }px`;
            reactionTimeText.style.opacity = "0";
        });
        setTimeout(() => {
            reactionTimeText.remove();
        }, deleteAfter);
        return this.container.appendChild(reactionTimeText);
    }

    public setPunchingBoxCursor(): void {
        this.container.style.cursor = `url("data:image/png;base64,${this.base64PunchingGlove}"), auto`;
    }
    public setCrosshairCursor(): void {
        this.container.style.cursor = "crosshair";
    }

    public resetCursor(): void {
        this.container.style.cursor = "default";
    }
}

export { GUI };
