import authorizedRequest from '../../services/api-service/authorizedRequest';
import * as APICONST from './constant';
import API_LIST from './mapData';
const PREFIX = APICONST.DEFAULT_PREFIX;
const URL =APICONST.DEFAULT_URL;

class MapApi {
  getFindText = body => {
    return authorizedRequest.get(
        API_LIST.Find_Place_from_text +
        PREFIX+'&input='+body,
    );
  };
  
  getPlacesAutocomplete = body => {
    return authorizedRequest.get(        
        API_LIST.PlacesAutocomplete +
        PREFIX+'&input='+body.search,
    );
  };
  getGeocoding = body => {
    return authorizedRequest.get(        
        API_LIST.Geocoding + body.description +'&api_key='+
        PREFIX,
    );
  };
  getPlaceDetail = body => {
    return authorizedRequest.get(        
        API_LIST.PlaceDetail + body.place_id +'&api_key='+
        PREFIX,
    );
  };
  getDirections = body => {
    console.log('434343434',URL+API_LIST.Directions +PREFIX +'&origin='+body.origin[1]+','+body.origin[0]+'&destination='+body.destination[1]+','+body.destination[0])
    return authorizedRequest.get(        
      URL+API_LIST.Directions +PREFIX +'&origin='+body.origin[1]+','+body.origin[0]+'&destination='+body.destination[1]+','+body.destination[0]
        ,
    );
  };
}

export default new MapApi();
