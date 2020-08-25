import {action, observable} from "mobx";


class GameStore {
    @observable gameSequence: number[];
    @observable state: 'show'| 'play' | 'mistake' | ''

    constructor() {
        this.gameSequence = [];
        this.state = '';
    }

    @action
    nextStep(){
        const newStep = Math.floor(Math.random() * 4);
        this.gameSequence = [...this.gameSequence,newStep];
        this.state = 'show';
    }

    @action
    playStep(stepNumber:number,play: number){
        if(this.gameSequence[stepNumber] != play){
            this.state = 'mistake';
        } else if(stepNumber == this.gameSequence.length - 1){
            this.nextStep();
        }
    }

    @action
    start() {
        this.state = 'play'
    }
}

export const game = new GameStore();
