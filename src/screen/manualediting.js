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
import { Colors } from 'react-native/Libraries/NewAppScreen';

MapboxGL.setConnected(true);
MapboxGL.setAccessToken(
    'sk.eyJ1IjoibG9uZ25naGllbSIsImEiOiJjbGhhZHg1NTgwZGlsM2RvMm12cDZ2cGh2In0.JVjOoASg0qcDcXv5wD09dw',
);

const windowWidth = Dimensions.get('window').width;

const ManualEditingScreen = ({ navigation }) => {
    const [loadMap, setLoadMap] = useState(
        'https://tiles.goong.io/assets/goong_map_web.json?api_key=YRBODwPBdSEYJQuV1BPYOQIIrtcyzP7z4fkkcsJT',
    );
    const [coordinates] = useState([105.83991, 21.028]);
    const [txtLng, setTextLng] = useState('');
    const [txtlat, setTextLat] = useState('');
    const [changeTextLng, setChangeTextLng] = useState([]);
    const [changeTextLat, setChangeTextLat] = useState([]);
    const [isShowLocation, setIsShowLocation] = useState(false);
    const [description, setDescription] = useState([]);
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

    const camera = useRef(null);

    const handleOnPress = (event: any) => {
        const loc = event.geometry.coordinates;
        camera.current?.moveTo(loc, 200);
    };
    const handleChangeMarker = () => {
        setIsShowLocation(true)
        setChangeTextLng([...Array(locations.length).keys()].map(() => ' '));
        setChangeTextLat([...Array(locations.length).keys()].map(() => ' '));
    };

    const handleDeleteMarker = (item) => {
        setLocations((e) => {
            const newLocations = [...e];
            newLocations.splice(item.index, 1);
            return newLocations;
        });
    };

    const _onBackPress = (navigation) => {
        navigation.goBack();
    };
    const handleEditMarker = async (item) => {
        setLocations(prev => {
            prev[item.index].coord = [changeTextLng[item.index], changeTextLat[item.index]];
            return [...prev];
        })

    }


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

    const renderItem = (item) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <View style={styles.itemSelect}>
                    <Icon
                        name="location-outline"
                        type="ionicon"
                        color={'#959498'}
                        size={12}
                    />
                    <TextInput
                        style={styles.inputChange}
                        // onChangeText={text => setChangeTextLng(text)}
                        onChangeText={value => setChangeTextLng(prev => {
                            prev[item.index] = value;
                            return [...prev];
                        })
                        }
                        placeholder={`${item?.item?.coord?.[0]}`}
                        value={changeTextLng[item.key]}
                    />
                    <TextInput
                        style={styles.inputChange}
                        onChangeText={value => setChangeTextLat(prev => {
                            prev[item.index] = value;
                            return [...prev];
                        })
                        }
                        placeholder={`${item?.item?.coord?.[1]}`}
                        value={changeTextLat[item.key]}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.btnChange]}
                    onPress={() => handleEditMarker(item)}>
                    <Text style={{ marginVertical: 12, color: '#78D3FF' }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btnChange]}
                    onPress={() => handleDeleteMarker(item)}>
                    <Text style={{ marginVertical: 12, color: 'red' }}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
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
                        zoomLevel={4}
                        centerCoordinate={coordinates}
                    />

                    {/* many point */}
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

                    <View style={{ backgroundColor: '#E0E0E0' }}>
                        <FlatList
                            data={description}
                            renderItem={renderItem} />
                    </View>
                    <Text>Thay đổi location </Text>
                    <View style={styles.backgroundContainer}>
                        <TextInput
                            style={styles.inputLng}
                            onChangeText={setTextLng}
                            value={txtLng}
                        />
                        <TextInput
                            style={styles.inputLat}
                            onChangeText={setTextLat}
                            value={txtlat}
                        />
                        <TouchableOpacity
                            style={[styles.btnHandleMarker, styles.btnHandleAddMarker]}
                            onPress={handleAddMarker}>
                            <Text style={{ marginVertical: 8 }}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btnHandleMarker, styles.btnHandleEditMarker]}
                            onPress={handleChangeMarker}>
                            <Text style={{ marginVertical: 8 }}>Change</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                {
                    isShowLocation ?
                        <View style={{ position: 'absolute', top: 72, left: 0, width: windowWidth, backgroundColor: '#FFFF' }}>
                            <FlatList
                                data={locations}
                                renderItem={renderItem}
                            />
                        </View>
                        : null
                }
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
        // height: 140,
        backgroundColor: '#E0E0E0',
    },
    backgroundContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    inputLng: {
        width: 90,
        height: 42,
        borderWidth: 1,
        borderColor: '#959498',
        borderRadius: 8,
        marginHorizontal: 8,
    },
    inputLat: {
        width: 90,
        height: 42,
        borderWidth: 1,
        borderColor: '#959498',
        borderRadius: 8,
    },
    inputChange: {
        width: 90,
        height: 42,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    btnHandleMarker: {
        marginHorizontal: 8,
        borderRadius: 8,
        width: 80,
        height: 42,
        alignItems: 'center',
    },
    btnChange: {
        marginHorizontal: 8,
        borderRadius: 8,
        width: 60,
        height: 42,
        alignItems: 'center',
        alignContent: 'center'
    },
    btnHandleAddMarker: {
        backgroundColor: '#0E4E9B',
        borderColor: '#0E4E9B',
    },
    btnHandleEditMarker: {
        backgroundColor: '#78D3FF',
        borderColor: '#78D3FF',
    },
    btnHandleDeleteMarker: {
        backgroundColor: 'red',
        borderColor: 'red',
    },
    btnHandleSearch: {
        position: 'absolute',
        right: 10,
        top: 8,
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
        color: '#FFFF',
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
        marginHorizontal: 8,
        alignItems: 'center'
    },
});

export default ManualEditingScreen;
