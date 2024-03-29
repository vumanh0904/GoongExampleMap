import React, { useState, useRef, useEffect } from 'react';

import {
    TouchableOpacity,
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
} from 'react-native';
import {
    SafeAreaInsetsContext,
    SafeAreaView,
} from 'react-native-safe-area-context';
import GeneralStatusBar from '../config/generalStatusBar/GeneralStatusBar';


const windowWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {

    const handleAutoComplete = () => {
        navigation.navigate('AutoCompleteScreen')
    }
    const handleDistanceMatrix = () => {
        navigation.navigate('DistanceMatrixScreen')
    }
    const handleFindPlace = () => {
        navigation.navigate('FindPlaceScreen')
    }
    const handleManualEditing = () => {
        navigation.navigate('ManualEditingScreen')
    }
    const handleCircelMaping = () => {
        navigation.navigate('CircleMapScreen')
    }

    return (
        <SafeAreaInsetsContext.Consumer>
            {insets => (
                <>
                    <GeneralStatusBar
                        backgroundColor={'transparent'}
                        barStyle="transparent"

                    />
                    <SafeAreaView
                        style={{
                            backgroundColor: "#0E4E9B",
                            paddingTop: 0,
                            paddingBottom: Platform.OS == 'ios' ? -48 : 0,
                        }}>

                    </SafeAreaView>
                    <View style={styles.container} >
                        <TouchableOpacity
                            style={[styles.btnclick, styles.btnAutoComplete]}
                            onPress={handleAutoComplete}>
                            <Text style={{ marginVertical: 8 }}>Auto Complete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btnclick, styles.btnGeocoding]}
                            onPress={handleDistanceMatrix}>
                            <Text style={{ marginVertical: 8 }}>Distance Matrix</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btnclick, styles.btnFindPlace]}
                            onPress={handleFindPlace}>
                            <Text style={{ marginVertical: 8 }}>Find Place</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btnclick, styles.btnManualEditing]}
                            onPress={handleManualEditing}>
                            <Text style={{ marginVertical: 8 }}>Manual editing</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btnclick, styles.btnCircleMap]}
                            onPress={handleCircelMaping}>
                            <Text style={{ marginVertical: 8 }}>Circle Maping</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaInsetsContext.Consumer >
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 100,
    },
    btnclick: {
        marginHorizontal: 8,
        borderRadius: 8,
        width: 100,
        height: 42,
        alignItems: 'center',
        marginVertical: 16
    },
    btnAutoComplete: {
        backgroundColor: '#0E4E9B',
        borderColor: '#0E4E9B',
    },
    btnGeocoding: {
        backgroundColor: '#78D3FF',
        borderColor: '#78D3FF',
    },
    btnFindPlace: {
        backgroundColor: 'red',
        borderColor: 'red',
    },
    btnManualEditing: {
        backgroundColor: 'green',
        borderColor: 'green',
    },
    btnCircleMap: {
        backgroundColor: 'orange',
        borderColor: 'orange',
    },
});

export default HomeScreen;
