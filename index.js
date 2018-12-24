/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest

if (!window.navigator.userAgent) {
    window.navigator.userAgent = "react-native";
}

AppRegistry.registerComponent(appName, () => App);
