/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useRef, useEffect } from 'react';

import {
    TouchableOpacity,
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    Alert,
    SafeAreaView,
    FlatList,
    Keyboard,
} from 'react-native';
import { SearchBar, Icon } from '@rneui/themed';
import MapboxGL from '@rnmapbox/maps';
import MapAPi from '../core/api/MapAPI';

MapboxGL.setConnected(true);
MapboxGL.setAccessToken(
    'sk.eyJ1IjoibG9uZ25naGllbSIsImEiOiJjbGhhZHg1NTgwZGlsM2RvMm12cDZ2cGh2In0.JVjOoASg0qcDcXv5wD09dw',
);

const windowWidth = Dimensions.get('window').width;

const FindPlaceScreen = ({navigation}) => {
    const [loadMap, setLoadMap] = useState(
        'https://tiles.goong.io/assets/goong_map_web.json?api_key=YRBODwPBdSEYJQuV1BPYOQIIrtcyzP7z4fkkcsJT',
    );
    const [coordinates] = useState([105.83991, 21.028]);
    const [txtLng, setTextLng] = useState('');
    const [txtlat, setTextLat] = useState('');
    const [search, setSearch] = useState('');
    const [zoomLevel, setZoomlevel] =  useState(4);

    const [locations, setLocations] = useState([]);
    const handleAddMarker = () => {
        if (!txtLng || !txtlat) {
            Alert.alert('Please enter locations');
        } else {
            setTextLng(txtLng);
            setTextLat(txtlat);
            setLocations(a => [
                ...a,
                {
                    key: (locations.length + 1).toString(),
                    coord: [parseFloat(txtLng), parseFloat(txtlat)],
                },
            ]);
        }
    };

    const getFIndText = async () => {
        let searchText = await MapAPi.getFindText(encodeURIComponent(search));
        setLocations(a => [
            ...a,
            {
                key: (locations.length + 1).toString(),
                coord: [
                    parseFloat(searchText.candidates[0].geometry.location.lng),
                    parseFloat(searchText.candidates[0].geometry.location.lat),
                ],
            },
        ]);
        setZoomlevel(10)
    };


    const camera = useRef(null);

    const handleOnPress = (event: any) => {
        const loc = event.geometry.coordinates;
        camera.current?.moveTo(loc, 200);
    };

    const _onBackPress = (navigation: any) => {
        navigation.goBack();
    };

    const updateSearch = (search: any) => {
        setSearch(search);
    };

    const renderHeader = () => {
        return (
            <View style={{ ...styles.toolbar }}>
                <TouchableOpacity
                    hitSlop={styles.hitSlop}
                    onPress={() => {
                        _onBackPress(navigation);
                    }}>
                    <Icon
                        name="arrow-back-outline"
                        type="ionicon"
                        color={'#FFF'}
                        size={20}
                    />
                </TouchableOpacity>
                <Text style={{ ...styles.toolbarTitle }}>
                    Home
                </Text>
                <View />
            </View>
        );
    };


    return (
        <View style={{ flex: 1 }}  >
            <View style={{ flex: 0.08 }}>
                <SafeAreaView>{renderHeader()}</SafeAreaView>
            </View>
            <View style={{ flex: 1 }}>
                <MapboxGL.MapView
                    styleURL={loadMap}
                    onPress={handleOnPress}
                    style={{ flex: 1 }}
                    projection="globe"
                    zoomEnabled={true}>
                    <MapboxGL.Camera
                        ref={camera}
                        zoomLevel={zoomLevel}
                        centerCoordinate={coordinates}
                    />
                    {locations.map(item => (
                        <MapboxGL.PointAnnotation
                            id="pointDirect"
                            key="0909"
                            coordinate={item.coord}
                            draggable={true}>
                            <MapboxGL.Callout title={item.key} />
                        </MapboxGL.PointAnnotation>
                    ))}
                </MapboxGL.MapView>
                <View style={styles.containerInput}>
                    <View>
                        <SearchBar
                            placeholder={'Nhập đia điểm'}
                            onChangeText={updateSearch}
                            lightTheme={true}
                            value={search}
                            inputContainerStyle={styles.searchInputContainer}
                            inputStyle={styles.textSearchInput}
                            containerStyle={styles.searchContainer}
                            showCancel={false}
                        />
                        <TouchableOpacity
                            style={[styles.btnHandleMarker, styles.btnHandleSearch]}
                            onPress={() => getFIndText()}>
                            <Text style={{ marginVertical: 8 }}>Tìm</Text>
                        </TouchableOpacity>
                    </View>                   
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: windowWidth,
        backgroundColor: '#E0E0E0',
    },
    backgroundContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    inputLng: {
        width: 74,
        height: 42,
        borderWidth: 1,
        borderColor: '#959498',
        borderRadius: 8,
        marginHorizontal: 8,
    },
    inputLat: {
        width: 74,
        height: 42,
        borderWidth: 1,
        borderColor: '#959498',
        borderRadius: 8,
    },
    btnHandleMarker: {
        marginHorizontal: 8,
        borderRadius: 8,
        width: 60,
        height: 42,
        alignItems: 'center',
    },
    btnHandleSearch: {
        position: 'absolute',
        right: 10,
        top: 8,
    },
    searchInputContainer: {
        backgroundColor: '#FFF',
        borderColor: '#FFF',
    },
    textSearchInput: {
        fontSize: 10,
    },
    searchContainer: {
        padding: 0,
        backgroundColor: '#f6f7fb',
    },
    toolbar: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        backgroundColor: '#0E4E9B',
        height: 48,
        borderBottomColor: '#e2e1e1',
        borderBottomWidth: 1,
    },
    toolbarTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 18,
        color: '#FFF',
    },
    hitSlop: {
        top: 16,
        bottom: 16,
        left: 16,
        right: 16,
    },
    itemSelect: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
});

export default FindPlaceScreen;
