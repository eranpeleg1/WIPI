import { AppLoading, } from 'expo';
import React from 'react';
import { StyleSheet,View } from 'react-native';
import * as firebase from "firebase";
import fireBaseUtils from '../firebase/firebase'
export default class AuthLoadingScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };


    createNewUserInstance = async (userData)=> {
       
      await fetch("https://us-central1-wipi-cee66.cloudfunctions.net/initUserInstance", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
    }

    getUserData = async (userId)=>{
       return new Promise(async (resolve,reject)=>{

            await fetch("https://us-central1-wipi-cee66.cloudfunctions.net/getUserInstance", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "userId": userId
                })
          })
          .then(async (response)=>{
            let responseObj;
            try{
                 responseObj = await response.json();
                 resolve(responseObj)

            }
            //this is a hack!. only if response comes empty , response.json fails
            catch(err){
                resolve(false);
            }
            
        }).catch((err)=>reject(`this is error!!!  ${err} `));

    })

    }

    async componentWillMount() {
        firebase.auth().onAuthStateChanged(async (user)=>{
           if (user){
                const userData = await this.getUserData(user.uid);
                const isUserExist = userData && userData.userId 
                if(!isUserExist){
                    const {uid,displayName,photoURL,email} = user
                    const userData = {
                        userId:uid,
                        displayName,
                        photoURL,
                        email
                    }
                    this.createNewUserInstance(userData)
                }
                const userObject = {
                    wipi:userData,
                    firebase:user
                }
               this.props.navigation.navigate({routeName: 'Settings', key: 'Settings', params: {userObject}})
               this.props.navigation.navigate({routeName: 'Map', key: 'Map', params: {userObject}})
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
