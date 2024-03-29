import React from 'react';
import { StyleSheet, View,TouchableOpacity , Image,Text } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { }
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const carLogo=require("../assets/images/carSmall.png");

export default class WipiMap extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            isMapReady: false,
            location:{
                coords:{
                    latitude:31.046051,
                    longitude:34.851612
                }
            },
            address:""
        }
    }

    _getLocationAsync = async () => {
        let {status}  = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            console.log("errorMessage: 'Permission to access location was denied'");
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState({location:location,isMapReady: this.state.isMapReady});
    };


    componentWillMount(){
        this._getLocationAsync()
    }

    onMapLayout = () => {
        this.setState({ isMapReady: true });
    }

    render(){

    return(
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder='Search adrress'
                minLength={2} // minimum length of text to search
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                listViewDisplayed='true'    // true/false/undefined
                fetchDetails={true}
                renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                }}

                getDefaultValue={() => ''}

                query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: 'AIzaSyBKJ88od7dHfemmN5hcCxRpGGABybq_h2k',
                    language: 'en', // language of the results
                    types: [ "locality", "political", "geocode" ] // default: 'geocode'
                }}

                styles={stylesGAC}

               // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
               // currentLocationLabel="Current location"
                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }}
                GooglePlacesSearchQuery={{
                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    rankby: 'distance',
                    types: 'food'
                }}

                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                // predefinedPlaces={[homePlace, workPlace]}

                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            />
            <MapView
                provider="google"
                style={styles.map}
                showsUserLocation= {true}
                showsMyLocationButton = {false}
                followsUserLocation= {true}
                onLayout={this.onMapLayout}
                mapType={"terrain"}
                region={{
                    latitude:  this.state.location.coords.latitude,
                    longitude: this.state.location.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                }}>
                {this.state.isMapReady &&
                <MapView.Marker
                    coordinate={{
                        latitude: this.state.location.coords.latitude,
                        longitude: this.state.location.coords.longitude,
                    }}
                    image={carLogo}
                >
                </MapView.Marker>
                }
            </MapView>
        </View>
    );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop:25,
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'transparent'
    },
    map:{
        flex: 1,
    },
});

const stylesGAC = StyleSheet.create({
    container:{
        flex:1,
        paddingTop: Constants.statusBarHeight,
        height,
        width
    },
    textInput: {
        height: 30,
        color: '#5d5d5d',
        fontSize: 16,
        paddingBottom:0,
        marginBottom:18,
        top:2,
        textAlign:'right',
        elevation:0,
        zIndex:0
    },
    listView:{
        position:'absolute',
        top:Constants.statusBarHeight+38,
        zIndex:11,
        elevation:11,
        backgroundColor:"white"
    },
    textInputContainer: {
        position: 'absolute',
        backgroundColor: '#ffffff',
        height: 38,
        width:width-20,
        margin:10,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        elevation: 3,
        zIndex:3,
        justifyContent:"center",
        alignItems: 'center',
    },
    description: {
        paddingRight: 10,
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
    },
    description2: {
        paddingRight: 10,
        fontSize: 13,
        color: '#5d5d5d'
    },
  
    separator: {
        height: 1
    },
    row: {
        height: 52,
        padding: 5
    }
});
