import React from 'react';
import { StyleSheet, Text, View ,ImageBackground,Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as firebase from "firebase";
const background = require('../assets/images/login.png');

export default class LoginScreen extends React.Component {

    async loginWithGoogle() {
        const result = await Expo.Google.logInAsync({
            androidStandaloneAppClientId:'824034155023-a553hsbo9b5qa7kuc0io50tkl0vjsqi7.apps.googleusercontent.com',
            androidClientId:'824034155023-a553hsbo9b5qa7kuc0io50tkl0vjsqi7.apps.googleusercontent.com',
            iosClientId: '824034155023-obq3arcrrkcko3nvfg987mkf0r1lhfpq.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            webClientId:'824034155023-v227b5r2tnaqm1723m0bis6pg9b52qq2.apps.googleusercontent.com',
        });

        if (result.type === 'success') {
            const credential=firebase.auth.GoogleAuthProvider.credential(result.idToken);
            firebase.auth().signInAndRetrieveDataWithCredential(credential).catch( error => {
                console.log(error);
            })
        }
    }

    async loginWithFacebook(){
        console.log('ss');

        const {type,token}= await Expo.Facebook.logInWithReadPermissionsAsync
        ('1827096117342324',{permissions:['public_profile','email']});
        if (type==='success'){
            const credential = firebase.auth.FacebookAuthProvider.credential(token);
            firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(error=>{
                console.log(error);
            })
        }
    }

    render() {
        console.log('props2 ' +JSON.stringify(this.props))
        let fbSpace="";
        let googleSpace="";
        let flex="row";
        if (Platform.OS!=='ios'){
            fbSpace='   ';
            googleSpace='  ';
            flex='row-reverse'
        }

        return (
            <ImageBackground source={background} style={styles.container}>
                <View style={styles.container}>
                    <View style={styles.buttons}>
                        <Icon.Button
                            name="facebook"
                            onPress={this.loginWithFacebook}
                            style={styles.fbButton}
                            backgroundColor='transparent'
                            borderRadius={150}
                            iconRight={false}
                            flexDirection={flex}
                        >{fbSpace+'Sign In With Facebook'}
                        </Icon.Button>
                        <View style={styles.space}/>
                        <Icon.Button
                            name="google"
                            onPress={this.loginWithGoogle}
                            style={styles.buttonGoogle}
                            backgroundColor='transparent'
                            borderRadius={150}
                            flexDirection={flex}
                        >{googleSpace+'Sign In With Google'}
                        </Icon.Button>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'transparent',
    },
    space:{
        height:'5%'
    },
    buttons:{
        top:'60%',
        height:'100%',
    },
    fbButton:{
        borderWidth:0,
        borderColor:'transparent',
        borderRadius:100,
        width:200,
        height:40,
        backgroundColor: "#3b5998",
    },
    buttonGoogle:{
        borderWidth:0,
        borderColor:'transparent',
        borderRadius:100,
        width:200,
        height:40,
        backgroundColor: "#DD4B39",
    }
});

