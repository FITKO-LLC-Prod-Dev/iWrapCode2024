import { AmbientLight, PointLight} from "three";

function createPointLight(): PointLight {
    const light = new PointLight('white', 100);
    light.position.set(0, 3, 5);
    return light;
}

function createIndirectLight(): AmbientLight {
    const ambLight = new AmbientLight("white", 5);
    return ambLight;
}

export { createPointLight, createIndirectLight };
