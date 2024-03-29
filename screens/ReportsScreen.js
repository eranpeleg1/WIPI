import React, {Component} from 'react';
import {Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput, PixelRatio} from 'react-native'
import Icon from "react-native-vector-icons/MaterialIcons";
import IconCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import IconAwesome from "react-native-vector-icons/FontAwesome"
import {Location, Permissions, ImagePicker} from 'expo';
import * as firebase from "firebase";


import {Constants} from "expo";
let {height, width} = Dimensions.get('window');

export default class ReportsScreen extends Component {
    static navigationOptions = {
        header: null,
        headerVisible: false,
        headerMode: 'none',
    }

    state = {
        reportType:"parkingOfficer",
        photo:null,
        text:'',
        hasCameraPermission: false,
        hasGalleryPermission: false,
        location:null,
        userId:this.props.navigation.getParam('userId')
    }

    updateReport = (photo) =>{
        this.setState({photo})

    }

    switchToHome = () => this.props.navigation.navigate('Map')
    switchToCamera = async () =>  {
        let photo = await ImagePicker.launchCameraAsync()
        if (!photo.canceled) {
            this.setState({photo})
        }
        return Promise.resolve()
    }

    switchToGallery = async () =>  {
        let photo = await ImagePicker.launchImageLibraryAsync()
        if (!photo.canceled) {
            this.setState({photo})
        }
        return Promise.resolve()
    }

    report = async () => {

        let statusCode = await this.sendReport();

        if (this.state.photo !== null && statusCode === 201) {
            const response = await fetch(this.state.photo.uri);
            const blob = await response.blob();

            const refStorage = firebase.storage().ref().child("images/" + this.state.reportType +"/"+ this.state.userId);
            await refStorage.put(blob);
        }

        this.switchToHome();
    }

