import { AppLoading, } from 'expo';
import React from 'react';
import { StyleSheet,View } from 'react-native';
import * as firebase from "firebase";
import fireBaseUtils from '../firebase/firebase'
export default class AuthLoadingScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    async componentWillMount() {
        console.log("handler: "+this);
        firebase.auth().onAuthStateChanged(async (user)=>{
           if (user){
               await fireBaseUtils.storeUserDetails(user)
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
            <View/>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
