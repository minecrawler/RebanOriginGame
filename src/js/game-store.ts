import {IState} from 'sim-ecs';
import {MainState} from "./states/main";
import {world} from "./ecs";

export class GameStore {
    state: IState = new MainState();
}

world.addResource(GameStore);
