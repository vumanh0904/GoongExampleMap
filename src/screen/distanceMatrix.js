/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
} from 'react-native';
import {
    SafeAreaInsetsContext,
    SafeAreaView,
} from 'react-native-safe-area-context';
import debounce from 'lodash.debounce'
import { SearchBar, Icon } from '@rneui/themed';
import MapboxGL, { MarkerView } from '@rnmapbox/maps';
import MapAPi from '../core/api/MapAPI';
import GeneralStatusBar from '../config/generalStatusBar/GeneralStatusBar';
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';


MapboxGL.setConnected(true);
MapboxGL.setAccessToken(
    'sk.eyJ1IjoibG9uZ25naGllbSIsImEiOiJjbGhhZHg1NTgwZGlsM2RvMm12cDZ2cGh2In0.JVjOoASg0qcDcXv5wD09dw',
);

const windowWidth = Dimensions.get('window').width;

const DistanceMatrixScreen = ({ navigation }) => {
    const [loadMap, setLoadMap] = useState(
        'https://tiles.goong.io/assets/goong_map_web.json?api_key=YRBODwPBdSEYJQuV1BPYOQIIrtcyzP7z4fkkcsJT',
    );
    const [coordinates, setCoordinates] = useState([105.81057, 21.01039]);

    const [zoomLevel, setZoomlevel] = useState(4);
    const [indexDirection, setIndexDirection] = useState(0);

    const [ishowFromDirect, setIshowFromDirect] = useState(false);
    const [ishowToDirect, setIshowToDirect] = useState(false);
    const [isShowMarker, setIsShowMarker] = useState(false);
    const [activeInformation, setActiveInformation] = useState(false);
    const [activeCar, setActiveCar] = useState(true);
    const [activeBike, setActiveBike] = useState(false);
    const [activeTrain, setActiveTrain] = useState(false);
    const [activeWalk, setActiveWalk] = useState(false);
    const [activePlane, setActivePlane] = useState(false);
    const [isShowHeader, setIsShowHeader] = useState(true)


    const [descriptionFromDirect, setDescriptionFromDirect] = useState([]);
    const [descriptionToDirect, setDescriptionToDirect] = useState([]);
    const [locations, setLocations] = useState([]);
    const [route, setRoute] = useState([]);

    const [txtFromDirect, setTxtFromDirect] = useState('');
    const [txtToDirect, setTxtToDirect] = useState('');
    const [informationCar, setInformationCar] = useState('');
    const [informationBike, setInformationBike] = useState('');
    const [informationTrain, setInformationTrain] = useState('');
    const [informationWalk, setInformationWalk] = useState('');
    const [informationPlane, setInformationPlane] = useState('');

    const [selectedFeature, setSelectedFeature] = useState(null);
    const [calloutCoordinates, setCalloutCoordinates] = useState(null);

    const [isVisible, setIsVisible] = useState(true)

    const getDirectFromAutoComplete = async () => {

        let autoComplete = await MapAPi.getPlacesAutocomplete({
            search: encodeURIComponent(txtFromDirect),
        });
        setDescriptionFromDirect(autoComplete.predictions);
    };

    const getDirectToAutoComplete = async () => {
        const inputSearch = txtToDirect;
        let autoComplete = await MapAPi.getPlacesAutocomplete({
            search: encodeURIComponent(inputSearch),
        });
        setDescriptionToDirect(autoComplete.predictions);
    };



    useEffect(() => {
        getDirections()
    }, [indexDirection])

    const getDirections = async (originText) => {

        const vehicleActive = ['car', 'bike', 'truck', 'taxi', 'hd'];
        const directions = [];

        for (const vehicle of vehicleActive) {
            const direction = await MapAPi.getDirections({
                vehicle: vehicle,
                origin: locations[0].coord,
                destination: originText,
            });

            directions.push(direction);
        }


        let steps = [];
        const routes = directions[indexDirection].routes
        routes.map(item => {
            item.legs.map(element => {
                steps.push(element.steps)
            })
        })

        let updatedCoordinates = [];

        steps.map((item) => {
            let listCoordinates = []
            item.map((ele) => {
                listCoordinates.push([ele.start_location.lng, ele.start_location.lat])
            })
            updatedCoordinates.push(listCoordinates)
        })

        const distance = [];

        directions[indexDirection].routes.map(item => {
            distance.push(item.legs[0]);
        })

        const featureCollections = [];

        const colors = ['#00b0ff', '#bbbdbf'];

        updatedCoordinates.forEach((coordinates, index) => {
            const color = colors[index];
            const marker = distance[index];
            const idCoordinates = `idCoordinates-${index}`
            const featureCollection = {
                features: [
                    {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "LineString",
                            coordinates: coordinates
                        },
                        pain: color,
                        marker: marker,
                        id: idCoordinates

                    }
                ]
            };

            featureCollections.push(featureCollection);
        });

        setRoute(featureCollections)
        if (distance[0].distance.value < 2000) {
            setZoomlevel(15)
        } else if (distance[0].distance.value < 5000) {
            setZoomlevel(14)
        } else if (distance[0].distance.value < 10000) {
            setZoomlevel(12)
        } else if (distance[0].distance.value < 15000) {
            setZoomlevel(11)
        } else if (distance[0].distance.value < 80000) {
            setZoomlevel(9)
        } else {
            setZoomlevel(6)
        }

        const indexCenter = Math.floor((updatedCoordinates[0].length - 1) / 2)

        setCoordinates(updatedCoordinates[0][indexCenter])

        directions[0].routes[0].legs.map(item => {
            setInformationCar(item.duration.text)
        })
        directions[1].routes[0].legs.map(item => {
            setInformationBike(item.duration.text)
        })
        directions[2].routes[0].legs.map(item => {
            setInformationTrain(item.duration.text)
        })
        directions[3].routes[0].legs.map(item => {
            setInformationWalk(item.duration.text)
        })
        directions[4].routes[0].legs.map(item => {
            setInformationPlane(item.duration.text)
        })

        setActiveInformation(true);

        const feature = event.nativeEvent.payload;
        setSelectedFeature(feature.properties);

        // Lấy tọa độ của đối tượng được nhấp vào
        const coordinates = feature.geometry.coordinates;
        setCalloutCoordinates(coordinates);
    };

    const camera = useRef(null);

    const handleOnPress = (event) => {
        const loc = event.geometry.coordinates;
        camera.current?.moveTo(loc, 200);
    };

    const _onBackPress = (navigation) => {
        navigation.goBack();
    };
    useEffect(() => {
        if (txtFromDirect !== '') {
            const delayedSearch = debounce(getDirectFromAutoComplete, 1000);
            delayedSearch();
            return () => {
                delayedSearch.cancel();
            };
        }
    }, [txtFromDirect])

    useEffect(() => {
        if (txtToDirect !== '') {
            const delayedSearch = debounce(getDirectToAutoComplete, 1000);
            delayedSearch();
            return () => {
                delayedSearch.cancel();
            };
        }
    }, [txtToDirect])

    const updateFromDirect = (text) => {
        setTxtFromDirect(text)
        setIshowFromDirect(true)
        setIshowToDirect(false)
    }

    const updateToDirect = (text) => {
        setTxtToDirect(text)
        setIshowToDirect(true)
        setIshowFromDirect(false)
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
                        parseFloat(geocoding.results[0].geometry.location.lng),
                        parseFloat(geocoding.results[0].geometry.location.lat),
                    ],
                },
            ]);
            setZoomlevel(10)
            setCoordinates([parseFloat(geocoding.results[0].geometry.location.lng),
            parseFloat(geocoding.results[0].geometry.location.lat)])
        }

    }

    const _handleSubmitDestinations = async (item) => {

        let geocoding = await MapAPi.getGeocoding({
            description: encodeURIComponent(item.item.description),
        });

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
                        parseFloat(geocoding.results[0].geometry.location.lng),
                        parseFloat(geocoding.results[0].geometry.location.lat),
                    ],
                },
            ]);

            setZoomlevel(10)
            setCoordinates([
                parseFloat(geocoding.results[0].geometry.location.lng),
                parseFloat(geocoding.results[0].geometry.location.lat)
            ])

            const originText = [
                parseFloat(geocoding.results[0].geometry.location.lng),
                parseFloat(geocoding.results[0].geometry.location.lat)
            ]
            handleSearch(originText)
        }

    }

    const _onpressCar = () => {
        setIndexDirection(0);
        setActiveCar(true);
        setActiveBike(false);
        setActiveTrain(false);
        setActiveWalk(false);
        setActivePlane(false)
    }
    const _onPressBike = () => {
        setIndexDirection(1);
        setActiveCar(false);
        setActiveBike(true);
        setActiveTrain(false);
        setActiveWalk(false);
        setActivePlane(false)
    }
    const _onPressTrain = () => {
        setIndexDirection(2);
        setActiveBike(false);
        setActiveCar(false);
        setActiveTrain(true);
        setActiveWalk(false);
        setActivePlane(false)
    }
    const _onPressWalk = () => {
        setIndexDirection(3);
        setActiveBike(false);
        setActiveCar(false);
        setActiveTrain(false);
        setActiveWalk(true);
        setActivePlane(false)
    }
    const _onPressPlane = () => {
        setIndexDirection(4);
        setActiveBike(false);
        setActiveCar(false);
        setActiveTrain(false);
        setActiveWalk(false);
        setActivePlane(true)
    }

    const geoJsonData = {
        type: 'FeatureCollection',
        features: [],
    };

    route.forEach((item) => {
        geoJsonData.features.push(...item.features);
    });

    const handleSearch = (originText) => {
        getDirections(originText);
        setIsShowMarker(true)
        setZoomlevel(16)
    };


    const renderItem = (item) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    ishowFromDirect ?
                        setTxtFromDirect(item.item.description) :
                        setTxtToDirect(item.item.description)
                    ishowFromDirect ?
                        setIshowFromDirect(false) :
                        setIshowToDirect(false)
                    ishowFromDirect ?
                        _handleSubmitOriginsDirect(item) :
                        _handleSubmitDestinations(item);
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

    const SCREEN_WIDTH = Dimensions.get('window').width
    const SCREEN_HEIGHT = Dimensions.get('window').height

    const modalHeight = SCREEN_HEIGHT + 100
    const snapPoint = [SCREEN_HEIGHT, SCREEN_HEIGHT - 140, SCREEN_HEIGHT / 2, 0]
    const startingPosition = snapPoint[0];
    const y = useSharedValue(startingPosition);
    const swipeDirection = useSharedValue('up') // up or down
    const swipeThreshold = 50

    useEffect(() => {
        if (activeInformation) {
            y.value = withTiming(snapPoint[1])
        }
    }, [activeInformation])

    const eventHandler = useAnimatedGestureHandler({
        onStart: (event, ctx) => {
            ctx.startY = y.value;
        },
        onActive: (event, ctx) => {
            y.value = ctx.startY + event.translationY;
        },
        onEnd: (event, ctx) => {
            if (y.value < ctx.startY) {
                swipeDirection.value = 'up'
            } else {
                swipeDirection.value = 'down'
            }

            /* cái ctx.startY là vị trí bắt đầu khi kéo
            có thể nó sẽ k chuẩn so với cái mốc snapPoint của mình nên sẽ tìm cái
            mốc snapPoint gần nhất với cái ctx.startY
            */
            const nearestSnapPoint = snapPoint.reduce(function (prev, curr) {
                return (Math.abs(curr - ctx.startY) < Math.abs(prev - ctx.startY) ? curr : prev);
            });
            // tìm xem nó đang ở snapPoint nào, mình đang có 4 mốc snapPoint
            const i = snapPoint.findIndex(v => v == nearestSnapPoint)
            /* nếu kéo lên thì mình sẽ check y hiện tại có bé hơn snapPoint
            1 đoạn bằng cái swipeThreshold không, nếu bé hơn sẽ chuyển sang mốc 
            snapPoint tiếp theo, không thì về lại vị trí cũ, cái donw tương tự
            */
            if (swipeDirection.value == 'up') {
                if (y.value < snapPoint[i] - swipeThreshold) {
                    y.value = withTiming(snapPoint[i + 1])
                    if (i == 1) {
                        runOnJS(setIsShowHeader)(false);
                    }
                }
                else {
                    y.value = withSpring(snapPoint[i]);
                }
            } else if (swipeDirection.value == 'down') {
                if (i != 1 && y.value > snapPoint[i] + swipeThreshold) {
                    y.value = withTiming(snapPoint[i - 1])
                    if (i == 2) {
                        runOnJS(setIsShowHeader)(true);
                    }
                }
                else {
                    y.value = withSpring(snapPoint[i]);
                }
            }
        },
    });

    const uas = useAnimatedStyle(() => {
        return {
            backgroundColor: '#FFF',
            transform: [{ translateY: y.value }],
            width: SCREEN_WIDTH,
            height: modalHeight,
            position: 'absolute',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16
        };
    });

    const renderModal = () => {
        return (
            <PanGestureHandler onGestureEvent={eventHandler}>
                <Animated.View style={[uas]} >
                    <View style={{
                        borderTopWidth: 2,
                        borderColor: '#ccc',
                        width: 72,
                        marginTop: 4,
                        marginHorizontal: SCREEN_WIDTH / 2 - 32,
                        alignItems: 'center'
                    }}></View>
                    <View>
                        <View style={{ marginHorizontal: 16, marginVertical: 16 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: 'orange', fontSize: 18, marginRight: 8, marginBottom: 6 }}>`${informationCar}`</Text>
                                <Text style={{ fontSize: 18 }}>(11 km)</Text>
                            </View>
                            <Text>Ở tình  trạng giao thông hiện tại thì đây là tuyến đường nhanh nhất</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: 'space-around', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{
                                    width: 120,
                                    height: 32,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#e8f0fe',
                                    borderWidth: 1,
                                    borderColor: '#8dabd9',
                                    borderRadius: 16,
                                    paddingHorizontal: 16
                                }}
                            // onPress={}
                            >
                                <Icon
                                    name="list-outline"
                                    type="ionicon"
                                    color={'#0E4E9B'}
                                    size={16}
                                />
                                <Text
                                    style={{
                                        marginHorizontal: 8,
                                        fontSize: 12,
                                        fontWeight: 'bold'
                                    }}
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                >Các chặng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: 120,
                                    height: 32,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#e8f0fe',
                                    borderWidth: 1,
                                    borderColor: '#8dabd9',
                                    borderRadius: 16,
                                    paddingHorizontal: 24
                                }}
                            // onPress={}
                            >
                                <Icon
                                    name="navigate-outline"
                                    type="ionicon"
                                    color={'#0E4E9B'}
                                    size={16}
                                />
                                <Text
                                    style={{
                                        marginHorizontal: 8,
                                        fontSize: 12,
                                        fontWeight: 'bold'
                                    }}
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                >Bắt đầu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: 120,
                                    height: 32,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#e8f0fe',
                                    borderWidth: 1,
                                    borderColor: '#8dabd9',
                                    borderRadius: 16,
                                    paddingHorizontal: 32
                                }}
                            // onPress={}
                            >
                                <Icon
                                    name="pin-outline"
                                    type="ionicon"
                                    color={'#0E4E9B'}
                                    size={16}
                                />
                                <Text
                                    style={{
                                        marginHorizontal: 8,
                                        fontSize: 12,
                                        fontWeight: 'bold'
                                    }}
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                >Ghim</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        )
    }

    return (
        <SafeAreaInsetsContext.Consumer>
            {insets => (
                <>
                    <GeneralStatusBar
                        backgroundColor={'transparent'}
                        barStyle="transparent"

                    />
                    {isShowHeader ?
                        <SafeAreaView
                            style={{
                                backgroundColor: "#0E4E9B",
                                paddingTop: 0,
                                paddingBottom: Platform.OS == 'ios' ? -48 : 0,
                            }}>
                        </SafeAreaView> : null
                    }

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
                            {locations.map((item, index) => {
                                const pointID = `pointID-${index}`
                                const pointKey = `pointKey-${index}`
                                return (
                                    <MapboxGL.PointAnnotation
                                        id={pointID}
                                        key={pointKey}
                                        coordinate={item.coord}
                                        draggable={true}>
                                        {
                                            index === 0 ?
                                                <View>
                                                    <Image
                                                        source={require('../assets/icon/start.png')}
                                                        style={styles.icondirect}
                                                        tintColor={'#0E4E9B'}
                                                    />
                                                </View> :
                                                <View>
                                                    <Image
                                                        source={require('../assets/icon/end.png')}
                                                        style={styles.icondirect}
                                                        tintColor={'red'}
                                                    />
                                                </View>
                                        }
                                        <MapboxGL.Callout title={item.key} />
                                    </MapboxGL.PointAnnotation>
                                )

                            })}
                            {geoJsonData.features.map((item, index) => {
                                const lineColor = `${item.pain}`
                                const layerId = `linelayer-${index}`
                                const lineID = `line-${index}`
                                return (
                                    <View>
                                        <MapboxGL.ShapeSource
                                            id={lineID}
                                            shape={item}
                                            clusterRadius={8}
                                            cluster={true}
                                        >
                                            <MapboxGL.LineLayer
                                                id={layerId}
                                                key={layerId}
                                                style={{
                                                    lineColor: lineColor,
                                                    lineWidth: 7
                                                }}
                                            />

                                        </MapboxGL.ShapeSource>
                                    </View>
                                );
                            })}
                            {
                                isShowMarker ?
                                    <MapboxGL.MarkerView
                                        id={"marker"}
                                        coordinate={coordinates}
                                    >
                                        {geoJsonData.features.map((item, index) => {
                                            return (
                                                <View style={styles.markerContainer}>
                                                    <MapboxGL.Callout
                                                        id={item.idCoordinates}
                                                        style={{
                                                            width: 64,
                                                            height: 40,
                                                            backgroundColor: index === 0 ? '#174ea6' : '#fff',
                                                            borderRadius: 10,
                                                            zIndex: 10
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                flex: 1,
                                                                justifyContent: 'center',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <Text style={{ color: index === 0 ? '#fff' : "#bbbdbf", fontSize: 12 }}>
                                                                {`${item.marker.distance.text}`}
                                                            </Text>
                                                        </View>
                                                        <View style={[styles.tip, {
                                                            borderTopColor: index === 0 ? '#174ea6' : "#bbbdbf",
                                                            position: 'absolute',
                                                            top: 40,
                                                            backgroundColor: '#fff',
                                                            borderWidth: 0,
                                                            borderColor: 'transparent',
                                                        }]} />
                                                    </MapboxGL.Callout>
                                                </View>
                                            )
                                        })}
                                    </MapboxGL.MarkerView>
                                    : null
                            }

                        </MapboxGL.MapView>
                        {isShowHeader ?
                            <View style={styles.containerInput}>
                                <View style={{ flexDirection: 'row', backgroundColor: '#FFF', width: windowWidth }}>
                                    <TouchableOpacity
                                        style={{ marginVertical: 8 }}
                                        onPress={() => {
                                            _onBackPress(navigation);
                                        }}>
                                        <Icon
                                            name="chevron-back-outline"
                                            type="ionicon"
                                            color={'black'}
                                            size={32}
                                        />
                                    </TouchableOpacity>
                                    <View >
                                        <View style={styles.locationDirect}>
                                            <Icon
                                                name="ellipse-outline"
                                                type="ionicon"
                                                color={'black'}
                                                size={16}
                                            />
                                            <SearchBar
                                                placeholder={'Nhập đia điểm đi'}
                                                onChangeText={updateFromDirect}
                                                lightTheme={true}
                                                value={txtFromDirect}
                                                inputContainerStyle={styles.searchInputContainer}
                                                inputStyle={styles.textSearchInput}
                                                containerStyle={styles.searchContainerDirect}
                                            />
                                            <TouchableOpacity
                                                // onPress={() => handleSearch()}
                                                style={{ marginHorizontal: 8 }}
                                            >
                                                <Icon
                                                    name="ellipsis-horizontal-outline"
                                                    type="ionicon"
                                                    color={'black'}
                                                    size={16}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.locationDirect, { marginVertical: 2 }]}>
                                            <Icon
                                                name="ellipsis-vertical-outline"
                                                type="ionicon"
                                                color={'black'}
                                                size={16}
                                            />
                                            <View></View>
                                        </View>
                                        <View style={[styles.locationDirect, { marginBottom: 8 }]}>
                                            <Icon
                                                name="location-outline"
                                                type="ionicon"
                                                color={'red'}
                                                size={16}
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
                                            <TouchableOpacity
                                                // onPress={() => handleSearch()}
                                                style={{ marginHorizontal: 8 }}
                                            >
                                                <Icon
                                                    name="swap-vertical-outline"
                                                    type="ionicon"
                                                    color={'black'}
                                                    size={20}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ backgroundColor: '#fff' }}>
                                    <ScrollView horizontal={true} style={{ flexDirection: 'row', marginHorizontal: 8, marginVertical: 4 }}>
                                        <TouchableOpacity
                                            style={activeCar ?
                                                {
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: '#e8f0fe',
                                                    width: 80,
                                                    height: 32,
                                                    borderRadius: 16,
                                                    borderWidth: 1,
                                                    borderColor: '#8dabd9',
                                                    paddingHorizontal: activeInformation ? 8 : 32
                                                }
                                                :
                                                {
                                                    width: 80,
                                                    height: 32,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}
                                            onPress={() => _onpressCar()}
                                        >
                                            <Icon
                                                name="car-sport-outline"
                                                type="ionicon"
                                                color={'#0E4E9B'}
                                                size={16}
                                            />
                                            <Text
                                                style={{
                                                    marginHorizontal: 8,
                                                    fontSize: 12,
                                                    fontWeight: 'bold'
                                                }}
                                                ellipsizeMode={'tail'}
                                                numberOfLines={1}  >
                                                {`${informationCar}`}
                                            </Text>
                                        </TouchableOpacity>
                                        <View style={{ marginHorizontal: activeInformation ? 8 : 16 }}></View>
                                        <TouchableOpacity
                                            style={activeBike ?
                                                {
                                                    width: 80,
                                                    height: 32,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: '#e8f0fe',
                                                    borderWidth: 1,
                                                    borderColor: '#8dabd9',
                                                    borderRadius: 16,
                                                    paddingHorizontal: activeInformation ? 8 : 32
                                                }
                                                :
                                                {
                                                    width: 80,
                                                    height: 32,
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}
                                            onPress={() => _onPressBike()}
                                        >
                                            <Icon
                                                name="bicycle-outline"
                                                type="ionicon"
                                                color={'#0E4E9B'}
                                                size={16}
                                            />
                                            <Text
                                                style={{
                                                    marginHorizontal: 8,
                                                    fontSize: 12,
                                                    fontWeight: 'bold'
                                                }}
                                                ellipsizeMode={'tail'}
                                                numberOfLines={1}
                                            >{`${informationBike}`}</Text>
                                        </TouchableOpacity>
                                        <View style={{ marginHorizontal: activeInformation ? 8 : 16 }}></View>
                                        <TouchableOpacity
                                            style={activeTrain ?
                                                {
                                                    width: 80,
                                                    height: 32,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: '#e8f0fe',
                                                    borderWidth: 1,
                                                    borderColor: '#8dabd9',
                                                    borderRadius: 16,
                                                    paddingHorizontal: activeInformation ? 8 : 32
                                                }
                                                :
                                                {
                                                    width: 80,
                                                    height: 32,
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}
                                            onPress={() => _onPressTrain()}
                                        >
                                            <Icon
                                                name="train-outline"
                                                type="ionicon"
                                                color={'#0E4E9B'}
                                                size={16}
                                            />
                                            <Text
                                                style={{
                                                    marginHorizontal: 8,
                                                    fontSize: 12,
                                                    fontWeight: 'bold'
                                                }}
                                                numberOfLines={1}
                                                ellipsizeMode={'tail'}
                                            >{`${informationTrain}`}</Text>
                                        </TouchableOpacity>
                                        <View style={{ marginHorizontal: activeInformation ? 8 : 16 }}></View>
                                        <TouchableOpacity
                                            style={activeWalk ?
                                                {
                                                    width: 80,
                                                    height: 32,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: '#e8f0fe',
                                                    borderWidth: 1,
                                                    borderColor: '#8dabd9',
                                                    borderRadius: 16,
                                                    paddingHorizontal: activeInformation ? 8 : 32
                                                }
                                                :
                                                {
                                                    width: 80,
                                                    height: 32,
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}
                                            onPress={() => _onPressWalk()}
                                        >
                                            <Icon
                                                name="walk-outline"
                                                type="ionicon"
                                                color={'#0E4E9B'}
                                                size={16}
                                            />
                                            <Text
                                                style={{
                                                    marginHorizontal: 8,
                                                    fontSize: 12,
                                                    fontWeight: 'bold'
                                                }}
                                                numberOfLines={1}
                                                ellipsizeMode={'tail'}
                                            >{`${informationWalk}`}</Text>
                                        </TouchableOpacity>
                                        <View style={{ marginHorizontal: activeInformation ? 8 : 16 }}></View>
                                        <TouchableOpacity
                                            style={activePlane ?
                                                {
                                                    width: 80,
                                                    height: 32,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    backgroundColor: '#e8f0fe',
                                                    borderWidth: 1,
                                                    borderColor: '#8dabd9',
                                                    borderRadius: 16,
                                                    paddingHorizontal: activeInformation ? 8 : 32
                                                }
                                                :
                                                {
                                                    width: 80,
                                                    height: 32,
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}
                                            onPress={() => _onPressPlane()}
                                        >
                                            <Icon
                                                name="airplane-outline"
                                                type="ionicon"
                                                color={'#0E4E9B'}
                                                size={16}
                                            />
                                            <Text
                                                style={{
                                                    marginHorizontal: 8,
                                                    fontSize: 12,
                                                    fontWeight: 'bold'
                                                }}
                                                numberOfLines={1}
                                                ellipsizeMode={'tail'}
                                            >{`${informationPlane}`}</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </View>
                            : null}
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

                        {renderModal()}
                    </View>
                </>
            )
            }
        </SafeAreaInsetsContext.Consumer >
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
    searchInputContainer: {
        backgroundColor: '#FFFF',
        borderColor: '#FFFF',
        marginLeft: 0,
        marginRight: 0
    },
    textSearchInput: {
        fontSize: 12,
    },
    searchContainerDirect: {
        width: 280,
        marginHorizontal: 8,
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 1,
        paddingRight: 1
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
        flexDirection: 'row',
        alignItems: "center",
        width: 80,
        height: 60,
        marginRight: 50,
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
    tip: {
        width: 0,
        height: 0,
        backgroundColor: '#fff',
        borderStyle: 'solid',
        borderTopWidth: 10,
        borderRightWidth: 5,
        borderBottomWidth: 0,
        borderLeftWidth: 5,
        alignSelf: 'center',
    },

});

export default DistanceMatrixScreen;
