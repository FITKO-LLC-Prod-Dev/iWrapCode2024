import { World } from "./World/World.js";

async function main() {
  const container = document.querySelector<HTMLDivElement>("#scene-container");
  if (container == null) throw new Error("#scene-container not found in DOM.");
  // events
  container.addEventListener("three::targetspawn", (e) => {
    console.log((e as CustomEvent).detail);
  });
  container.addEventListener("three::targethit", (e) => {
    console.log((e as CustomEvent).detail);
  });
  container.addEventListener("three::targetmiss", (e) => {
    console.log((e as CustomEvent).detail);
  });
  container.addEventListener("three::gamestart", (e) => {
    console.log((e as CustomEvent).detail);
  });
  container.addEventListener("three::gameover", (e) => {
    console.log((e as CustomEvent).detail);
  });
  const world = new World(
    container,
    {
      initialPoints: 1000,
      minimumPoints: 0,
      nbrTargets: 30,
      startReactionTime: 100000,
      endReactionTime: 100000,
      progression: "constant",
      keyboardTargetActivated: false,
    },
    { debugGUI: true, worldAxis: false },
  );
  await world.init();
  world.start();
}

main().catch((err) => {
  console.error(err);
});
