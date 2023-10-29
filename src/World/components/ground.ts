import { Mesh, MeshStandardMaterial, PlaneGeometry } from "three";

function createGroundPlane() {
    const geometry = new PlaneGeometry(100, 100);
    geometry.rotateX(-Math.PI/2);
    const material = new MeshStandardMaterial({color: "white"});
    const mesh = new Mesh(geometry, material);
    return mesh;
}

export { createGroundPlane };
