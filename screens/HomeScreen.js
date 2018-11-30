import React, {Component} from 'react';
import {Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput, PixelRatio} from 'react-native';
import {Constants, MapView, Location, AppLoading} from 'expo';
import SubView from "../components/SubView"
import GoogleAutoComplete from '../components/GoogleAutocomplete';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import fireBaseUtils from '../firebase/firebase'
import carLogo from '../assets/svgs/copIcon.svg';
import Modal from 'react-native-modal';
import { IntentLauncherAndroid,Svg } from 'expo';
import {Circle,Path,G} from 'react-native-svg'


import {registerForPushNotificationsAsync} from '../utills/pushNotificationService'
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";

let {height, width} = Dimensions.get('window');

/* fix for setTimout Issue */
import {Platform, InteractionManager} from 'react-native';
import permissionsUtills from '../utills/permissionsUtills';

const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 60 * 1000;
if (Platform.OS === 'android') {
// Work around issue `Setting a timer for long time`
// see: https://github.com/firebase/firebase-js-sdk/issues/97
    const timerFix = {};
    const runTask = (id, fn, ttl, args) => {
        const waitingTime = ttl - Date.now();
        if (waitingTime <= 1) {
            InteractionManager.runAfterInteractions(() => {
                if (!timerFix[id]) {
                    return;
                }
                delete timerFix[id];
                fn(...args);
            });
            return;
        }

        const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
        timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
    };

    global.setTimeout = (fn, time, ...args) => {
        if (MAX_TIMER_DURATION_MS < time) {
            const ttl = Date.now() + time;
            const id = '_lt_' + Object.keys(timerFix).length;
            runTask(id, fn, ttl, args);
            return id;
        }
        return _setTimeout(fn, time, ...args);
    };

    global.clearTimeout = id => {
        if (typeof id === 'string' && id.startWith('_lt_')) {
            _clearTimeout(timerFix[id]);
            delete timerFix[id];
            return;
        }
        _clearTimeout(id);
    };
}
/* end fix*/
export default class HomeScreen extends Component {
    static navigationOptions = {
        header: null,
        headerVisible: false,
        headerMode: 'none',
    };

    state = {
        mapRegion: null,
        hasLocationPermissions: false,
        location: {coords:{latitude:32.109333,longitude:34.855499}},
        parkingMode: false,
        address: null,
        loggedInUser: this.props.navigation.state.params.userObject,
        mode: 'default',
        reports:[]
    };
    async componentWillMount() {
        await fireBaseUtils.getReports(this)
        setInterval(fireBaseUtils.getReports ,5000, this)
        await registerForPushNotificationsAsync(this.state.loggedInUser.wipi.userId)
        if (this.state.address === null) {
            let {location, mapRegion, address, hasLocationPermissions} = await this._getLocationAsync();
            this.setState({location, address, mapRegion, hasLocationPermissions});
        }
    }

