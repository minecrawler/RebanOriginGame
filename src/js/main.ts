import {world} from "./ecs";
import {MainState} from "./states/main";
import {GameIntroState} from "./states/game_intro";

world.maintain();
world.run(world.getResource(localStorage.getItem('debug') ? MainState : GameIntroState));
