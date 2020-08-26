import React, {FunctionComponent, useCallback, useEffect, useState} from "react";
import {
    View,
    Text,
    FlatList,
    ListRenderItemInfo,
    StyleSheet
} from "react-native";
import {observer} from "mobx-react";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParamList} from "../navigation/StackComponent";
import {
    Button,
    Dialog,
    Portal,
    TextInput,
    FAB,
    Card,
    Title
} from "react-native-paper";
import {useGlobalStore} from "../store";
import {GameResult} from "../data/types/GameResult";
//@ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = StackScreenProps<RootStackParamList, 'ResultScreen'>;


const ResultsScreen: FunctionComponent<Props> = (props) => {
    const resultStore = useGlobalStore().result;
    const [scoreModalVisible, setScoreModalVisible] = useState(!!props.route.params.score);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        resultStore.getResults();
    }, [])

    const hideModal = useCallback(() => setScoreModalVisible(false), []);

    const saveScore = useCallback(() => {
        if (props.route.params.score) {
            resultStore.addResult({score: props.route.params.score!, name: userName});
            setScoreModalVisible(false);
        }
    }, [userName]);

    const openGameScreen = useCallback(() => {
        props.navigation.pop();
    }, []);

    const renderSaveModal = () =>
        <Portal>
            <Dialog visible={scoreModalVisible} onDismiss={hideModal}>
                <Dialog.Title>Your score: {props.route.params.score}</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        mode={'outlined'}
                        value={userName}
                        onChangeText={setUserName}
                        label={'Your name'}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideModal}>CANCEL</Button>
                    <Button onPress={saveScore}>SAVE</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>;

    const renderItem = (item: ListRenderItemInfo<GameResult>) => {
        let trophyColor = 'rgba(0,0,0,0)'
        if (item.index == 0) {
            trophyColor = '#AF9500'
        } else if (item.index == 1) {
            trophyColor = '#B4B4B4'
        } else if (item.index == 2) {
            trophyColor = '#AD8A56'
        }
        return <Card style={[styles.card]}>
            <Card.Title
                title={item.item.name}
                left={() => <Icon name="trophy" size={30} color={trophyColor}/>}
                right={() => <Text style={styles.score}>Score: {item.item.score}</Text>}

            />
        </Card>
    };

    return <View style={styles.container}>
        {props.route.params.score && renderSaveModal()}
        <Title style={styles.title}><Icon name="trophy" size={30} color='#AF9500'/> Score List <Icon name="trophy"
                                                                                                     size={30}
                                                                                                     color='#AF9500'/></Title>
        <FlatList
            style={styles.container}
            contentContainerStyle={[resultStore.results.length == 0 && styles.container]}
            data={resultStore.results}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.score * index + item.name}
            ListEmptyComponent={<View style={styles.emptyContainer}>
                <Button onPress={openGameScreen}>GO PLAY</Button>
            </View>}
        />
        <FAB visible={resultStore.results.length > 0} icon={'gamepad-variant'} onPress={openGameScreen}
             style={styles.fab}/>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    card: {
        width: '95%',
        alignSelf: 'center',
        marginVertical: 10,
    },
    score: {
        marginHorizontal: '2%',
        fontSize: 16
    },
    title: {
        fontSize: 25,
        alignSelf: 'center',
        marginVertical: '8%'
    }
});

export default observer(ResultsScreen);
