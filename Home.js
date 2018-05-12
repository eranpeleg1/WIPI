import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity,Animated ,} from 'react-native';
import { Constants, Location, Permissions,MapView,Components } from 'expo';
const carLogo=require("./assets/carSmall.png");
import * as firestore from 'firebase/firestore';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GoogleAutocomplete from './GoogleAutocomplete.js';
import SubView from './SubView'

const MY_INDEX=0;
const SEARCHED_INDEX=1;

export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            locations:[
                {
                    coords:null,
                    address:null,
                },
                {
                    coords:null,
                    address:null,
                }
            ],
            locationIndex:MY_INDEX,
            parkingMode:false
        }
    }

    getLocationAsync = async () => {
        let {status}  = await Permissions.askAsync(Permissions.LOCATION);
        while (status !== 'granted') {
            let retryStatus = await Permissions.askAsync(Permissions.LOCATION);
            status=retryStatus.status;
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
        return {address,coords:location.coords}
    };

     setAddress = async (address)=>{
        let {status}  = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            console.log("errorMessage: 'Permission to access location was denied'");
        }
        let location = await Location.geocodeAsync(address.description);
        console.log("address",location);
        let myLocation=this.state.locations[0];
        await this.map.animateToRegion(
             {
                 latitude: location[0].latitude,
                 longitude: location[0].longitude,
                 latitudeDelta: 0.001,
                 longitudeDelta: 0.001,
             },
             1000
         );
         this.setState(
             {locationIndex:SEARCHED_INDEX,
                 locations:[{
                     coords:myLocation.coords,
                     address:myLocation.address,
                 },{
                     coords:{
                         latitude:location[0].latitude,
                         longitude:location[0].longitude,
                     },
                     address:address
                 }]
             })
    }


    park(){
        console.log("button");
        this.setState({parkingMode:true})
    }

    endPark=()=>{
        this.setState({parkingMode:false})
    }

    async componentWillMount(){
        let newState = await this.getLocationAsync();
        console.log("will", newState);
        this.setState({locations:[{coords:newState.coords,address:newState.address}]});
    }

    myPlace = async () => {
         let location = await this.getLocationAsync();

        this.map.animateToRegion(
            {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            },
            1000
        );
        searchedLocation=this.state.locations[SEARCHED_INDEX];
        this.setState({locationIndex:0,locations:[{coords:location.coords,address:location.address},{coords:searchedLocation.coords,address:searchedLocation.address}]});
    }

    render() {
         console.log("render",this.state);
         let index=this.state.locationIndex;
         let coords=this.state.locations[MY_INDEX].coords;
        if (coords!==null) {
            return(
                <View style={{ flex: 1,marginTop:24}}>
                    <View style={{ flex: 1}}>
                        <GoogleAutocomplete setAddressOfHome={this.setAddress}/>
                        <MapView
                            ref={map => this.map = map}
                            provider="google"
                            style={styles.map}
                            customMapStyle={mapStyle}
                            showsUserLocation= {true}
                            showsMyLocationButton = {false}
                            followsUserLocation= {true}
                            initialRegion={{
                                latitude: coords.latitude,
                                longitude: coords.longitude,
                                latitudeDelta: 0.001,
                                longitudeDelta: 0.001,
                            }}
                            onMapReady={()=>this.myPlace()}
                           >

                        </MapView>
                        <View style={styles.navigator}>
                        </View>
                    </View>
                    <SubView showValue={250}
                             hideValue={50}
                             show={this.state.parkingMode}
                             endPark={this.endPark}
                             height={300}
                             backgroundColor={'#3B9BFF'}
                             address={this.state.locations[this.state.locationIndex].address}
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
            )
        }

        else {
            return (
                <View style={styles.container}>
                    <Text>loading map</Text>
                </View>
            )
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'transparent',
    },
    navigator:{
        backgroundColor:'#f8f8f8',
        height:50,
        elevation:11,
        zIndex:11
    },
    map:{
        flex:1,
        zIndex:-1,
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
})

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