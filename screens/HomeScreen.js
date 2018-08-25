import React, { Component } from 'react';
import { Text, View, StyleSheet,Dimensions } from 'react-native';
import { Constants, MapView, Location, Permissions } from 'expo';
import SubView from "../components/SubView"
let {height,width} = Dimensions.get('window');
export default class HomeScreen extends Component {
    state = {
        mapRegion: null,
        hasLocationPermissions: false,
        location: null,
        parkingMode:false,
        address: null
    };

    componentDidMount() {
        this._getLocationAsync();
    }
    endPark=()=>{
        this.setState({parkingMode:false})
    }


    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                location: 'Permission to access location was denied',
            });
        } else {
            this.setState({ hasLocationPermissions: true });
        }

        let location = await Location.getCurrentPositionAsync({});
        let tempAddress = await Location.reverseGeocodeAsync(location.coords);
        tempAddress=tempAddress[0];
        let address={
            structured_formatting:{
                main_text:tempAddress.street+" "+tempAddress.name,
                secondary_text:tempAddress.city+", "+tempAddress.country
            }
        }
        this.setState({location,address});

        // Center the map on the location we just fetched.
        this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.001, longitudeDelta: 0.001 }});
    };

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