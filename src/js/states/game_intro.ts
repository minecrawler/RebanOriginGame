import {State, IWorld} from 'sim-ecs';
import {world} from "../ecs";
import {MainState} from "./main";

export class GameIntroState extends State {
    _logoEle: HTMLImageElement;
    _systems = [];
    _videoEle: HTMLDivElement;

    constructor() {
        super();

        this._logoEle = document.createElement('img');
        this._videoEle = document.createElement('div');
        this._videoEle.id = 'game-intro';
        this._videoEle.append(this._logoEle);
    }

    async activate(world: IWorld) {
        const showLogo = async (src: string) => {
            await this._waitForImg(this._logoEle, src);
            this._logoEle.classList.add('show');
            await this._wait(5000);
            this._logoEle.classList.remove('show');
            await this._wait(1000);
        };

        document.body.insertBefore(this._videoEle, document.body.querySelector('canvas'));

        await showLogo('assets/img/Babylon.svg');
        // more stuff?

        await world.changeRunningState(world.getResource(MainState));
    }

    deactivate() {
        this._videoEle.classList.add('hide');
        setTimeout(() => document.body.removeChild(this._videoEle), 1000);
    }

    private _wait(time: number): Promise<void> {
        return new Promise(res => setTimeout(() => res(), time));
    }

    private _waitForImg(img: HTMLImageElement, src: string): Promise<void> {
        return new Promise(res => {
            img.onload = () => res();
            img.src = src;
        });
    }
}
world.addResource(GameIntroState);
