import {action, observable} from "mobx";


class GameStore {
    @observable gameSequence: number[];
    @observable state: 'show' | 'play' | 'mistake' | '';
    private step: number;

    constructor() {
        this.gameSequence = [];
        this.state = '';
        this.step = 0;
    }

    @action
    nextStep() {
        const newStep = Math.floor(Math.random() * 4);
        this.gameSequence = [...this.gameSequence, newStep];
        this.state = 'show';
    }

    @action
    playStep(play: number) {
        console.log('play step', this.step, play, this.gameSequence[this.step])
        if (this.gameSequence[this.step] != play) {
            this.state = 'mistake';
        } else if (this.step == this.gameSequence.length - 1) {
            this.nextStep();
        } else {
            this.step += 1;
        }
    }

    @action
    start() {
        this.step = 0;
        this.state = 'play'

    }
}

export const game = new GameStore();
