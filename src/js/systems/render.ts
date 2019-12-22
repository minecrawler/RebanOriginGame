import {System, IWorld, IEntity} from 'sim-ecs';
import {FreeCamera, MeshBuilder, Scene, Vector3, Engine} from 'babylonjs';
import {world} from "../ecs";

export class RenderSystem extends System {
    protected canvasEle: HTMLCanvasElement;
    protected scene: Scene;

    constructor() {
        super();
        this.setComponentQuery([]);

        // init
        {
            const canvasEle: HTMLCanvasElement | null = document.querySelector('.game-viewport');
            if (!canvasEle) throw new Error('Could not find canvas element!');
            this.canvasEle = canvasEle;
        }

        const engine = new Engine(this.canvasEle, true, {
            //
        }, true);
        this.scene = new Scene(engine);
        const camera = new FreeCamera('cam', new Vector3(0, 5, -10), this.scene);

        world
            .addResource(engine)
            .addResource(this.scene)
            .addResource(camera);

        // todo: should be entity
        camera.setTarget(Vector3.Zero());
        camera.attachControl(this.canvasEle, false);
        this.scene.setActiveCameraByID(camera.id);

        window.addEventListener('resize', () => engine.resize());
    }

    async update(world: IWorld, entities: IEntity[], deltaTime: number): Promise<void> {
        this.scene.render(true, false);
    }
}

world.addResource(RenderSystem);

import {InputSystem} from "./input";
world.registerSystemQuick(world.getResource(RenderSystem), [InputSystem]);
