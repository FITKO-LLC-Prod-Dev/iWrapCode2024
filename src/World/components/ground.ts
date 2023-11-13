import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { extractMesh } from "../Utils/extractMesh.js";

async function loadGround() {
  const loader = new GLTFLoader();
  const groundData = await loader.loadAsync("/assets/models/ground.glb");
  const meshData = extractMesh(groundData);
  return meshData;
}

export { loadGround };
