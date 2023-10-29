import { WebGLRenderer } from "three"

function createRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer({antialias: true});
    (renderer as any).physicallyCorrectLights = true;
    return renderer;
}

export { createRenderer };
