import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { extractMesh } from "../Utils/extractMesh.js";

async function loadBag() {
    const loader = new GLTFLoader();
    const bagData = await loader.loadAsync("/assets/models/bag.glb");
    const meshData = extractMesh(bagData);
    return meshData;
}

export { loadBag };
