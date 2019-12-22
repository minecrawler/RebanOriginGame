import {State, IEntity, IWorld} from 'sim-ecs';
import {world} from "../ecs";
import {Scene} from "babylonjs";
import {loadScene} from "../util";
import {GameStorage} from "../game-storage";
import {RenderSystem} from "../systems/render";

export class TestState extends State {
    _systems = [world.getResource(RenderSystem)];
    protected _entities: IEntity[] = [];

    async activate(world: IWorld) {
        const gameStorage = world.getResource(GameStorage);
        // @ts-ignore
        const scene = world.getResource(Scene);

        gameStorage.assetContainer = await loadScene({
            oldContainer: gameStorage.assetContainer,
            scene,
            sceneFilePath: 'models/test/test.babylon',
        });

        world.replaceResource(scene.activeCamera);
        world.maintain();
    }
}
world.addResource(TestState);
