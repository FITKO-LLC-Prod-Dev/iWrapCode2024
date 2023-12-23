import Stats from "three/examples/jsm/libs/stats.module.js";
import { GameObject } from "./interfaces.js";

class StatsWrapperGUI implements GameObject {
  readonly stats: Stats;
  private uid?: number;

  constructor(container: HTMLElement) {
    this.stats = new Stats();
    container.appendChild(this.stats.dom);
  }

  public update(_: number): void {
    this.stats.update();
  }

  public setUID(uid: number): void {
    this.uid = uid;
  }

  public getUID(): number | undefined {
    return this.uid;
  }
}

export { StatsWrapperGUI };
