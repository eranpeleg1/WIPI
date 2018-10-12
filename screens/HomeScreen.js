import React, {Component} from 'react';
import {Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput, PixelRatio} from 'react-native';
import {Constants, MapView, Location, Permissions, AppLoading} from 'expo';
import SubView from "../components/SubView"
import GoogleAutoComplete from '../components/GoogleAutocomplete';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';


import {registerForPushNotificationsAsync} from '../utills/pushNotificationService'
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";

let {height, width} = Dimensions.get('window');


export default class HomeScreen extends Component {
    static navigationOptions = {
        header: null,
        headerVisible: false,
        headerMode: 'none',
    };

    state = {
        mapRegion: null,
        hasLocationPermissions: false,
        location: null,
        parkingMode: false,
        address: null,
        loggedInUserId: this.props.navigation.state.params.userId,
        mode: 'findLocation'
    };

    _bootstrapAsync = async () => {
        await registerForPushNotificationsAsync(this.state.loggedInUserId)
        if (this.state.address === null) {
            let {location, mapRegion, address, hasLocationPermissions} = await this._getLocationAsync();
            const mode = location ? 'default': 'findLocation'
            this.setState({location, address, mapRegion, hasLocationPermissions, mode});
        }
        return Promise.resolve()
    }

    _handleLoadingError = error => {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.log(error);
    };
    _handleFinishLoading = msg => {
        console.log(msg);
    };

    park() {
        console.log('user id is (from park) ', this.props.navigation.getParam('userId'));
        fetch("https://us-central1-wipi-cee66.cloudfunctions.net/markUserParking", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": this.state.loggedInUserId,
                "latitude": this.state.location.coords.latitude,
                "longitude": this.state.location.coords.longitude
            })
        }).then(response => {
            // console.log(response);
            this.setState({parkingMode: true})
        })
    }


    endPark = () => {
        fetch("https://us-central1-wipi-cee66.cloudfunctions.net/unmarkUserParking", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": this.state.loggedInUserId
            })
        }).then(response => {
            // console.log(response);
            this.setState({parkingMode: false})
        })
    }



    _getLocationAsync = async () => {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        let hasLocationPermissions = (status === 'granted');
        let mapRegion, location, address;
        if (hasLocationPermissions) {
            location = await Location.getCurrentPositionAsync({});
            let tempAddress = await Location.reverseGeocodeAsync(location.coords)
            console.log("address: "+ JSON.stringify(tempAddress))
            tempAddress = tempAddress[0];
            const street = tempAddress.street === null ? "":tempAddress.street
            const name = tempAddress.name === null ? "":tempAddress.name
            address = {
                structured_formatting: {
                    main_text: street + " " + name,
                    secondary_text: tempAddress.city + ", " + tempAddress.country
                }
            }
            mapRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            }
        }
        return {location, address, mapRegion, hasLocationPermissions};
    }


    myPlace = async () => {
        let {location, address, hasLocationPermissions} = await this._getLocationAsync();
        const mapRegion={
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
        }
        this.map.animateToRegion(mapRegion);

        setTimeout(() => this.setState({location, address, hasLocationPermissions,mapRegion}), 501);
    }

    setAddress = async (address) => {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        let hasLocationPermissions = (status === 'granted');
        let location = await Location.geocodeAsync(address.description);
        console.log("address", location);
        const mapRegion = {
            latitude: location[0].latitude,
            longitude: location[0].longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
        }

        this.setState({mapRegion, address, mode: 'default', location:{coords:location[0]}, hasLocationPermissions})
    }

    switchToReport = () => this.props.navigation.navigate('Reports', {userId:this.props.navigation.state.params.userId})

    render() {
        let res;
        console.log(this.state.mode);
        switch (this.state.mode) {
            case 'findLocation':
                res = (
                    <AppLoading
                        startAsync={this._bootstrapAsync}
                        onError={this._handleLoadingError}
                        onFinish={this._handleFinishLoading}
                    />
                )
                break
            case 'default':
                res =
                    (<View style={styles.container}>
                            {
                                this.state.location === null
                                    ?
                                    <Text>Finding your current location...</Text> :
                                    this.state.hasLocationPermissions === false ?
                                        <Text>Map region doesn't exist.</Text>
                                        :
                                        <MapView
                                            ref={map => this.map = map}
                                            provider="google"
                                            customMapStyle={mapStyle}
                                            style={{alignSelf: 'stretch', height: height, zIndex: 0}}
                                            region={this.state.mapRegion}
                                            showsUserLocation={true}
                                            showsMyLocationButton={false}
                                            followsUserLocation={true}
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
                            <View style={styles.textInputContainer}

                            >
                                <TextInput style={styles.textInput}
                                           placeholder='Search here'
                                           onFocus={() => this.setState({mode: 'AutoComplete'})}
                                />
                            </View>
                            <View style={styles.buttons}>
                                <View style={styles.mapButtonContainer}>
                                    <TouchableOpacity
                                        style={[styles.mapButton, styles.locationButton]}
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
                                        style={[styles.mapButton, styles.parkButton]}
                                        onPress={() => this.park()}
                                        activeOpacity={0.8}
                                    >
                                        <Icon
                                            name="local-parking"
                                            backgroundColor='white'
                                            size={24}
                                            color='white'
                                        />
                                    </TouchableOpacity>
                                </View>
                                </View>
                            <View style={styles.reportWrapper}>
                                <TouchableOpacity
                                    style={[styles.mapButton, styles.reportButton]}
                                    onPress={this.switchToReport}
                                    activeOpacity={0.8}
                                >
                                    <IconCommunity
                                        name="flag"
                                        backgroundColor='white'
                                        size={24}
                                        color='white'
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                break
            case 'AutoComplete':
                res = (<View style={styles.container}>
                        <GoogleAutoComplete setAddressOfHome={this.setAddress}
                                            returnToMap={() => this.setState({mode: 'default'})}/>
                    </View>
                )
        }
        return res
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
    buttons: {
        position: 'absolute',
        bottom: '17%',
        right: 13
    },
    reportWrapper: {
        position: 'absolute',
        bottom: '17%',
        left: 13
    },
    mapButtonContainer: {
        height: 58,
        width: 58,
        elevation: 4,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 1,
        margin: 7
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
        bottom: 1,
        elevation: 2,
        zIndex: 3
    },
    reportButton: {
        backgroundColor: '#FF6E69',
    },
    parkButton: {
        backgroundColor: '#3B9BFF'
    },

    locationButton: {
        backgroundColor: 'white',
    },
    textInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        paddingTop: 4.5,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 7.5,
        marginLeft: 8,
        marginRight: 8,
        height: 40,
        color: '#5d5d5d',
        fontSize: 16,
        paddingBottom: 15,
        margin: 0,
        bottom: 1,
        textAlign: 'right'
    },
    textInputContainer: {
        position: 'absolute',
        borderTopColor: '#7e7e7e',
        borderBottomColor: '#b5b5b5',
        borderTopWidth: 1 / PixelRatio.get(),
        top: Constants.statusBarHeight,
        width: width - 20,
        height: 38,
        zIndex: 3,
        backgroundColor: '#ffffff',
        margin: 10,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        elevation: 2,
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