import {Colors, DefaultTheme} from "react-native-paper";

export default {
    ...DefaultTheme,
    colors:{
        ...DefaultTheme.colors,
        primary: Colors.lightBlue900,
        accent: Colors.blue50,
        error: Colors.red400,
    }
};
