import {game} from "./GameStore";
import {result} from "./ResultStore";
import {createContext, useContext} from "react";

export const store = {
    game: game,
    result: result
};

const globalStore = createContext(store);

export function useGlobalStore() {
    return useContext(globalStore);
}
