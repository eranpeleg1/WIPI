import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Constants} from "expo";
let {height,width} = Dimensions.get('window');


export default class GoogleAutocomplete extends React.Component {


    render() {
        return (
            <GooglePlacesAutocomplete
                ref={(instance) => { this.GooglePlacesRef = instance }}
                placeholder='Search here'
                minLength={1} // minimum length of text to search
                autoFocus={true}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                listViewDisplayed={'false'}    // true/false/undefined
                fetchDetails={false}
                predefinedPlaces={[]}
                currentLocation={false}
                textInputHide={false}
                styles={styles}
                renderRightButton={() => {
                    const style={
                        color:'grey',
                        marginRight:10
                    }
                    return (
                        <Icon
                            style={style}
                            size={20}
                            name="close"
                            onPress={() => this.GooglePlacesRef.setAddressText("")}
                        >
                        </Icon>)
                }
                }

                renderLeftButton={() => {
                    const style = {
                        color: 'grey',

                        marginLeft: 10
                    }
                    return (
                        <Icon
                            style={style}
                            size={20}
                            name="arrow-right"
                            onPress={() =>{
                                this.GooglePlacesRef.triggerBlur();
                                this.GooglePlacesRef._onBlur();
                                this.GooglePlacesRef.setAddressText('');
                                this.props.returnToMap();
                            }
                            }
                        >
                        </Icon>)
                }
                }

                renderRow={row => {

                    return (
                        <View style={{flexDirection: 'row'}}>
                            <Icon name='map-marker' size={20} color={'#5d5d5d'} style={{marginTop: 10}}/>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={{
                                    flex: 1,
                                    paddingRight: 10,
                                    fontSize: 15,
                                    color: 'black'
                                }} numberOfLines={1}
                                >{row.structured_formatting.main_text}
                                </Text>
                                <Text style={{
                                    paddingRight: 10,
                                    fontSize: 13,
                                    color: '#5d5d5d'
                                }}>{row.structured_formatting.secondary_text}</Text>
                            </View>
                        </View>
                    );
                }
                }
                renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    console.log(data, details);
                    this.props.setAddressOfHome(data);

                }}

                getDefaultValue={() => ''}

                query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: 'AIzaSyBKJ88od7dHfemmN5hcCxRpGGABybq_h2k',
                    language: 'he', // language of the results
                    types: ["locality", "political", "geocode"] // default: 'geocode'
                }}

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
            />);
    }

}
const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop: Constants.statusBarHeight,
        height,
        width
    },
    textInput: {
        height: 40,
        color: '#5d5d5d',
        fontSize: 16,
        paddingBottom:15,
        margin:0,
        top:2,
        textAlign:'right'
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
        elevation: 2,
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
