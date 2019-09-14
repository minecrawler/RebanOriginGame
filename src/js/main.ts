import {world} from "./ecs";
import {MainState} from "./states/main";

world.maintain();
world.run(world.getResource(MainState));
