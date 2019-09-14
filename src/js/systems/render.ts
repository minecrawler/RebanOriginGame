import {System, IWorld, IEntity} from 'sim-ecs';
import {FreeCamera, MeshBuilder, Scene, Vector3, Engine} from 'babylonjs';
import {world} from "../ecs";

export class RenderSystem extends System {
    protected camera: FreeCamera;
    protected canvasEle: HTMLCanvasElement;
    protected engine: Engine;
    protected scene: Scene;

    constructor() {
        super();
        this.setComponentQuery({
            //
        });

        // init
        {
            const canvasEle: HTMLCanvasElement | null = document.querySelector('.game-viewport');
            if (!canvasEle) throw new Error('Could not find canvas element!');
            this.canvasEle = canvasEle;
        }

        this.engine = new Engine(this.canvasEle, true);
        this.scene = new Scene(this.engine);
        this.camera = new FreeCamera('cam', new Vector3(0, 5, -10), this.scene);

        // todo: should be entity
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(this.canvasEle, false);
        this.scene.setActiveCameraByID(this.camera.id);

        {// todo: test
            // Create a built-in "sphere" shape; with 16 segments and diameter of 2.
            let sphere = MeshBuilder.CreateSphere('sphere',
                {segments: 16, diameter: 2}, this.scene);

            // Move the sphere upward 1/2 of its height.
            sphere.position.y = 1;

            // Create a built-in "ground" shape.
            let ground = MeshBuilder.CreateGround('ground',
                {width: 6, height: 6, subdivisions: 2}, this.scene);
        }

        window.addEventListener('resize', () => this.engine.resize());
    }

    async update(world: IWorld, entities: IEntity[], deltaTime: number): Promise<void> {
        this.scene.render(true, false);
    }
}

world.addResource(RenderSystem);
world.registerSystemQuick(world.getResource(RenderSystem));
