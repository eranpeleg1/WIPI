import React, { Component } from 'react';
import { Text, View, StyleSheet,Dimensions,TouchableOpacity } from 'react-native';
import { Constants, MapView, Location, Permissions } from 'expo';
import SubView from "../components/SubView"
let {height,width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class HomeScreen extends Component {
    state = {
        mapRegion: null,
        hasLocationPermissions: false,
        location: null,
        parkingMode:false,
        address: null
    };

    async componentDidMount() {
        let {location,mapRegion,address,hasLocationPermissions} = await this._getLocationAsync();
        this.setState({location,address,mapRegion,hasLocationPermissions});
    }

    park(){
        console.log("park");
        fetch("https://us-central1-wipi-cee66.cloudfunctions.net/markUserParking", {
            method: 'POST',
            body: JSON.stringify({
                userId: "noam",
                latitude: 55,
                longitude: 55
            })
        })
            .then(response => {
                console.log(response)
                this.setState({parkingMode:true})
            })
    }
    endPark=()=>{
        this.setState({parkingMode:false})
    }


    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        let hasLocationPermissions =  (status === 'granted');
        let mapRegion,location,address;
        if (hasLocationPermissions) {
            location = await Location.getCurrentPositionAsync({});
            let tempAddress = await Location.reverseGeocodeAsync(location.coords);
            tempAddress=tempAddress[0];
            address={
                structured_formatting:{
                    main_text:tempAddress.street+" "+tempAddress.name,
                    secondary_text:tempAddress.city+", "+tempAddress.country
                }
            }
            mapRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            }
        }
        return {location,address,mapRegion,hasLocationPermissions};
    };

    myPlace = async () => {
        let {location,address,hasLocationPermissions} = await this._getLocationAsync();
        this.map.animateToRegion(
            {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            }
        );

        setTimeout(()=>this.setState({location,address,hasLocationPermissions}),501);
    }


    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.location === null ?
                        <Text>Finding your current location...</Text> :
                        this.state.hasLocationPermissions === false ?
                            <Text>Location permissions are not granted.</Text> :
                            this.state.mapRegion === null ?
                                <Text>Map region doesn't exist.</Text> :
                                    <MapView
                                        ref={map => this.map = map}
                                        provider="google"
                                        customMapStyle={mapStyle}
                                        style={{ alignSelf: 'stretch', height: height}}
                                        region={this.state.mapRegion}
                                        showsUserLocation= {true}
                                        showsMyLocationButton = {false}
                                        followsUserLocation= {true}
                                    />

                }
                <SubView showValue={300}
                         hideValue={50}
                         show={this.state.parkingMode}
                         endPark={this.endPark}
                         height={300}
                         backgroundColor={'#3B9BFF'}
                         address={this.state.address}
                />
                <View style={styles.buttons}>
                    <View style={styles.mapButtonContainer}>
                        <TouchableOpacity
                            style={[styles.mapButton,styles.locationButton]}
                            onPress={this.myPlace}
                            activeOpacity={0.8}
                        >
                            <Icon
                                name="my-location"
                                backgroundColor='white'
                                size={24}
                                color='black'
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.mapButtonContainer}>
                        <TouchableOpacity
                            style={[styles.mapButton,styles.parkButton]}
                            onPress={ () => this.park() }
                            activeOpacity={0.8}
                        >
                            <Text style={{fontWeight: 'bold', color: 'white', fontSize:30}}>
                                P
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
    },
    buttons:{
        position: 'absolute',
        bottom: '17%',
        right:13
    },
    mapButtonContainer:{
        height:58,
        width:58,
        elevation:4,
        backgroundColor: 'transparent',
        justifyContent:'center',
        alignItems: 'center',
        paddingTop:1,
        margin:7
    },
    mapButton: {
        borderWidth: 0,
        height: 56,
        width: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000000",
        shadowOpacity: 0.7,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        },
        bottom:1,
        elevation:2,
        zIndex:3
    },
    parkButton:{
        backgroundColor:'#3B9BFF'
    },

    locationButton:{
        backgroundColor:'white',
    },
});

const mapStyle = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c9bff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#C0ECAD"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#3c9bff"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    }
];