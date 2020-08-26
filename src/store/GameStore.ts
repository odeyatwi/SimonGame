import {action, observable} from "mobx";
import {Player} from "@react-native-community/audio-toolkit";


class GameStore {
    @observable gameSequence: number[];
    @observable state: 'show' | 'play' | 'mistake' | '';
    private step: number;
    private soundError = 'error.mp3'
    public successSounds = ['simon_sound1.mp3', 'simon_sound2.mp3', 'simon_sound3.mp3', 'simon_sound4.mp3'];


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
            GameStore.playSound(this.soundError);
            this.state = 'mistake';
            return;
        } else if (this.step == this.gameSequence.length - 1) {
            this.nextStep();
        } else {
            this.step += 1;
        }
        GameStore.playSound(this.successSounds[play])
    }

    @action
    start() {
        this.step = 0;
        this.state = 'play'

    }

    private static playSound(file: string) {
        console.log('playSound',file)
        const player = new Player(file)
        console.log(player)
            player.prepare((error) => {
            console.log(error)
                if (!error) {
                    player.play()
                }
            })
    }

    @action
    playSound(index: number,delay: number){
        setTimeout(()=>GameStore.playSound(this.successSounds[index]),delay);
    }

    @action
    reset() {
        this.gameSequence = [];
        this.state = '';
        this.step = 0;
    }
}

export const game = new GameStore();
