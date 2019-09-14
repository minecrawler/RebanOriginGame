import {State} from 'sim-ecs';
import {world} from "../ecs";
import {RenderSystem} from "../systems/render";

export class MainState extends State { _systems = [world.getResource(RenderSystem)] }
world.addResource(MainState);
