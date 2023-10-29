import { Object3D } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

function extractMesh(data: GLTF): Object3D {
    const mesh = data.scene.children[0];
    return mesh;
}

export { extractMesh };
