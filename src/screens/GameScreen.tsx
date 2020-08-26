import React, {FunctionComponent, useCallback, useEffect, useRef} from "react";
import {Animated, TouchableOpacity, View, Text, StyleSheet} from "react-native";
import {observer} from "mobx-react";
import {useGlobalStore} from "../store";
import {Button, Colors, IconButton} from "react-native-paper";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParamList} from "../navigation/StackComponent";
import {RESULT_SCREEN} from "../navigation/ScreenNames";


const colors = [
    [Colors.redA700, Colors.red300],
    [Colors.green900, Colors.green300],
    [Colors.blueA700, Colors.blue300],
    [Colors.yellowA700, Colors.yellow200]
]

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity)

type Props = StackScreenProps<RootStackParamList, 'GameScreen'>;


const GameScreen: FunctionComponent<Props> = ({navigation}) => {

    const gameStore = useGlobalStore().game;

    useEffect(() => {
        if (gameStore.state == 'show') {
            animate(gameStore.gameSequence);
        } else if (gameStore.state == 'mistake'){
            goToResults(gameStore.gameSequence.length)();
            gameStore.reset()
        }
    }, [gameStore.state, gameStore.gameSequence])

    const startGame = useCallback(() => {
        gameStore.nextStep();
    }, [gameStore.nextStep]);

    const pressButton = useCallback((number: number) => () => {
        gameStore.playStep(number);
    }, [gameStore.playStep])

    const goToResults = useCallback((score?:number) => ()=> {
        navigation.push(RESULT_SCREEN,{score})
    },[])

    const buttons1State = useRef(new Animated.Value(0)).current;
    const buttons2State = useRef(new Animated.Value(0)).current;
    const buttons3State = useRef(new Animated.Value(0)).current;
    const buttons4State = useRef(new Animated.Value(0)).current;

    const buttons1Color = buttons1State.interpolate({
        inputRange: [0, 1],
        outputRange: colors[0],
        extrapolate: 'clamp'
    });
    const buttons2Color = buttons2State.interpolate({
        inputRange: [0, 1],
        outputRange: colors[1],
        extrapolate: 'clamp'
    });
    const buttons3Color = buttons3State.interpolate({
        inputRange: [0, 1],
        outputRange: colors[2],
        extrapolate: 'clamp'
    });
    const buttons4Color = buttons4State.interpolate({
        inputRange: [0, 1],
        outputRange: colors[3],
        extrapolate: 'clamp'
    });

    const buttonsState = [buttons1State, buttons2State, buttons3State, buttons4State]

    const animate = (sequence: number[]) => {
        const items = sequence.map((i, index) =>
            [
                Animated.timing(buttonsState[i], {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: false,
                    delay: index == 0 ? 500 : 100
                }),
                Animated.timing(buttonsState[i], {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false,
                    delay: 300
                })
            ]).flat()
        Animated.sequence(items).start(() => gameStore.start());
        sequence.map((i, index)=>gameStore.playSound(i,500 + 600 * index))
    }

    console.log(gameStore.state, gameStore.gameSequence)

    const disableGameButtons = gameStore.state != 'play'

    return <View style={styles.container}>
        <View style={{width:'100%'}}>
        <IconButton icon={'trophy'} onPress={goToResults()} size={40} style={{alignSelf:'flex-end'}}/>
        <Text style={[styles.result,{opacity: gameStore.gameSequence.length == 0  ? 0 : 1}]}>Score: {gameStore.gameSequence.length}</Text>
        </View>
        <View style={styles.gameContainer}>
            <AnimatedButton
                style={[styles.gameButton,{ backgroundColor: buttons1Color,alignSelf:'center'}]}
                onPress={pressButton(0)}
                disabled={disableGameButtons}/>
            <View style={styles.rowContainer}>
                <AnimatedButton
                    style={[styles.gameButton,{ backgroundColor: buttons2Color}]}
                    onPress={pressButton(1)}
                    disabled={disableGameButtons}/>
                <AnimatedButton
                    style={[styles.gameButton,{ backgroundColor: buttons3Color}]}
                    onPress={pressButton(2)}
                    disabled={disableGameButtons}/>
            </View>
                <AnimatedButton
                    style={[styles.gameButton,{ backgroundColor: buttons4Color,alignSelf:'center'}]}
                    onPress={pressButton(3)}
                    disabled={disableGameButtons}/>

        </View>
        <Button mode={'contained'} style={styles.playButton} contentStyle={{height:'100%'}} onPress={startGame} disabled={gameStore.state != ''} uppercase={false} theme={{roundness:20}}>
            Start Play
        </Button>
    </View>
}

const styles = StyleSheet.create({
    result: {
        fontSize: 23,
        fontWeight: 'bold',
        marginTop:'3%',
        alignSelf :'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'space-between'
    },
    gameContainer:{
        width: '85%'
    },
    rowContainer:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical:'5%'
    },
    gameButton:{
        width: '30%',
        height: undefined,
        aspectRatio: 1,
        borderRadius: 100
    },
    playButton:{
        width: '80%',
        height:'8%',
        justifyContent:'center',
        marginBottom:'10%'
    }
});

export default observer(GameScreen);
