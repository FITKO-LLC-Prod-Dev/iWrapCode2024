import {
  GameOverData,
  GameStartData,
  TargetHitData,
  TargetMissData,
  TargetSpawnData,
  CountdownStart,
  CountdownEnd,
  LoadingProgressData,
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
    loadingprogress: CustomEvent<LoadingProgressData>;
    loadingend: Event;
    camtransitiontostartend: Event;
  }
}
export {};
