import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import * as firebase from "firebase";
import LoginScreen from "./screens/LoginScreen";

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state={
            isLoadingComplete: false,
        }

    }

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
        let screen;
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            screen = <AppLoading
                startAsync={this._loadResourcesAsync}
                onError={this._handleLoadingError}
                onFinish={this._handleFinishLoading}
            />

        } else {
            screen = <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
                <AppNavigator/>
            </View>
        }
        return (screen);
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
