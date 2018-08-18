import { AppLoading, } from 'expo';
import React from 'react';
import { StyleSheet } from 'react-native';
import * as firebase from "firebase";

export default class AuthLoadingScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    _bootstrapAsync = async () => {
        console.log("handler: "+this);
        firebase.auth().onAuthStateChanged((user)=>{
            this.props.navigation.navigate(user ? 'Main' : 'Login');
        })
    }

    // Render any loading content that you like here
    render() {
        return (
            <AppLoading
                startAsync={this._bootstrapAsync}
                onError={this._handleLoadingError}
                onFinish={this._handleFinishLoading}
            />

        );
    }

    _handleLoadingError = error => {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.warn(error);
    };
    _handleFinishLoading = msg => {
        console.log(msg);
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});