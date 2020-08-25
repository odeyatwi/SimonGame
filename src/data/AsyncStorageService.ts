import AsyncStorage from '@react-native-community/async-storage';
import {GameResult} from "./types/GameResult";


const AsyncStorageService = {
    gameResultKey: "game result key",
    gameResultDefaultValue: [],
    async getGameResults(): Promise<GameResult[]> {
        const value = await AsyncStorage.getItem(this.gameResultKey);
        if (value == null) {
            return this.gameResultDefaultValue;
        } else {
            return JSON.parse(value);
        }
    },

    async storeGameResult(results: GameResult[]): Promise<void> {
        await AsyncStorage.setItem(this.gameResultKey, JSON.stringify(results));
    },

    async addGameResult(gameResult: GameResult): Promise<void> {
        const results = (await this.getGameResults()).sort(sortResult)
        if (results.length == 0) {
            await this.storeGameResult([gameResult])
        } else if (results[results.length - 1].score <= gameResult.score) {
            const newResult = [...results.slice(0, results.length - 1), gameResult];
            await this.storeGameResult(newResult);
        }
    }
};

function sortResult(first: GameResult, second: GameResult): number {
    if (first.score < second.score) {
        return -1
    }
    return 1
}

export default AsyncStorageService;
