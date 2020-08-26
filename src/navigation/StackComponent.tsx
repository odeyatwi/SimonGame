import React, {FunctionComponent} from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {GAME_SCREEN, RESULT_SCREEN} from "./ScreenNames";
import GameScreen from "../screens/GameScreen";
import ResultsScreen from "../screens/ResultsScreen";

export type RootStackParamList = {
    [GAME_SCREEN]: undefined;
    [RESULT_SCREEN]: { score?: number };
};

const Stack = createStackNavigator()

const StackComponent: FunctionComponent = () =>{
    return <Stack.Navigator initialRouteName={GAME_SCREEN}>
        <Stack.Screen name={GAME_SCREEN} component={GameScreen} options={{headerShown:false}}/>
        <Stack.Screen name={RESULT_SCREEN} component={ResultsScreen} options={{headerShown:false}}/>
    </Stack.Navigator>
}

export default StackComponent;
