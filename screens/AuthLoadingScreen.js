import { AppLoading, } from 'expo';
import React from 'react';
import { StyleSheet } from 'react-native';
import * as firebase from "firebase";
import fireBaseUtils from '../firebase/firebase'
export default class AuthLoadingScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    _bootstrapAsync = async () => {
        console.log("handler: "+this);
        firebase.auth().onAuthStateChanged((user)=>{
           if (user){
               fireBaseUtils.storeUserDetails(user)
               this.props.navigation.navigate({routeName: 'Home', key: 'Home', params: {userId: user.uid}})
           }
           else {
               this.props.navigation.navigate('Login')
           }
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
        console.log(error);
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
