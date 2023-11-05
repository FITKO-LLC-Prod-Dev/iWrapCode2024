import { ReinhardToneMapping, SRGBColorSpace, WebGLRenderer } from "three"

function createRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer();
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ReinhardToneMapping;
    return renderer;
}

export { createRenderer };
