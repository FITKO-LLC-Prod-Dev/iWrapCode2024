import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { extractMesh } from "../Utils/extractMesh.js";

async function loadTarget() {
    const loader = new GLTFLoader();
    const targetData = await loader.loadAsync("/assets/models/target.glb");
    const meshData = extractMesh(targetData);
    return meshData;
}

export { loadTarget };
