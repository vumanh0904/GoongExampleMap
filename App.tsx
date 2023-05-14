/**
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
} from 'react-native';
import MapboxGL, {MapView, Camera, PointAnnotation} from '@rnmapbox/maps';

MapboxGL.setConnected(true);
MapboxGL.setAccessToken(
  'sk.eyJ1IjoibG9uZ25naGllbSIsImEiOiJjbGhhZHg1NTgwZGlsM2RvMm12cDZ2cGh2In0.JVjOoASg0qcDcXv5wD09dw',
);

const windowWidth = Dimensions.get('window').width;

function App() {
  const [loadMap, setLoadMap] = useState(
    'https://tiles.goong.io/assets/goong_map_web.json?api_key=YRBODwPBdSEYJQuV1BPYOQIIrtcyzP7z4fkkcsJT',
  );
  const [coordinates] = useState([105.83991, 21.028]);
  const [txtLng, setTextLng] = useState('');
  const [txtlat, setTextLat] = useState('');
  const [locations, setLocations] = useState([
    {
      key: '1',
      coord: [107.58472, 16.46278],
    },
    {
      key: '2',
      coord: [108.03889, 12.66667],
    },
    {
      key: '3',
      coord: [105.83991, 21.028],
    },
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

  console.log('33333333', locations);

  const camera = useRef<Camera>(null);
  const handleOnPress = (event: any) => {
    const loc = event.geometry.coordinates;
    camera.current?.moveTo(loc, 200);
  };
  const handleEditMarker = () => {};

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
            key="pointDirect"
            coordinate={item.coord}
            draggable={true}>
            <MapboxGL.Callout title={item.key} />
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
      <View style={styles.containerInput}>
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
            style={[styles.btnHandleMarker,styles.btnHandleAddMarker]}
            onPress={handleAddMarker}>
            <Text style={{marginVertical: 8}}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnHandleMarker,styles.btnHandleEditMarker]}
            onPress={handleEditMarker}>
            <Text style={{marginVertical: 8}}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnHandleMarker,styles.btnHandleDeleteMarker]}
            onPress={handleEditMarker}>
            <Text style={{marginVertical: 8}}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: windowWidth,
    height: 72,
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
  btnHandleAddMarker:{
    backgroundColor: '#0E4E9B',
    borderColor: '#0E4E9B',
  },
  btnHandleEditMarker:{
    backgroundColor: '#78D3FF',
    borderColor: '#78D3FF',
  },
  btnHandleDeleteMarker:{
    backgroundColor: 'red',
    borderColor: 'red',
  }  
});

export default App;
