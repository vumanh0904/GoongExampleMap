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
    Image,
} from 'react-native';
import { SearchBar, Icon } from '@rneui/themed';
import MapboxGL from '@rnmapbox/maps';
import MapAPi from '../core/api/MapAPI';
import { Drawer } from '@ant-design/react-native';

MapboxGL.setConnected(true);
MapboxGL.setAccessToken(
    'sk.eyJ1IjoibG9uZ25naGllbSIsImEiOiJjbGhhZHg1NTgwZGlsM2RvMm12cDZ2cGh2In0.JVjOoASg0qcDcXv5wD09dw',
);

const windowWidth = Dimensions.get('window').width;

const DistanceMatrixScreen = ({ navigation }) => {
    const [loadMap, setLoadMap] = useState(
        'https://tiles.goong.io/assets/goong_map_web.json?api_key=YRBODwPBdSEYJQuV1BPYOQIIrtcyzP7z4fkkcsJT',
    );
    const [coordinates, setCoordinates] = useState([105.83991, 21.028]);

    const [search, setSearch] = useState('');
    const [isShowLocation, setIsShowLocation] = useState(true)
    const [zoomLevel, setZoomlevel] = useState(4);
    const [isShowDrawer, setIsShowDrawer] = useState(false)

    const [ishowFromDirect, setIshowFromDirect] = useState(false)
    const [ishowToDirect, setIshowToDirect] = useState(false)
    const [isShowMarker, setIsShowMarker] = useState(false)

    const [description, setDescription] = useState([]);
    const [descriptionFromDirect, setDescriptionFromDirect] = useState([]);
    const [descriptionToDirect, setDescriptionToDirect] = useState([]);

    const [infomationDistance, setInfomationDistance] = useState('');
    const [infomationDuration, setInfomationDuration] = useState('');

    const [locations, setLocations] = useState([]);

    const [route, setRoute] = useState({
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: [],
                },
            },
        ],
    });


    const [txtFromDirect, setTxtFromDirect] = useState('');
    const [txtToDirect, setTxtToDirect] = useState('');

    const getPlacesAutocomplete = async () => {
        let autoComplete = await MapAPi.getPlacesAutocomplete({
            search: encodeURIComponent(search),
        });
        setDescription(autoComplete.predictions);
    };

    const getDirectFromAutoComplete = async () => {
        let autoComplete = await MapAPi.getPlacesAutocomplete({
            search: encodeURIComponent(txtFromDirect),
        });
        setDescriptionFromDirect(autoComplete.predictions);
    };

    const getDirectToAutoComplete = async () => {
        let autoComplete = await MapAPi.getPlacesAutocomplete({
            search: encodeURIComponent(txtToDirect),
        });
        setDescriptionToDirect(autoComplete.predictions);
    };

    const getDirections = async () => {

        let directions = await MapAPi.getDirections({
            origin: locations[0].coord,
            destination: locations[1].coord
        });
        // console.log("878787878", directions.routes[0].legs[0].steps)
        const steps = directions.routes[0].legs[0].steps;
        let updatedCoordinates = [];
        steps.map(item => {
            updatedCoordinates.push([item.start_location.lng, item.start_location.lat])
        })
        setCoordinates(updatedCoordinates[1])

        setRoute((prev) => ({
            ...prev,
            features: [
                {
                    ...prev.features[0],
                    geometry: {
                        ...prev.features[0].geometry,
                        coordinates: updatedCoordinates
                    },
                },
            ],
        }));
        const distance = directions.routes[0].legs[0].distance.text
        const duration = directions.routes[0].legs[0].duration.text
        setInfomationDistance(distance)
        setInfomationDuration(duration)
    };
    console.log("3333333", infomationDistance, infomationDuration)
    const camera = useRef(null);

    const handleOnPress = (event) => {
        const loc = event.geometry.coordinates;
        camera.current?.moveTo(loc, 200);
    };

    const _onBackPress = (navigation) => {
        navigation.goBack();
    };


    const updateFromDirect = (text) => {
        setTxtFromDirect(text)
        setIshowFromDirect(true)
        setIshowToDirect(false)
        setIsShowLocation(false)
        if (text.length >= 5) {
            getDirectFromAutoComplete();
        }
    }
    const updateToDirect = (text) => {
        console.log("5656565656", text)
        setTxtToDirect(text)
        setIshowToDirect(true)
        setIsShowLocation(false)
        setIshowFromDirect(false)
        if (text.length >= 5) {
            getDirectToAutoComplete();
        }
    }

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
            setZoomlevel(10)
        }

    }

    const _handleSubmitOriginsDirect = async (item) => {

        let geocoding = await MapAPi.getGeocoding({
            description: encodeURIComponent(item.item.description),
        });

        let placeDetail = await MapAPi.getPlaceDetail({
            place_id: descriptionFromDirect[item.index].place_id
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
            setZoomlevel(10)
        }

    }

    const _handleSubmitDestinations = async (item) => {

        let geocoding = await MapAPi.getGeocoding({
            description: encodeURIComponent(item.item.description),
        });
        console.log('6666666', geocoding.results[item.index])

        let placeDetail = await MapAPi.getPlaceDetail({
            place_id: descriptionToDirect[item.index].place_id
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
            setZoomlevel(10)
        }

    }

    const drawerRef = useRef(null);

    const handleSearch = () => {
        getDirections();
        setIsShowDrawer(false)
        setIsShowMarker(true)
        setZoomlevel(16)
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

    const renderItem = (item) => {

        return (
            <TouchableOpacity
                onPress={() => {
                    isShowLocation ?
                        setSearch(item.item.description)
                        : ishowFromDirect ?
                            setTxtFromDirect(item.item.description) :
                            setTxtToDirect(item.item.description)
                    isShowLocation ?
                        setIsShowLocation(false) :
                        ishowFromDirect ?
                            setIshowFromDirect(false) :
                            setIshowToDirect(false)
                    isShowLocation ?
                        _handleSubmit(item)
                        : ishowFromDirect ?
                            _handleSubmitOriginsDirect(item) :
                            _handleSubmitDestinations(item)
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
                    <Text >
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
                    >
                    </MapboxGL.Camera>

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
                        isShowMarker ?
                            <MapboxGL.MarkerView id={"marker"} coordinate={coordinates}>
                                {/* <View> */}
                                    <View style={styles.markerContainer}>
                                        <MapboxGL.Callout
                                            title={`${infomationDistance}\n${infomationDuration}`} 
                                            tooltip={true} 
                                            textStyle={'red'}                                       
                                            />
                                    </View>
                                {/* </View> */}
                            </MapboxGL.MarkerView> : null
                    }


                    <MapboxGL.ShapeSource id="line1" shape={route}>
                        <MapboxGL.LineLayer
                            id="linelayer1"
                            style={{ lineColor: '#0E4E9B', lineWidth: 5 }}
                        >
                        </MapboxGL.LineLayer>
                    </MapboxGL.ShapeSource>

                </MapboxGL.MapView>
                <View style={styles.containerInput}>
                    <View style={{ flexDirection: 'row', backgroundColor: '#FFF', width: windowWidth }}>
                        <View >
                            <View style={styles.locationDirect}>
                                <Icon
                                    name="ellipse-outline"
                                    type="ionicon"
                                    color={'blue'}
                                    size={24}
                                />
                                <SearchBar
                                    placeholder={'Nhập đia điểm'}
                                    onChangeText={updateFromDirect}
                                    lightTheme={true}
                                    value={txtFromDirect}
                                    inputContainerStyle={styles.searchInputContainer}
                                    inputStyle={styles.textSearchInput}
                                    containerStyle={styles.searchContainerDirect}
                                />
                            </View>
                            <View style={{ marginVertical: 4 }}></View>
                            <View style={styles.locationDirect}>
                                <Icon
                                    name="location-outline"
                                    type="ionicon"
                                    color={'red'}
                                    size={24}
                                />
                                <SearchBar
                                    placeholder={'Nhập đia điểm đến'}
                                    onChangeText={updateToDirect}
                                    lightTheme={true}
                                    value={txtToDirect}
                                    inputContainerStyle={styles.searchInputContainer}
                                    inputStyle={styles.textSearchInput}
                                    containerStyle={styles.searchContainerDirect}
                                />
                            </View>
                            <View>
                                <View style={{flexDirection:'row', marginHorizontal:16, marginVertical:8}}>
                                <Icon
                                    name="car-sport-outline"
                                    type="ionicon"
                                    color={'#0E4E9B'}
                                    size={24}
                                />
                                
                                <Text style={{marginHorizontal:8}}>{`${infomationDistance} ${infomationDuration}`}</Text>
                                <Icon
                                    name="bicycle-outline"
                                    type="ionicon"
                                    color={'#0E4E9B'}
                                    size={24}
                                />
                                
                                <Text style={{marginHorizontal:8}}>{`${infomationDistance} ${infomationDuration}`}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleSearch()}
                            style={{marginVertical:60}}
                        >
                            <Image
                                source={require('../assets/icon/directions.png')}
                                style={styles.icondirect}
                                tintColor={'#0E4E9B'}
                            />
                        </TouchableOpacity>

                    </View>
                </View>
                {
                    ishowFromDirect ?
                        <View style={{ position: 'absolute', top: 72, left: 4, width: 400, backgroundColor: '#FFF' }}>
                            <FlatList
                                data={descriptionFromDirect}
                                renderItem={renderItem}
                            />
                        </View>
                        : null
                }
                {
                    ishowToDirect ?
                        <View style={{ position: 'absolute', top: 140, left: 4, width: 400, backgroundColor: '#FFF' }}>
                            <FlatList
                                data={descriptionToDirect}
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
        width: 300,
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
        justifyContent: 'space-around',
        paddingVertical: 12,
        marginHorizontal: 8,
        alignItems: 'center'
    },
    icondirect: {
        width: 24,
        height: 24,
    },
    txtInputSidebar: {
        width: 200,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: 12
    },
    locationDirect: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    btnViewDirect: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12
    },
    btnDirect: {
        backgroundColor: '#0E4E9B',
        borderColor: '#0E4E9B',
        borderRadius: 8,
        width: 94,
        height: 42
    },
    btnDirectCancle: {
        backgroundColor: '#4B7DBA',
        borderColor: '#4B7DBA',
        borderRadius: 8,
        width: 94,
        height: 42
    },
    txtDirect: {
        color: '#ccc',
        textAlign: 'center',
        marginVertical: 12
    },
    markerContainer: {
        alignItems: "center",
        width: 80,
        backgroundColor: "transparent",
        height: 70,
        marginRight:50,
        // backgroundColor:'#0E4E9B'
    },
    textContainer: {
        backgroundColor: "#ccc",
        borderRadius: 10,
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        textAlign: "center",
        paddingHorizontal: 5,
        flex: 1,
        color: "#0E4E9B",
    },

});

export default DistanceMatrixScreen;