    async sendReport (){
        let response = await fetch("https://us-central1-wipi-cee66.cloudfunctions.net/addReportAction", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": this.state.userId,
                "latitude": this.state.location.location.coords.latitude,
                "longitude": this.state.location.location.coords.longitude,
                "type": this.state.reportType,
                "text": this.state.text
            })
        });
        return (response.status)
    }


    async componentWillMount() {
        const status  = await Permissions.askAsync(Permissions.CAMERA);
        if (status.status !== 'granted')
            this.switchToHome()
        const status2 = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status2.status !== 'granted')
            this.switchToHome()
        this.setState({ hasCameraPermission: status.status === 'granted', hasGalleryPermission: status2.status === 'granted' });
        location = await this._getLocationAsync()
        this.setState({location})
    }

    onChangeText =(text)=>(this.setState({text}))

    _getLocationAsync = async () => {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        let hasLocationPermissions = (status === 'granted');
        let location
        if (hasLocationPermissions) {
            location = await Location.getCurrentPositionAsync({});
        }
        return {location};
    }


    render() {
        /* Go ahead and delete ExpoConfigView and replace it with your
         * content, we just wanted to give you a quick view of your config */
        let  backgroundColor = {backgroundColor: '#40596b'}
        if (this.state.reportType ==='towingTruck')
            backgroundColor = {backgroundColor: '#cc6600'}
        else if (this.state.reportType === 'bicycleOfficer')
            backgroundColor = {backgroundColor: '#006633'}

        return (
            <View style={[styles.container,backgroundColor]} >
            <View style={styles.headerWrapper}>
            <Text style={styles.header}>Alert Reports</Text>
            </View>

                <View style={styles.reportTypesContainer}>
                    <View style={styles.reportType}>
                        <TouchableOpacity
                            style={[styles.reportTypeButton, styles.officerButton]}
                            onPress={()=>this.setState({reportType:'parkingOfficer'})}
                            activeOpacity={0.8}
                        >
                            <IconAwesome
                                name="user"
                                backgroundColor='#000099'
                                size={24}
                                color='#40596b'
                            />
                        </TouchableOpacity>
                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 12}}>
                            Parking officer
                        </Text>
                    </View>
                    <View style={styles.reportType}>
                        <TouchableOpacity
                            style={[styles.reportTypeButton, styles.towingButton]}
                            onPress={()=>this.setState({reportType:'towingTruck'})}
                            activeOpacity={0.8}
                        >
                            <IconCommunity
                                name="towing"
                                backgroundColor='ff8000'
                                size={24}
                                color='#cc6600'
                            />
                        </TouchableOpacity>
                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 12}}>
                            Towing truck
                        </Text>
                    </View>
                    <View style={styles.reportType}>
                        <TouchableOpacity
                            style={[styles.reportTypeButton, styles.bicycleButton]}
                            onPress={()=>this.setState({reportType:'bicycleOfficer'})}
                            activeOpacity={0.8}
                        >
                            <IconCommunity
                                name="bike"
                                backgroundColor='#006633'
                                size={24}
                                color='#006633'
                            />
                        </TouchableOpacity>
                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 12}}>
                            Bicycle officer
                        </Text>
                    </View>
                </View>

                <View style={styles.form}>

                    <View style={styles.description}>
                        <TextInput
                            clearButtonMode="while-editing"
                            placeholder="Enter description"
                            onChangeText={this.onChangeText}
                            style={{width: width-100,color:'white'}}
                            placeholderTextColor ='white'
                            underlineColorAndroid ='transparent'
                        >
                        </TextInput>
                        <Icon
                            name="edit"
                            backgroundColor='white'
                            size={24}
                            color='white'
                        />
                    </View>
                    <View style={styles.photos}>
                        <View style={styles.photoWrapper} >
                        <TouchableOpacity
                            style={[styles.photoButton]}
                            onPress={this.switchToGallery}
                            activeOpacity={0.8}
                        >
                            <Icon
                                name="photo-library"
                                backgroundColor='white'
                                size={30}
                                color='white'
                            />
                        </TouchableOpacity>
                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 12}}>
                            Add from gallery
                        </Text>
                        </View>
                        <View style={styles.photoWrapper} >
                        <TouchableOpacity
                            style={[styles.photoButton]}
                            onPress={this.switchToCamera}
                            activeOpacity={0.8}
                        >
                            <Icon
                                name="add-a-photo"
                                backgroundColor='white'
                                size={30}
                                color='white'
                            />
                        </TouchableOpacity>
                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 12}}>
                            Take a photo
                        </Text>
                        </View>
                    </View>
                </View>
            <View style={styles.mapButtonContainer}>
                <TouchableOpacity
                    style={[styles.mapButton, styles.backButton]}
                    onPress={this.switchToHome}
                    activeOpacity={0.8}
                >
                    <Text style={{fontWeight: 'bold', color: 'white', fontSize: 12}}>
                        Back
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.reportWrapper}>
            <TouchableOpacity
                onPress={this.report}
                activeOpacity={0.8}
                style={styles.reportButton}
                disabled={this.state.location===null}
            >
                <Text style={{fontWeight: 'bold', color: 'white', fontSize: 20}}>
                    Report
                </Text>
            </TouchableOpacity>
            </View>
        </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
    },
    headerWrapper:{
        top: 10 +  Constants.statusBarHeight,
        marginBottom: 20,
    },
    header: {
            fontWeight: 'bold',
            color:'white',
            fontSize: 30,
            opacity:1.0,
        },
    reportTypesContainer:{
        marginTop:20,
        flexDirection: 'row'
    },
    form:{
        padding:5,
        marginTop:10,
        borderWidth: 2,
        borderColor: "#ffffff",
        borderRadius: 5,
        height: '30%',
        width: width - 50,
        alignItems:'center',
    },
    description:{
        margin:10,
        width:width-80,
        flexDirection: 'row'
    },
    photos:{
        margin:10,
        flexDirection: 'row'
    },
    photoWrapper:{
        alignItems:'center',
        margin:10,
    },
    photoButton:{
        margin:5,
    },
    reportType:{
        justifyContent:'center',
        alignItems:'center',
        margin: 10
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
    reportTypeButton: {
        borderWidth: 3,
        borderColor:'#ffffff',
        height: 70,
        width: 70,
        borderRadius: 35,
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
    backButton: {
        backgroundColor: '#FF6E69',
    },
    officerButton: {
        backgroundColor: '#3C9BFF',
    },
    towingButton: {
        backgroundColor: '#ffa733',
    },
    bicycleButton: {
        backgroundColor: '#3cff6b',
    },
    mapButtonContainer:{
        position:'absolute',
        bottom:65,
    },
    reportWrapper: {
        position:'absolute',
        backgroundColor: '#3B9BFF',
        width:width-10,
        bottom:5,
        height:40,
        justifyContent:'center',
    },
    reportButton:{
        alignItems: 'center',
    }
})