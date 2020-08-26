import 'react-native-gesture-handler';
import 'mobx-react-lite/batchingForReactNative';
import * as React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';

AppRegistry.registerComponent(appName, () => App);
