import {action, observable} from "mobx";
import {GameResult} from "../data/types/GameResult";
import AsyncStorageService from "../data/AsyncStorageService";

class ResultStore {
    @observable results: GameResult[];
    @observable error?: string

    constructor() {
        this.results = [];
    }

    @action.bound
    setResults(results: GameResult[]) {
        this.results = results
    }

    @action.bound
    setError(error: string) {
        this.error = error
    }

    @action
    async getResults() {
        try {
            const results = await AsyncStorageService.getGameResults();
            this.setResults(results);
        } catch (e) {
            this.setError(e.message)
        }
    }

    @action
    async addResult(result: GameResult) {
        try {
            await AsyncStorageService.addGameResult(result);
            await this.getResults();
        } catch (e) {
            this.setError(e.message);
        }
    }

}

export const result = new ResultStore();
