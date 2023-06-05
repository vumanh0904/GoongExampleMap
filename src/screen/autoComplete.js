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
    FlatList,
    Keyboard,
} from 'react-native';
import {
    SafeAreaInsetsContext,
    SafeAreaView,
} from 'react-native-safe-area-context';
import GeneralStatusBar from '../config/generalStatusBar/GeneralStatusBar';
import { SearchBar, Icon } from '@rneui/themed';
import MapboxGL from '@rnmapbox/maps';
import MapAPi from '../core/api/MapAPI';

MapboxGL.setConnected(true);
MapboxGL.setAccessToken("<YOUR_ACCESSTOKEN>");

const windowWidth = Dimensions.get('window').width;

const AutoCompleteScreen = ({ navigation }) => {
    const [loadMap, setLoadMap] = useState(
        'https://tiles.goong.io/assets/goong_map_web.json?api_key=api_key',
    );
    const [coordinates] = useState([105.83991, 21.028]);

    const [search, setSearch] = useState('');
    const [isShowLocation, setIsShowLocation] = useState(true)
    const [zoomLevel, setZoomlevel] = useState(4);

    const [description, setDescription] = useState([]);
    const [locations, setLocations] = useState([]);

    const getPlacesAutocomplete = async () => {
        let autoComplete = await MapAPi.getPlacesAutocomplete({
            search: encodeURIComponent(search),
        });
        setDescription(autoComplete.predictions);
    };


    const camera = useRef(null);

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
                    <Text>
                        {item.item.description}
                    </Text>
                    <View></View>
                </View>
            </TouchableOpacity>
        );
    };

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
                        {renderHeader()}
                    </SafeAreaView>

                    <View style={{ flex: 1 }} >
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
                                    />

                                </View>
                            </View>
                            {
                                isShowLocation ?
                                    <View style={{ position: 'absolute', top: 64, left: 0, width: windowWidth, backgroundColor: '#FFFF' }}>
                                        <FlatList
                                            data={description}
                                            renderItem={renderItem}
                                        />
                                    </View>
                                    : null
                            }

                        </View>
                    </View>
                </>
            )}
        </SafeAreaInsetsContext.Consumer >
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
        width: windowWidth,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        backgroundColor: '#FFFF',
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
        fontSize: 10,
    },
    searchContainer: {
        padding: 0,
        backgroundColor: '#FFFF',
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
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems:'center',
        // paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        marginHorizontal: 8,
        alignItems: 'center'
    },
});

export default AutoCompleteScreen;
