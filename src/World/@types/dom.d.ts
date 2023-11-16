import {
  GameOverData,
  GameStartData,
  TargetHitData,
  TargetMissData,
  TargetSpawnData,
} from "../systems/events.ts";

declare global {
  interface GlobalEventHandlersEventMap {
    gamestart: CustomEvent<GameStartData>;
    gameover: CustomEvent<GameOverData>;
    targethit: CustomEvent<TargetHitData>;
    targetmiss: CustomEvent<TargetMissData>;
    targetspawn: CustomEvent<TargetSpawnData>;
  }
}
export {};
