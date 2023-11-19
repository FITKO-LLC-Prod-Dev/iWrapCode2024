import { Mesh } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

function extractMesh(data: GLTF): Mesh {
  const mesh = data.scene.children[0] as Mesh;
  return mesh;
}

export { extractMesh };
