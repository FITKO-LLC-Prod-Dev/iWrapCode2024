import { AmbientLight, DirectionalLight } from "three";

function createDirectLight(): DirectionalLight {
    const light = new DirectionalLight('white', 8);
    light.position.set(10, 10, 10);
    return light;
}

function createIndirectLight(): AmbientLight {
    const ambLight = new AmbientLight("white", 6);
    return ambLight;
}

export { createDirectLight, createIndirectLight };
