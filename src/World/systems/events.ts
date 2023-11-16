import { Vector2 } from "three";

interface TargetHitData {
  time: number;
  reactionTime: number;
  hitPoint: Vector2;
  hitWith: "mouse" | "keyboard";
  deltaPoints: number;
}

interface TargetMissData {
  time: number;
  missPoint: Vector2;
  missWith: "mouse" | "keyboard";
  deltaPoints: number;
}

interface GameStartData {
  initialPoints: number;
  minimumPoints: number;
  nbrTargets: number;
  startReactionTime: number;
  endReactionTime?: number;
  progression: "constant" | "linear" | "exponential";
  keyboardTargetActivated: boolean;
}

interface GameOverData {
  time: number;
  success: boolean;
  nbrHits: number;
  nbrMisses: number;
  points: number;
}

interface TargetSpawnData {
  time: number;
  remainingTime: number;
  targetNumber: number;
}

function createGameStartEvent(data: GameStartData): CustomEvent<GameStartData> {
  const EVENT_ID = "gamestart";
  return new CustomEvent<GameStartData>(EVENT_ID, { detail: data });
}

function createGameOverEvent(data: GameOverData): CustomEvent<GameOverData> {
  const EVENT_ID = "gameover";
  return new CustomEvent<GameOverData>(EVENT_ID, { detail: data });
}

function createTargetHitEvent(data: TargetHitData): CustomEvent<TargetHitData> {
  const EVENT_ID = "targethit";
  return new CustomEvent<TargetHitData>(EVENT_ID, { detail: data });
}

function createTargetMissEvent(
  data: TargetMissData,
): CustomEvent<TargetMissData> {
  const EVENT_ID = "targetmiss";
  return new CustomEvent<TargetMissData>(EVENT_ID, { detail: data });
}

function createTargetSpawnEvent(
  data: TargetSpawnData,
): CustomEvent<TargetSpawnData> {
  const EVENT_ID = "targetspawn";
  return new CustomEvent<TargetSpawnData>(EVENT_ID, { detail: data });
}

export {
  GameStartData,
  GameOverData,
  TargetSpawnData,
  TargetHitData,
  TargetMissData,
  createTargetHitEvent,
  createTargetMissEvent,
  createGameOverEvent,
  createTargetSpawnEvent,
  createGameStartEvent,
};
