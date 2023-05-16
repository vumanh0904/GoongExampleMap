import authorizedRequest from '../../services/api-service/authorizedRequest';
import * as APICONST from './constant';
import API_LIST from './mapData';
const PREFIX = APICONST.DEFAULT_PREFIX;

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
}

export default new MapApi();