    park() {
        this.setState({parkingMode: true})
        fetch("https://us-central1-wipi-cee66.cloudfunctions.net/markUserParking", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": this.state.loggedInUser.firebase.uid,
                "latitude": this.state.location.coords.latitude,
                "longitude": this.state.location.coords.longitude
            })
        })
    }

    endPark = () => {
        this.setState({parkingMode: false})
        fetch("https://us-central1-wipi-cee66.cloudfunctions.net/unmarkUserParking", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": this.state.loggedInUser.firebase.uid
            })
        }).catch(e=>console.log(e));
    }

    _getLocationAsync = async () => {
        let mapRegion, location, address;
        let hasLocationPermissions = await permissionsUtills.validateLocationServices();
        console.log('hasLocation',hasLocationPermissions);
        if (hasLocationPermissions) {
            location = await Location.getCurrentPositionAsync({});
            let tempAddress = await Location.reverseGeocodeAsync(location.coords)
            tempAddress = tempAddress[0];
            const street = tempAddress.street === null ? "":tempAddress.street
            const name = tempAddress.name === null ? "":tempAddress.name

            address = {
                structured_formatting: {
                    main_text: name.includes(street) ? name : street + " " + name,
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

        let location = await Location.geocodeAsync(address.description);
        const mapRegion = {
            latitude: location[0].latitude,
            longitude: location[0].longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
        }

        this.setState({mapRegion, address, mode: 'default', location:{coords:location[0]}})
    }


    switchToReport = () => this.props.navigation.navigate('Reports', {userId:this.props.navigation.state.params.userObject.wipi.userId})

    render() {
        if (this.state.location === null)
            return (<AppLoading/>)
        let res;
        switch (this.state.mode) {
            case 'default':
                res =
                    (<View style={styles.container}>
                            <MapView
                                ref={map => this.map = map}
                                customMapStyle={mapStyle}
                                style={{alignSelf: 'stretch', height: height}}
                                region={this.state.mapRegion}
                                showsUserLocation={true}
                                showsMyLocationButton={false}
                                followsUserLocation={true}>
                                {
                                    this.state.reports.map((report,key)=> {
                                        const coordinate = {latitude: report.l[0], longitude: report.l[1]}
                                        let image;
                                        switch (report.reportType){
                                            case 'bicycle officer':
                                                image=( <Svg xmlns="http://www.w3.org/2000/svg" width="29" height="40" viewBox="0 0 29 40">
                                                     <G fill="none" fill-rule="evenodd" transform="translate(0 .944)">
                                                        <Path fill="#56C225" fill-rule="nonzero" d="M14.5590537,0.000297546387 L14.4980662,0 C6.50394447,0 0,6.5055542 0,14.5021134 C0,18.8861618 2.24047232,22.3055649 4.73679455,25.7103882 L14.4790262,39 L24.2632054,25.7106857 C26.7592302,22.3058625 29,18.8864593 29,14.5024109 C29,6.52578735 22.5269955,0.0327301406 14.5590537,0.000297546387 Z M14.4998513,24.281868 C9.10825921,24.281868 4.72191959,19.8948441 4.72191959,14.5021134 C4.72191959,9.10968018 9.10825921,4.72265625 14.4998513,4.72265625 C19.8917408,4.72265625 24.2780804,9.10968018 24.2780804,14.5021134 C24.2780804,19.8948441 19.8917408,24.281868 14.4998513,24.281868 Z"/>
                                                        <G transform="translate(-4 -4)">
                                                            <Path  fill-rule="nonzero" d="M9.77,15.06A6.21,6.21,0,1,0,16,21.27,6.21,6.21,0,0,0,9.77,15.06Zm0,10.65a4.44,4.44,0,0,1,0-8.87h0a4.44,4.44,0,0,1,0,8.87Z"  fill="#68544f"/>
                                                            <Path  fill-rule="nonzero"  d="M26.76,15.06a6.24,6.24,0,1,0,.06,0Zm0,10.65a4.44,4.44,0,0,1,0-8.87h0a4.44,4.44,0,1,1,0,8.87Z" fill="#53433f"/>
                                                            <Path  fill-rule="nonzero" d="M13.08,13.29a.88.88,0,0,1-.88-.89V8.85a.89.89,0,1,1,1.77,0V12.4a.89.89,0,0,1-.89.89Z" fill="#70da40"/>
                                                            <Path fill-rule="nonzero" d="M14.88,9.74H11.33a.89.89,0,0,1,0-1.78h3.55a.89.89,0,0,1,0,1.78Z" fill="#68544f"/>
                                                            <Path  fill-rule="nonzero" d="M27.65,11.51H24.1l-.88-1.6L24.1,8h4.44a.89.89,0,0,1,.89.89v.89a1.78,1.78,0,0,1-1.78,1.77Z" fill="#dfd7d5"/>
                                                            <Path  fill-rule="nonzero" d="M24.37,7.08a2.66,2.66,0,0,0-2.66-2.66H19.94a.89.89,0,1,0,0,1.77h1.77a.89.89,0,0,1,.89.89V8l.83.89L24.37,8Z" fill="#53433f"/>
                                                            <Path  fill-rule="nonzero" d="M23.45,13.29a.89.89,0,0,0,.89-.89V8H22.56V12.4A.89.89,0,0,0,23.45,13.29Z" fill="#56c225"/>
                                                            <Path  fill-rule="nonzero" d="M24.22,13l-6,7.33L17,21.73a.89.89,0,0,1-.69.32.9.9,0,0,1-.57-.2.92.92,0,0,1-.13-1.26l2.56-3.12,4.63-5.64Z" fill="#70da40"/>
                                                            <Path  fill-rule="nonzero" d="M24.19,13l-6,7.33V17.47l4.64-5.64Z" fill="#56c225"/>
                                                            <Path  fill-rule="nonzero" d="M26.64,20.46a.92.92,0,0,1-1.15-.5l-2.66-6.68H18.11V11.51h5.32a.89.89,0,0,1,.82.55l2.89,7.24a.89.89,0,0,1-.49,1.15Z" fill="#56c225"/>
                                                            <Path  fill-rule="nonzero" d="M19.53,21.27a1.76,1.76,0,0,1-.89,1.53,1.73,1.73,0,0,1-.89.25H8.88a1.78,1.78,0,0,1,0-3.55h8.87a1.72,1.72,0,0,1,.89.24A1.77,1.77,0,0,1,19.53,21.27Z" fill="#dfd7d5"/>
                                                            <Path  fill-rule="nonzero" d="M26.76,23.93a2.66,2.66,0,1,1,2.67-2.66h0A2.67,2.67,0,0,1,26.76,23.93Z" fill="#d2c5c2"/>
                                                        </G>
                                                   </G>
                                                   </Svg>
                                                 )
                                                break
                                            case 'parking officer':
                                                image =  (<Svg xmlns="http://www.w3.org/2000/svg" width="29" height="40" viewBox="0 0 29 40">
                                                        <G fill="none" fill-rule="evenodd" transform="translate(0 .944)">
                                                            <Path fill="#3C9BFF" fill-rule="nonzero" d="M14.5590537,0.000297546387 L14.4980662,0 C6.50394447,0 0,6.5055542 0,14.5021134 C0,18.8861618 2.24047232,22.3055649 4.73679455,25.7103882 L14.4790262,39 L24.2632054,25.7106857 C26.7592302,22.3058625 29,18.8864593 29,14.5024109 C29,6.52578735 22.5269955,0.0327301406 14.5590537,0.000297546387 Z M14.4998513,24.281868 C9.10825921,24.281868 4.72191959,19.8948441 4.72191959,14.5021134 C4.72191959,9.10968018 9.10825921,4.72265625 14.4998513,4.72265625 C19.8917408,4.72265625 24.2780804,9.10968018 24.2780804,14.5021134 C24.2780804,19.8948441 19.8917408,24.281868 14.4998513,24.281868 Z"/>
                                                            <G transform="translate(5 6.056)">
                                                                <Path fill="#254662" fill-rule="nonzero" d="M18.0155327,6.90712514 L17.8781746,6.40376499 C18.3383242,6.2672654 18.9919197,5.98310586 18.8820333,5.48089037 C18.7152004,4.71769451 18.2367364,4.78923518 17.4512199,4.78923518 L17.4512199,4.84131679 L16.4834177,1.30005369 C16.3718143,0.965243364 16.0896579,0.704549168 15.6037537,0.704549168 C15.6037537,0.704549168 14.0753588,0.592659562 11.5499732,0.548304348 L7.63812946,0.548304348 L7.63812946,0.548590511 C5.11274386,0.592945725 3.58434902,0.704835331 3.58434902,0.704835331 C3.09873096,0.704835331 2.81113747,0.881683864 2.70468496,1.30033986 L1.74260604,4.8212854 L1.74260604,4.78952135 C0.957089503,4.78952135 0.478625511,4.71798068 0.311792672,5.48117653 C0.20247853,5.98167505 0.850636988,6.26583458 1.31050041,6.40262034 L1.17257,6.90769746 C0.478911674,7.06852088 0.293478261,7.74014468 0.293478261,8.54569261 L0.293478261,8.88393689 L0.293478261,11.2296123 L0.293478261,13.9106704 L1.65876038,13.9106704 L1.65876038,16.0863652 C1.65876038,16.3175847 1.88339808,16.5053074 2.16126204,16.5053074 L3.50222033,16.5053074 C3.78008429,16.5053074 4.00529431,16.3175847 4.00529431,16.0863652 L4.00529431,13.9106704 L15.1825222,13.9106704 L15.1825222,16.0863652 C15.1825222,16.3175847 15.4077322,16.5053074 15.6855962,16.5053074 L17.0265545,16.5053074 C17.3038461,16.5053074 17.5290561,16.3175847 17.5290561,16.0863652 L17.5290561,13.9106704 L18.8943383,13.9106704 L18.8943383,11.2296123 L18.8943383,8.88393689 L18.8943383,8.54569261 C18.8940521,7.74014468 18.709191,7.06823472 18.0155327,6.90712514 Z M3.51881776,1.89698903 C3.59264773,1.68379784 3.87308716,1.49149652 4.3097714,1.49149652 C4.3097714,1.49149652 8.28342629,1.40078295 9.58804193,1.40078295 C10.8926576,1.40078295 14.8763281,1.49149652 14.8763281,1.49149652 C15.3132986,1.49149652 15.577999,1.67320982 15.6678541,1.89698903 L16.5223359,5.81627302 C16.5223359,6.0403384 16.5003013,6.22147937 16.0633309,6.22147937 L3.12334095,6.22147937 C2.68694287,6.22147937 2.66433602,6.0403384 2.66433602,5.81627302 L3.51881776,1.89698903 Z M3.22607335,10.9749276 C2.43912599,10.9749276 1.80184172,10.337071 1.80184172,9.55040976 C1.80184172,8.76374857 2.43941216,8.12589197 3.22607335,8.12589197 C4.01273454,8.12589197 4.6508773,8.76374857 4.6508773,9.55040976 C4.6508773,10.337071 4.01273454,10.9749276 3.22607335,10.9749276 Z M15.961457,10.9749276 C15.1747958,10.9749276 14.5366531,10.337071 14.5366531,9.55040976 C14.5366531,8.76374857 15.1745097,8.12589197 15.961457,8.12589197 C16.7484044,8.12589197 17.386261,8.76374857 17.386261,9.55040976 C17.386261,10.337071 16.7484044,10.9749276 15.961457,10.9749276 Z"/>
                                                                <Circle cx="4" cy="10" r="2" fill="#FAFF66" stroke="#FFD15C"/>
                                                                <Circle cx="15" cy="10" r="2" fill="#FAFF66" stroke="#FFD15C"/>
                                                            </G>
                                                        </G>
                                                    </Svg>
                                                )
                                                break
                                            case 'towing truck':

                                                image =  (<Svg xmlns="http://www.w3.org/2000/svg" width="29" height="40" viewBox="0 0 29 40">
                                                            <G fill="none" fill-rule="evenodd" transform="translate(0 .944)">
                                                                <Path fill="#FFA733" fill-rule="nonzero" d="M14.5590537,0.000297546387 L14.4980662,0 C6.50394447,0 0,6.5055542 0,14.5021134 C0,18.8861618 2.24047232,22.3055649 4.73679455,25.7103882 L14.4790262,39 L24.2632054,25.7106857 C26.7592302,22.3058625 29,18.8864593 29,14.5024109 C29,6.52578735 22.5269955,0.0327301406 14.5590537,0.000297546387 Z M14.4998513,24.281868 C9.10825921,24.281868 4.72191959,19.8948441 4.72191959,14.5021134 C4.72191959,9.10968018 9.10825921,4.72265625 14.4998513,4.72265625 C19.8917408,4.72265625 24.2780804,9.10968018 24.2780804,14.5021134 C24.2780804,19.8948441 19.8917408,24.281868 14.4998513,24.281868 Z"/>
                                                                <G transform="translate(8 2)">
                                                                    <Path fill="#FFA733" d="M20.0200049,3.05693473 L18.082438,0.993161406 C17.8128218,0.705983235 17.3786931,0.705983235 17.1136341,0.993161406 L7.31158148,11.43373 L7.31158148,7.71501976 C7.31158148,7.31103743 7.00542515,6.98489539 6.6261066,6.98489539 L3.42729227,6.98489539 C1.53542103,6.98493912 0,8.62037223 0,10.6354735 L0,16.4763373 C0,17.688328 0.918510059,18.6666667 2.05638357,18.6666667 L7.31158148,18.6666667 L7.31158148,14.5293681 L10.2179523,14.5293681 L20.0200459,4.08879953 C20.2896212,3.80651917 20.2896212,3.3441129 20.0200049,3.05693473 Z"/>
                                                                    <Path fill="#7F8189" d="M18.8999979,16.3333333 L7,16.3333333 L7,11.6666667 L20.2999853,11.6666667 C20.6865531,11.6666667 21,11.9651465 21,12.3333447 L21,14.333339 C21,15.4379339 20.059827,16.3333333 18.8999979,16.3333333 Z" opacity=".1"/>
                                                                    <Path fill="#757880" d="M20.3978378,11.6666667 L14.7777778,11.6666667 L14.7777778,16.3333333 L19.1935496,16.3333333 C20.1912143,16.3333333 21,15.4379339 21,14.333339 L21,12.3333447 C21,11.9651465 20.7304048,11.6666667 20.3978378,11.6666667 Z"/>
                                                                    <Path fill="#5D5F66" d="M4.14705522.0229811321L4.14705522 5.16820126C4.14705522 5.57490566 3.86921623 5.90324528 3.52498204 5.90324528L0 5.90324528 0 3.69811321C0 1.66943396 1.39340519.0229811321 3.11029142.0229811321L4.14705522.0229811321zM4.35443779 13.9885094C3.32538656 13.9885094 2.48825549 12.9993522 2.48825549 11.7834214 2.48825549 10.5674906 3.32538656 9.57833333 4.35443779 9.57833333 5.38348902 9.57833333 6.22062009 10.5674906 6.22062009 11.7834214 6.22062009 12.9993522 5.38348902 13.9885094 4.35443779 13.9885094z" transform="translate(0 5.444)"/>
                                                                    <Path fill="#55575C" d="M6.22222222,17.1111111 C6.22222222,15.8244632 5.52443193,14.7777778 4.66666667,14.7777778 L4.66666667,19.4444444 C5.52443193,19.4444444 6.22222222,18.397759 6.22222222,17.1111111 Z"/>
                                                                    <Path fill="#E7ECFD" d="M5.44444444,16.3333333 C5.0155859,16.3333333 4.66666667,16.6822526 4.66666667,17.1111111 C4.66666667,17.5399697 5.0155859,17.8888889 5.44444444,17.8888889 C5.87330299,17.8888889 6.22222222,17.5399697 6.22222222,17.1111111 C6.22217564,16.682206 5.87330299,16.3333333 5.44444444,16.3333333 Z"/>
                                                                    <Path fill="#CAD1D7" d="M5.44444444,17.1111344 C5.44444444,16.682263 5.09552521,16.3333333 4.66666667,16.3333333 L4.66666667,17.8888889 C5.09557179,17.8889355 5.44444444,17.5400058 5.44444444,17.1111344 Z"/>
                                                                    <Path fill="#5D5F66" d="M11.6666667,19.4444444 C10.3800188,19.4444444 9.33333333,18.397759 9.33333333,17.1111111 C9.33333333,15.8244632 10.3800188,14.7777778 11.6666667,14.7777778 C12.9533146,14.7777778 14,15.8244632 14,17.1111111 C14,18.397759 12.9533146,19.4444444 11.6666667,19.4444444 Z"/>
                                                                    <Path fill="#55575C" d="M12.4444444,17.1111111 C12.4444444,15.8244632 11.7466542,14.7777778 10.8888889,14.7777778 L10.8888889,19.4444444 C11.7466542,19.4444444 12.4444444,18.397759 12.4444444,17.1111111 Z"/>
                                                                    <Path fill="#E7ECFD" d="M11.6666667,16.3333333 C11.2378081,16.3333333 10.8888889,16.6822526 10.8888889,17.1111111 C10.8888889,17.5399697 11.2378081,17.8888889 11.6666667,17.8888889 C12.0955252,17.8888889 12.4444444,17.5399697 12.4444444,17.1111111 C12.4444444,16.682206 12.0955252,16.3333333 11.6666667,16.3333333 Z"/>
                                                                    <Path fill="#CAD1D7" d="M11.6666667,17.1111344 C11.6666667,16.682263 11.3177474,16.3333333 10.8888889,16.3333333 L10.8888889,17.8888889 C11.3177474,17.8889355 11.6666667,17.5400058 11.6666667,17.1111344 Z"/>
                                                                    <Path fill="#5D5F66" d="M17.1111111,19.4444444 C15.8244632,19.4444444 14.7777778,18.397759 14.7777778,17.1111111 C14.7777778,15.8244632 15.8244632,14.7777778 17.1111111,14.7777778 C18.397759,14.7777778 19.4444444,15.8244632 19.4444444,17.1111111 C19.4444444,18.397759 18.397759,19.4444444 17.1111111,19.4444444 Z"/>
                                                                    <Path fill="#55575C" d="M17.8888889,17.1111111 C17.8888889,15.8244632 17.1910986,14.7777778 16.3333333,14.7777778 L16.3333333,19.4444444 C17.1910986,19.4444444 17.8888889,18.397759 17.8888889,17.1111111 Z"/>
                                                                    <Path fill="#E7ECFD" d="M17.1111111,16.3333333 C16.6822526,16.3333333 16.3333333,16.6822526 16.3333333,17.1111111 C16.3333333,17.5399697 16.6822526,17.8888889 17.1111111,17.8888889 C17.5399697,17.8888889 17.8888889,17.5399697 17.8888889,17.1111111 C17.8888889,16.682206 17.5399697,16.3333333 17.1111111,16.3333333 Z"/>
                                                                    <Path fill="#CAD1D7" d="M17.1111111,17.1111344 C17.1111111,16.682263 16.7621919,16.3333333 16.3333333,16.3333333 L16.3333333,17.8888889 C16.7621919,17.8889355 17.1111111,17.5400058 17.1111111,17.1111344 Z"/>
                                                                    <Path fill="#E7ECFD" d="M2.33332169,15.5555556 L0,15.5555556 L0,14 L2.33332169,14 C2.76283885,14 3.11111111,14.3482309 3.11111111,14.7778011 C3.11111111,15.2072781 2.76283885,15.5555556 2.33332169,15.5555556 Z"/>
                                                                    <Path fill="#CC7400" d="M18.881476,0.983123723 C18.6145328,0.709329129 18.1847083,0.709329129 17.9222771,0.983123723 L14.7777778,4.20832981 L14.7777778,10.1111111 L20.7997926,3.93453522 C21.0667358,3.66536849 21.0667358,3.22451208 20.7997926,2.95071749 L18.881476,0.983123723 Z"/>
                                                                    <Path fill="#DBDFE3" d="M18.6666667,1.55555556 C18.2378081,1.55555556 17.8888889,1.90447479 17.8888889,2.33333333 C17.8888889,2.76219188 18.2378081,3.11111111 18.6666667,3.11111111 C19.0955252,3.11111111 19.4444444,2.76219188 19.4444444,2.33333333 C19.4444444,1.90447479 19.0955252,1.55555556 18.6666667,1.55555556 Z"/>
                                                                    <Path fill="#CAD1D7" d="M20.2222222,2.33335663 C20.2222222,1.90448524 19.873303,1.55555556 19.4444444,1.55555556 L19.4444444,3.11111111 C19.8733496,3.11111111 20.2222222,2.76222801 20.2222222,2.33335663 Z"/>
                                                                    <Path fill="#7F8189" d="M21,8.80059181 C21,9.95145459 19.9526158,10.8888889 18.6666667,10.8888889 C17.3807176,10.8888889 16.3333333,9.95149629 16.3333333,8.80059181 C16.3333333,8.41542822 16.6807222,8.10447888 17.1111266,8.10447888 C17.5415311,8.10447888 17.8889199,8.41538653 17.8889199,8.80059181 C17.8889199,9.18579709 18.2362622,9.49670473 18.6666667,9.49670473 C19.0970711,9.49670473 19.44446,9.18579709 19.44446,8.80059181 C19.44446,8.54071688 19.2837396,8.30402347 19.0296617,8.18340448 C18.900014,8.12307414 18.7755838,8.0488182 18.6667133,7.96063667 C18.179288,7.59865461 17.8889199,7.02324407 17.8889199,6.39671742 L17.8889199,3.80722404 C17.8889199,3.42206045 18.2363088,3.11111111 18.6667133,3.11111111 C19.0971177,3.11111111 19.4445066,3.42201876 19.4445066,3.80722404 L19.4445066,6.39671742 C19.4445066,6.64266676 19.5689367,6.86543457 19.7504342,6.9536161 C20.5229634,7.31559815 21,8.02096701 21,8.80059181 Z"/>
                                                                    <Path fill="#757880" d="M21,8.80058061 C21,9.95144957 20.3017439,10.8888889 19.4444444,10.8888889 L19.4444444,9.49669727 C19.7313497,9.49669727 19.9629733,9.18578796 19.9629733,8.80058061 C19.9629733,8.54070429 19.8558264,8.30400962 19.6864411,8.18338998 C19.6000093,8.12305931 19.5170559,8.04880298 19.4444755,7.96062097 L19.4444755,3.11111111 C19.7313807,3.11111111 19.9630044,3.42202043 19.9630044,3.80722777 L19.9630044,6.39673503 C19.9630044,6.64268569 20.0459578,6.86545469 20.1669562,6.9536367 C20.6819756,7.315579 21,8.02095164 21,8.80058061 Z"/>
                                                                    <Path fill="#5D5F66" d="M18.6666667,4.66666667 C17.3800188,4.66666667 16.3333333,3.61998123 16.3333333,2.33333333 C16.3333333,1.04668543 17.3800188,0 18.6666667,0 C19.9533146,0 21,1.04668543 21,2.33333333 C21,3.61998123 19.9533146,4.66666667 18.6666667,4.66666667 Z"/>
                                                                    <Path fill="#55575C" d="M21,2.33333333 C21,1.04668543 20.3022097,0 19.4444444,0 L19.4444444,4.66666667 C20.3022097,4.66666667 21,3.61998123 21,2.33333333 Z"/>
                                                                </G>
                                                            </G>
                                                        </Svg>
                                                    )
                                                break;
                                        }
                                        return (
                                            <View key={key}>
                                                <MapView.Marker
                                                    coordinate={coordinate}
                                                    title={report.reportType}
                                                    key={key}
                                                >
                                                    {image}
                                                </MapView.Marker>
                                            </View>

                                        )
                                    })}
                            </MapView>


                            <SubView showValue={300}
                                     hideValue={50}
                                     show={this.state.parkingMode}
                                     endPark={this.endPark}
                                     height={300}
                                     backgroundColor={'#3C9BFF'}
                                     address={this.state.address}
                            />

                            <View style={styles.textInputContainer}>
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
        left: 13,
        marginBottom:7
    },
    mapButtonContainer: {
        height: 58,
        width: 58,
        elevation: 4,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 1,
        marginTop: 7,
        marginBottom:7
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
        backgroundColor: '#3C9BFF'
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
        height: 30,
        color: '#5d5d5d',
        fontSize: 16,
        paddingBottom: 7,
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