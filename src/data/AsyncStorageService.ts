import AsyncStorage from '@react-native-community/async-storage';
import {GameResult} from "./types/GameResult";

const MAX_RESULT_STORE = 10;

const AsyncStorageService = {
    gameResultKey: "game result key",
    gameResultDefaultValue: [],
    async getGameResults(): Promise<GameResult[]> {
        const value = await AsyncStorage.getItem(this.gameResultKey);
        if (value == null) {
            return this.gameResultDefaultValue;
        } else {
            return (JSON.parse(value) as GameResult[]).sort(sortResult);
        }
    },

    async storeGameResult(results: GameResult[]) {
        try {
            await AsyncStorage.setItem(this.gameResultKey, JSON.stringify(results));
        } catch (e) {
            console.log(e);
        }
    },

    async addGameResult(gameResult: GameResult): Promise<void> {
        const results = (await this.getGameResults()).sort(sortResult);
        if (results.length < MAX_RESULT_STORE) {
            await this.storeGameResult([...results,gameResult]);
        } else if (results[results.length - 1].score <= gameResult.score) {
            const newResult = [...results.slice(0, results.length - 1), gameResult];
            await this.storeGameResult(newResult);

        }
    }
};

function sortResult(first: GameResult, second: GameResult): number {
    if (first.score > second.score) {
        return -1;
    }
    return 1;
}

export default AsyncStorageService;
