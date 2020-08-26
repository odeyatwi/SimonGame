import React, {FunctionComponent, useCallback, useEffect, useRef} from "react";
import {Animated, TouchableOpacity, View, Text, StyleSheet} from "react-native";
import {observer} from "mobx-react";
import {useGlobalStore} from "../store";
import {Button, Colors} from "react-native-paper";


const colors = [
    [Colors.redA700, Colors.red300],
    [Colors.green900, Colors.green300],
    [Colors.blueA700, Colors.blue300],
    [Colors.yellowA700, Colors.yellow200]
]

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity)

const GameScreen: FunctionComponent = () => {

    const gameStore = useGlobalStore().game;

    useEffect(() => {
        if (gameStore.state == 'show') {
            animate(gameStore.gameSequence);
        }
    }, [gameStore.state, gameStore.gameSequence])

    const startGame = useCallback(() => {
        gameStore.nextStep();
    }, [gameStore.nextStep]);

    const pressButton = useCallback((number: number) => () => {
        gameStore.playStep(number);
    }, [gameStore.playStep])

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

        <Text style={[styles.result,{opacity: gameStore.gameSequence.length < 1  ? 0 : 1}]}>Score: {gameStore.gameSequence.length - 1}</Text>
        <View style={styles.gameContainer}>
            <View style={styles.rowContainer}>
                <AnimatedButton
                    style={[styles.gameButton,{ backgroundColor: buttons1Color}]}
                    onPress={pressButton(0)}
                    disabled={disableGameButtons}>
                        <Text style={{color: 'white', fontSize: 20, alignSelf: 'center'}}>0</Text>
                </AnimatedButton>
                <AnimatedButton
                    style={[styles.gameButton,{ backgroundColor: buttons2Color}]}
                    onPress={pressButton(1)}
                    disabled={disableGameButtons}>
                        <Text style={{color: 'white', fontSize: 20, alignSelf: 'center'}}>1</Text>
                </AnimatedButton>
            </View>
            <View style={[styles.rowContainer,{marginTop: '10%'}]}>
                <AnimatedButton
                    style={[styles.gameButton,{ backgroundColor: buttons3Color}]}
                    onPress={pressButton(2)}
                    disabled={disableGameButtons}>
                        <Text style={{color: 'white', fontSize: 20, alignSelf: 'center'}}>2</Text>
                </AnimatedButton>
                <AnimatedButton
                    style={[styles.gameButton,{ backgroundColor: buttons4Color}]}
                    onPress={pressButton(3)}
                    disabled={disableGameButtons}>
                        <Text style={{color: 'white', fontSize: 20, alignSelf: 'center'}}>3</Text>
                </AnimatedButton>
            </View>

        </View>
        <Button mode={'contained'} style={styles.playButton} contentStyle={{height:'100%'}} onPress={startGame} disabled={gameStore.state != ''} uppercase={false} theme={{roundness:20}}>
            Start Play
        </Button>
    </View>
}

const styles = StyleSheet.create({
    result: {
        fontSize: 23,
        fontWeight:'900'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'space-around'
    },
    gameContainer:{
        width: '80%'
    },
    rowContainer:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    gameButton:{
        width: '40%',
        height: undefined,
        aspectRatio: 1
    },
    playButton:{
        width: '80%',
        height:'8%',
        justifyContent:'center'
    }
})

export default observer(GameScreen)
