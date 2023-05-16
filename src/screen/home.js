import React, { useState, useRef, useEffect } from 'react';

import {
    TouchableOpacity,
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    Alert,
    TouchableWithoutFeedback,
    FlatList,
    Keyboard,
} from 'react-native';


const windowWidth = Dimensions.get('window').width;

const HomeScreen = ({navigation}) => {

    const handleAutoComplete = () => {
        navigation.navigate('AutoCompleteScreen')
    }
    const handleGeocoding = () => {

    }
    const handleFindPlace = () => {
        navigation.navigate('FindPlaceScreen')
    }
    const handleManualEditing = () => {
        navigation.navigate('ManualEditingScreen')
    }

    return (
        <View style={styles.container} >
            <TouchableOpacity
                style={[styles.btnclick, styles.btnAutoComplete]}
                onPress={handleAutoComplete}>
                <Text style={{ marginVertical: 8 }}>Auto Complete</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.btnclick, styles.btnGeocoding]}
                onPress={handleGeocoding}>
                <Text style={{ marginVertical: 8 }}>Geocoding</Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems:'center',
        marginVertical:100,        
    },
    btnclick: {
        marginHorizontal: 8,
        borderRadius: 8,
        width: 100,
        height: 42,
        alignItems: 'center',
        marginVertical:16
    },
    btnAutoComplete: {
        backgroundColor: '#0E4E9B',
        borderColor: '#0E4E9B',
    },
    btnGeocoding: {
        backgroundColor: '#78D3FF',
        borderColor: '#78D3FF',
    },
    btnFindPlace:{
        backgroundColor: 'red',
        borderColor: 'red',
    },
    btnManualEditing:{
        backgroundColor: 'green',
        borderColor: 'green',
    }
});

export default HomeScreen;
