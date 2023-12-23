import {
  GameOverData,
  GameStartData,
  TargetHitData,
  TargetMissData,
  TargetSpawnData,
  CountdownStart,
  CountdownEnd,
} from "../systems/events.ts";

declare global {
  interface GlobalEventHandlersEventMap {
    gamestart: CustomEvent<GameStartData>;
    gameover: CustomEvent<GameOverData>;
    targethit: CustomEvent<TargetHitData>;
    targetmiss: CustomEvent<TargetMissData>;
    targetspawn: CustomEvent<TargetSpawnData>;
    countdownstart: CustomEvent<CountdownStart>;
    countdownend: CustomEvent<CountdownEnd>;
    camtransitiontostartend: Event;
  }
}
export {};
