import {State, IWorld} from 'sim-ecs';
import {world} from "../ecs";
import {MainState} from "./main";

export class GameIntroState extends State {
    _logoEle: HTMLImageElement = document.createElement('img');
    _systems = [];
    _textEle: HTMLSpanElement = document.createElement('span');
    _videoEle: HTMLDivElement = document.createElement('div');

    constructor() {
        super();
        this._videoEle.id = 'game-intro';
    }

    async activate(world: IWorld) {
        const show = (ele: HTMLElement) => {
            this._videoEle.append(ele);
            return new Promise(res => setTimeout(async () => {
                ele.classList.add('show');
                await this._wait(2000);
                ele.classList.remove('show');
                await this._wait(1000);
                this._videoEle.removeChild(ele);
                res();
            }));
        };
        const showLogo = async (src: string) => {
            await this._waitForImg(this._logoEle, src);
            await show(this._logoEle);
        };
        const showText = async (text: string) => {
            this._textEle.innerText = text;
            await show(this._textEle);
        };

        document.body.insertBefore(this._videoEle, document.body.querySelector('canvas'));

        await showLogo('images/Babylon.svg');
        await showText('A production by Marco Alka');
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
