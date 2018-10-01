import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import * as firebase from "firebase";
import LoginScreen from "./screens/LoginScreen";

<<<<<<< HEAD
=======
import Splash from './Splash.js'
import HomeNavigation from './HomeNavigation.js'
import Login from './Login.js'
import * as firebase from "firebase/index";
import * as firestore from 'firebase/firestore';
>>>>>>> 6d1aa65d594fc783a681784a774d2d3d87e867bd

import{store} from './redux/wipi-redux';
import {Provider} from 'react-redux';
export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state={
            isLoadingComplete: false,
        }

    }

<<<<<<< HEAD
=======
    handler(){
        console.log("handler: "+this);
        firebase.auth().onAuthStateChanged((user)=>{
            let nextPage='login';
            if (user !==null) {
                if (this.state.nextPage==='login'){
                    this.storeUserDetails(user.uid, user.displayName)
                }
                nextPage='HomeNavigation';
            }
            this.setState({nextPage});
        })
    }

>>>>>>> 6d1aa65d594fc783a681784a774d2d3d87e867bd
    componentWillMount(){
        //const settings = {timestampsInSnapshots: true};
        //firebase.firestore().settings(settings);
        const firebaseConfig = {
            apiKey: "AIzaSyBKJ88od7dHfemmN5hcCxRpGGABybq_h2k",
            authDomain: "wipi-cee66.firebaseapp.com",
            databaseURL: "https://wipi-cee66.firebaseio.com",
            projectId: "wipi-cee66",
            storageBucket: "wipi-cee66.appspot.com",
        };
        firebase.initializeApp(firebaseConfig)
    }

    render() {
<<<<<<< HEAD
        let screen;
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return(
             <AppLoading
                startAsync={this._loadResourcesAsync}
                onError={this._handleLoadingError}
                onFinish={this._handleFinishLoading}
            />
            )
        } else {
            return (
                <Provider store={store}>
                    <View style={styles.container}>
                        {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
                        <AppNavigator/>
            </View>
                </Provider>

            )
=======
        let page;
        switch (this.state.nextPage) {
            case 'splash':
                page=<Splash handler = {this.handler}/>;
                break;
            case 'login':
                page=<Login handler = {this.handler}/>;
                break;
            case 'HomeNavigation':
                page=<HomeNavigation/>;
                break;
>>>>>>> 6d1aa65d594fc783a681784a774d2d3d87e867bd
        }
    }

    _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'google-sans-bold': require('./assets/fonts/GoogleSans-Bold.ttf'),
          'google-sans-medium': require('./assets/fonts/GoogleSans-Medium.ttf'),
          'google-sans-regular': require('./assets/fonts/GoogleSans-Regular.ttf'),
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
