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
    Animated,
    SafeAreaView,
    FlatList,
    Keyboard,
} from 'react-native';
import { SearchBar, Icon } from '@rneui/themed';
import MapboxGL from '@rnmapbox/maps';
import MapAPi from '../core/api/MapAPI';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

MapboxGL.setConnected(true);
MapboxGL.setAccessToken(
    'sk.eyJ1IjoibG9uZ25naGllbSIsImEiOiJjbGhhZHg1NTgwZGlsM2RvMm12cDZ2cGh2In0.JVjOoASg0qcDcXv5wD09dw',
);

const windowWidth = Dimensions.get('window').width;

const CircleMapScreen = ({ navigation }) => {
    const [loadMap, setLoadMap] = useState(
        'https://tiles.goong.io/assets/goong_map_web.json?api_key=YRBODwPBdSEYJQuV1BPYOQIIrtcyzP7z4fkkcsJT',
    );
    const [coordinates, setCoordinates] = useState([105.79068762200006, 21.017693335000047]);
    const [radius, setRadius] = useState(25);

    const [search, setSearch] = useState('');
    const [isShowLocation, setIsShowLocation] = useState(true)
    const [isShowCircle, setShowCirCle] = useState(false)
    const [zoomLevel, setZoomlevel] = useState(4);

    const [description, setDescription] = useState([]);
    const [locations, setLocations] = useState([]);

    const createCircle = () => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinates,
            },
            properties: {
                radius: radius,
            },
        };
    };

    const getPlacesAutocomplete = async () => {
        let autoComplete = await MapAPi.getPlacesAutocomplete({
            search: encodeURIComponent(search),
        });
        setDescription(autoComplete.predictions);
    };

    const camera = useRef(null);
    const circleRef = useRef(null);

    const handleOnPress = (event) => {
        const loc = event.geometry.coordinates;
        camera.current?.moveTo(loc, 200);
    };

    const _onBackPress = (navigation) => {
        navigation.goBack();
    };

    const updateSearch = (search) => {
        setSearch(search);
        setIsShowLocation(true)
        if (search.length >= 5) {
            getPlacesAutocomplete();
        }
    };

    const handlePanGestureEvent = ({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          const newRadius = // Tính toán bán kính mới dựa trên sự di chuyển của người dùng
          setCircleRadius(newRadius);
        }
      };

    const _handleSubmit = async (item) => {

        let geocoding = await MapAPi.getGeocoding({
            description: encodeURIComponent(item.item.description),
        });
        let placeDetail = await MapAPi.getPlaceDetail({
            place_id: description[item.index].place_id
        });

        const address = placeDetail.result.formatted_address

        if (geocoding.status === 'OK') {
            setLocations(a => [
                ...a,
                {
                    key: address,
                    coord: [
                        parseFloat(geocoding.results[item.index].geometry.location.lng),
                        parseFloat(geocoding.results[item.index].geometry.location.lat),
                    ],
                },
            ]);
            setCoordinates(
                [parseFloat(geocoding.results[item.index].geometry.location.lng),
                parseFloat(geocoding.results[item.index].geometry.location.lat)])

            setZoomlevel(14)
            setShowCirCle(true)
        }
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
            <TouchableOpacity
                onPress={() => {
                    setSearch(item.item.description)
                    setIsShowLocation(false)
                    _handleSubmit(item);
                }}
                style={{ paddingLeft: 8 }}
            >
                <View style={styles.itemSelect}>
                    <Icon
                        name="location-outline"
                        type="ionicon"
                        color={'#959498'}
                        size={12}
                    />
                    <Text style={{ textAlign: 'left' }}>
                        {item.item.description}
                    </Text>
                    <View></View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1 }} >
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
                    {
                        isShowCircle ?
                            <MapboxGL.ShapeSource id="circleSource"
                                shape={createCircle(coordinates, radius)}
                            >
                                <MapboxGL.CircleLayer
                                    id="circleLayer"
                                    ref={circleRef}
                                    minZoomLevel={10}
                                    maxZoomLevel={16}
                                    style={{                
                                        circleColor: 'rgba(0, 0, 255, 0.5)',
                                        circleStrokeWidth: 50,
                                        circleStrokeWidthTransition: { duration: 300, delay: 50 },
                                        circleStrokeColor: 'rgba(0, 0, 255, 0.5)'
                                    }} />
                            </MapboxGL.ShapeSource> : null
                    }
                    <PanGestureHandler onGestureEvent={handlePanGestureEvent}>
                        <View style={{ flex: 1 }} />
                    </PanGestureHandler>
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
                            containerStyle={styles.searchContainerDirect}
                        />

                    </View>
                </View>
                {
                    isShowLocation ?
                        <View style={{ position: 'absolute', top: 64, left: 16, width: 365, backgroundColor: '#FFFF' }}>
                            <FlatList
                                data={description}
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
        top: 2,
        left: 0,
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
    searchInputContainer: {
        backgroundColor: '#FFFF',
        borderColor: '#FFFF',
    },
    textSearchInput: {
        fontSize: 14,
    },
    searchContainerDirect: {
        width: 380,
        marginHorizontal: 8,
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
        alignItems: 'center'
    },
    circles: {
        visibility: 'visible',
        circleRadius: 40,
        circleColor: 'red',
        circleStrokeColor: 'black',
        circleStrokeWidth: 5,
        circleOpacity: 0.0
    },
});

export default CircleMapScreen;
