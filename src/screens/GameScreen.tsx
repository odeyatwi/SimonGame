import React, {FunctionComponent, useCallback, useEffect, useRef, useState} from "react";
import {Animated, View} from "react-native";
import {observer} from "mobx-react";
import {useGlobalStore} from "../store";
import {Button, TouchableRipple} from "react-native-paper";

const colors = [
    ['rgb(186, 0, 0)', 'rgba(186, 78, 0)'],
    ['rgb(0, 186, 0)', 'rgb(130, 186, 0)'],
    ['rgb(0, 0, 162)', 'rgb(0, 73, 162)'],
    ['rgb(254, 230, 0)', 'rgb(254, 254, 102)']
]


const GameScreen: FunctionComponent = () => {
    const gameStore = useGlobalStore().game;

    const [level, setLevel] = useState(0);

    useEffect(()=>{
        if(gameStore.state == 'show'){
            animate(gameStore.gameSequence);
        }
    },[gameStore.state,gameStore.gameSequence])

    const startGame = useCallback(() => {
        gameStore.nextStep();
    }, [gameStore.nextStep]);

    const buttonsState: Animated.Value[] = Array(4).fill(useRef(new Animated.Value(0)).current);

    const buttonsColors = buttonsState.map((state, index) => state.interpolate({
        inputRange: [0, 1],
        outputRange: colors[index],
        extrapolate: 'clamp'
    }));

    const animate = (sequence: number[]) => {
        Animated.sequence(
            sequence.map(i => Animated.sequence(
                [
                    Animated.timing(buttonsState[i], {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: false
                    }),
                    Animated.timing(buttonsState[i], {
                        toValue: 0,
                        duration: 50,
                        useNativeDriver: false,
                        delay: 70
                    })
                ]
            ))
        ).start(gameStore.start);
    }

    return <View style={{flex: 1, alignItems: 'center'}}>

        <View style={{width: '80%'}}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableRipple disabled={gameStore.state != 'play'}>
                    <Animated.View style={{backgroundColor:buttonsColors[0]}}/>
                </TouchableRipple>
                <TouchableRipple disabled={gameStore.state != 'play'}>
                    <Animated.View style={{backgroundColor:buttonsColors[1]}}/>
                </TouchableRipple>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableRipple disabled={gameStore.state != 'play'}>
                    <Animated.View style={{backgroundColor:buttonsColors[2]}}/>
                </TouchableRipple>
                <TouchableRipple disabled={gameStore.state != 'play'}>
                    <Animated.View style={{backgroundColor:buttonsColors[3]}}/>
                </TouchableRipple>
            </View>

        </View>
        <Button style={{width: '80%'}} onPress={startGame} disabled={gameStore.state != ''} uppercase={false}>
            Start Play
        </Button>
    </View>
}

export default observer(GameScreen)
