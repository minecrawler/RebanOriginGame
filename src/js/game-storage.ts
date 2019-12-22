import {IState} from 'sim-ecs';
import {MainState} from "./states/main";
import {world} from "./ecs";
import AssetContainer = BABYLON.AssetContainer;

export class GameStorage {
    assetContainer?: AssetContainer;
    state: IState = new MainState();
}

world.addResource(GameStorage);
