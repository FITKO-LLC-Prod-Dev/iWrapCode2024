import { World } from "./World/World.js";

async function main() {
    const container = document.querySelector<HTMLDivElement>("#scene-container");
    if (container == null)
        throw new Error("#scene-container not found in DOM.");
    const world = new World(container, 2000, 200, 40, {worldAxis: true});
    await world.init();
    world.start();
}

main().catch((err) => { console.error(err); });
