import {world} from "./ecs";
import {GameIntroState} from "./states/game_intro";
import {TestState} from "./states/test";
import { IState } from 'sim-ecs';

const isTest = localStorage.getItem('debug') != null;

if (isTest) {
    Object.assign(window, { world });
}

world.run({
    initialState: world.getResource<IState>(isTest ? TestState : GameIntroState),
});
