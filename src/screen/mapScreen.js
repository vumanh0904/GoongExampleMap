8/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useRef, useEffect} from 'react';

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
import {SearchBar, Icon} from '@rneui/themed';
import MapboxGL from '@rnmapbox/maps';
import MapAPi from '../core/api/MapAPI';

MapboxGL.setConnected(true);
MapboxGL.setAccessToken(
  'sk.eyJ1IjoibG9uZ25naGllbSIsImEiOiJjbGhhZHg1NTgwZGlsM2RvMm12cDZ2cGh2In0.JVjOoASg0qcDcXv5wD09dw',
);

const windowWidth = Dimensions.get('window').width;

const MapScreen = () => {
  const [loadMap, setLoadMap] = useState(
    'https://tiles.goong.io/assets/goong_map_web.json?api_key=YRBODwPBdSEYJQuV1BPYOQIIrtcyzP7z4fkkcsJT',
  );
  const [coordinates] = useState([105.83991, 21.028]);
  const [txtLng, setTextLng] = useState('');
  const [txtlat, setTextLat] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [locationLat, setLocationLat] = useState('');
  const [locationLng, setLocationLng] = useState('');
  const [description, setDescription] = useState([]);
  const [locations, setLocations] = useState([
    {
      key: '1',
      coord: [107.58472, 16.46278],
    },
    // {
    //   key: '2',
    //   coord: [108.277199, 14.058324],
    // },
    // {
    //   key: '3',r
    //   coord: [105.83991, 21.028],
    // },
  ]);
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
    console.log('111111', searchText);
    setLocationLat(searchText.candidates[0].geometry.location.lat);
    setLocationLng(searchText.candidates[0].geometry.location.lng);
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
  };
  const getPlacesAutocomplete = async () => {
    let autoComplete = await MapAPi.getPlacesAutocomplete({
      // lat: encodeURIComponent(locationLat),
      // lng: encodeURIComponent(locationLng),
      search: encodeURIComponent(search),
    });
    setDescription(autoComplete.predictions);   
  };

  console.log('33333333', locations);

  const camera = useRef(null);

  const handleOnPress = (event: any) => {
    const loc = event.geometry.coordinates;
    camera.current?.moveTo(loc, 200);
  };
  const handleEditMarker = () => {};

  const handleDeleteMarker = () => {};

  const onCloseModel = () => {
    setIsVisible(false);
  };

  const _onBackPress = (navigation: any) => {
    navigation.goBack();
  };

  const updateSearch = (search: any) => {
    setSearch(search);
    getPlacesAutocomplete();
  };
  const _handleSubmit =async(item :any)=>{
      let geocoding = await MapAPi.getGeocoding({
        description: encodeURIComponent(item.item.description),
      });      
      if(geocoding.status === 'OK'){

        setLocations(a => [
          ...a,
          {
            key: (locations.length + 1).toString(),
            coord: [
              parseFloat(geocoding.results[0].geometry.location.lng),
              parseFloat(geocoding.results[0].geometry.location.lat),
            ],
          },
        ]);
      }
    
  }


  const renderItem = (item:any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          _handleSubmit(item);         
        }}
        >
        <View style={styles.itemSelect}>
          <Text>
            {item.item.description} 
          </Text>          
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <MapboxGL.MapView
        styleURL={loadMap}
        onPress={handleOnPress}
        style={{flex: 1}}
        projection="globe"
        zoomEnabled={true}>
        <MapboxGL.Camera
          ref={camera}
          zoomLevel={4}
          centerCoordinate={coordinates}
        />
        {/* 1 point  */}
        {/* <MapboxGL.PointAnnotation 
        id='pointDirect'
        key='pointDirect'
        coordinate={coordinates}
        draggable={true}
         /> */}

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
          <TouchableOpacity
            style={[styles.btnHandleMarker, styles.btnHandleSearch]}
            onPress={() => getFIndText()}>
            <Text style={{marginVertical: 8}}>Tìm</Text>
          </TouchableOpacity>
        </View>
        <View style ={{backgroundColor:'#E0E0E0'}}>
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
            <Text style={{marginVertical: 8}}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnHandleMarker, styles.btnHandleEditMarker]}
            onPress={handleEditMarker}>
            <Text style={{marginVertical: 8}}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnHandleMarker, styles.btnHandleDeleteMarker]}
            onPress={handleDeleteMarker}>
            <Text style={{marginVertical: 8}}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* {visible ? LocationModel():null} */}
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
    height: 140,
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
  searchInputContainer: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
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
    color: '#FFFFF',
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

export default MapScreen;
