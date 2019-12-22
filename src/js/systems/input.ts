import {System, IWorld, IEntity} from 'sim-ecs';
import {Scene} from 'babylonjs';
import {world} from "../ecs";
import ExecuteCodeAction = BABYLON.ExecuteCodeAction;
import ActionManager = BABYLON.ActionManager;
import Vector3 = BABYLON.Vector3;

export class InputSystem extends System {
    private actionMap = {
        forward: ['w', 'ArrowUp'],
        backward: ['s', 'ArrowDown'],
        left: ['a', 'ArrowLeft'],
        right: ['d', 'ArrowRight'],
    };
    private inputMap: { [input: string]: boolean | undefined } = {};

    constructor() {
        super();
        this.setComponentQuery([]);

        // @ts-ignore
        const scene = world.getResource(Scene);

        scene.actionManager = new ActionManager(scene);
        scene.actionManager.registerAction(new ExecuteCodeAction(
            ActionManager.OnKeyDownTrigger,
            evt => this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown"
        ));
        scene.actionManager.registerAction(new ExecuteCodeAction(
            ActionManager.OnKeyUpTrigger,
            evt => this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown"
        ));
    }

    private transformPoint(owner: BABYLON.AbstractMesh | BABYLON.Camera, position:BABYLON.Vector3):BABYLON.Vector3 {
        return BABYLON.Vector3.TransformCoordinates(position, owner.getWorldMatrix());
    }

    private transformVector(owner: BABYLON.AbstractMesh | BABYLON.Camera, vector:BABYLON.Vector3):BABYLON.Vector3 {
        return BABYLON.Vector3.TransformNormal(vector, owner.getWorldMatrix());
    }

    private forward: boolean = false;
    private backward: boolean = false;
    private left: boolean = false;
    private right: boolean = false;
    async update(world: IWorld, entities: IEntity[], deltaTime: number): Promise<void> {
        // @ts-ignore
        const scene = world.getResource(Scene);
        const cam = scene.activeCamera;

        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;

        for (const actionButton of this.actionMap.forward) {
            if (this.inputMap[actionButton]) this.forward = true;
        }

        for (const actionButton of this.actionMap.backward) {
            if (this.inputMap[actionButton]) this.backward = true;
        }

        for (const actionButton of this.actionMap.left) {
            if (this.inputMap[actionButton]) this.left = true;
        }

        for (const actionButton of this.actionMap.right) {
            if (this.inputMap[actionButton]) this.right = true;
        }

        if (this.forward) {
            cam.position = this.transformPoint(cam, new Vector3(0, 0, 1));
        }

        if (this.backward) {
            cam.position = this.transformPoint(cam, new Vector3(0, 0, -1));
        }

        if (this.left) {
            cam.position = this.transformPoint(cam, new Vector3(-1, 0, 0));
        }

        if (this.right) {
            cam.position = this.transformPoint(cam, new Vector3(1, 0, 0));
        }
    }
}

world.addResource(InputSystem);
world.registerSystemQuick(world.getResource(InputSystem));
