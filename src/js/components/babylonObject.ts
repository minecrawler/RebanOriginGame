import { Component } from 'sim-ecs';
import Vector3 = BABYLON.Vector3;

export class BabylonObject extends Component {
    public mesh: BABYLON.Mesh;

    constructor(refMesh: BABYLON.Mesh) {
        super();
        this.mesh = refMesh;
    }
}
