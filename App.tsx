/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
    SafeAreaView,
    StatusBar,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import StackComponent from './src/navigation/StackComponent';
import {Provider} from "react-native-paper";
import appTheme from "./src/Theme";

const App = () => {
    return (
        <>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaView style={{flex: 1}}>
                <Provider theme={appTheme}>
                    <NavigationContainer>
                        <StackComponent/>
                    </NavigationContainer>
                </Provider>
            </SafeAreaView>
        </>
    );
};

export default App;
