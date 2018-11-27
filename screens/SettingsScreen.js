import React from 'react';
import {Text, View, StyleSheet, Dimensions, TouchableOpacity, Image,Platform} from 'react-native';
import {Constants} from "expo";
import _ from 'lodash'
import {goldStar , blueStar} from "../components/smallComps";
let {height, width} = Dimensions.get('window');
const radius = parseInt(width/8)
const delimiter = radius*2
import * as firebase from "firebase";
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationEvents } from "react-navigation";
export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: '#Profile',
        headerStyle:{
            backgroundColor: '#FFA733',
            height:134
        },
        headerTitleStyle: {
            justifyContent: 'flex-start',
            color:'white',
            fontFamily:'google-sans-bold',
            fontSize:30,
            fontWeight:undefined

        }
    }

    state={
        user: {...this.props.navigation.state.params.userObject.wipi,rank:3},
        fineFactor: 150
    }
    
     pollUserCounters = async ()=> {
        await fetch("https://us-central1-wipi-cee66.cloudfunctions.net/getUserInstance", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": this.state.user.userId
              
            })
        }).then(async (response) => {
            
            const responseObj = await response.json();
            console.log('response obj is ', responseObj);
            this.setState(
                {   
                    user:responseObj,
                });
            Promise.resolve();
        })
    }
    
    render() {
        let space="";
        let flex="row";
        if (Platform.OS!=='ios'){
            space='        ';
            flex='row-reverse'
        }

        /* Go ahead and delete ExpoConfigView and replace it with your
         * content, we just wanted to give you a quick view of your config */

        let photoURL = this.state.user.photoURL
        if (_.includes(photoURL, 'facebook')){
            photoURL = `${photoURL}/?type=large`
        }
        return (
             
            <View style={styles.container}>
            <NavigationEvents
                onWillFocus={this.pollUserCounters}
            />
                <View style={styles.pictureWrapper}>
                    <Image
                        style = {styles.picture}
                        source ={{uri: photoURL}}
                    />
                </View>
                <View>
                    <Text style={styles.titleText}>
                        {this.state.user.displayName}
                    </Text>
                </View>
                {/* <View style={styles.stats}> */}
                    <View style={styles.totalReportsWrapper}>
                        <Text style={styles.numberText}>
                            {this.state.user.counters.totalReports}
                        </Text>
                        <Text style={styles.totalReportsText}>
                            {'Total Reports'}
                        </Text>
                    </View>
                    <View style={styles.peopleSavedWrapper}>
                        <Text style={styles.numberText}>
                            {
                                this.state.user.counters.totalPeopleSaved    
                            }
                        </Text>
                        <Text style={styles.peopleSavedText}>
                            {'People Saved'}
                        </Text>
                    </View>
                    <View style={styles.moneySavedWrapper}>
                        <Text style={styles.numberText}>
                            {`${this.state.user.counters.totalPeopleSaved * this.state.fineFactor}₪`}
                        </Text>
                        <Text style={styles.moneySavedText}>
                            {'Money Saved'}
                        </Text>
                    </View>
                    <View style={styles.rankWrapper}>
                        <View style={styles.starsWrapper}>
                            {this.state.user.rank>4 ? goldStar : blueStar}
                            {this.state.user.rank>3 ? goldStar : blueStar}
                            {this.state.user.rank>2 ? goldStar : blueStar}
                            {this.state.user.rank>1 ? goldStar : blueStar}
                            {goldStar}
                                </View>
                        <Text style={styles.levelText}>
                            {'Level:  Cool Kid'}
                        </Text>
                    </View>
                    <View  style={styles.logoutWrapper}>
                        <Icon.Button
                            name="sign-out"
                            onPress={()=>firebase.auth().signOut()}
                            style={styles.logoutButton}
                            fontFamily={'google-sans-medium'}
                            flexDirection={flex}
                            iconRight={false}>{space+'Logout'}
                        </Icon.Button>
                    </View>
                {/* </View> */}
            </View>)
    }
}



/**
 *
 *
 *  <Image
 source ={{uri: goldStar}}/>
 {this.state.user.rank>1 ? ( <Image
                                source = {require('../assets/svgs/Star.svg')}/>):( <Image
                                source ={require('../assets/svgs/StarBlue.svg')}/>)}
 {this.state.user.rank>2 ? ( <Image
                                source ={require('../assets/svgs/Star.svg')}/>):( <Image
                                source ={require('../assets/svgs/StarBlue.svg')}/>)}
 {this.state.user.rank>3 ? ( <Image
                                source ={require('../assets/svgs/Star.svg')}/>):( <Image
                                source ={require('../assets/svgs/StarBlue.svg')}/>)}
 {this.state.user.rank>4 ? ( <Image
                                source ={require('../assets/svgs/Star.svg')}/>):( <Image
                                source ={require('../assets/svgs/StarBlue.svg')}/>)}
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#3c9bff',
        
    },
    picture: {
        resizeMode:'stretch',
        width: delimiter,
        height: delimiter,
        borderRadius:radius,
    },
    logoutButtonWrapper:{
        flex:1,
        top:20

    },
    logoutButton: {
        bottom:0,
        width: '100%',
        height: 50,
        backgroundColor: "#FF6969",
    },
    pictureWrapper:{
        justifyContent:'center',
        alignItems:'center',
        width: delimiter+3,
        height: delimiter+3,
        borderRadius:radius,
        borderColor:'#ffffff',
        borderWidth: 3
    },
    titleText:{
        margin:5,
        fontWeight:'bold',
        fontSize:25,
        color:'#ffffff',
        fontFamily:'google-sans-medium',
    },
    totalReportsText:{
        fontSize:15,
        color:'#ffffff',
        fontFamily:'google-sans-medium'
    },
    totalReportsWrapper:{
        position:'absolute',
        right:15,
        top:15,
        alignItems:'center'
    },
    peopleSavedWrapper:{
        position:'absolute',
        left:30,
        top:30,
        alignItems:'center'
    },
    peopleSavedText:{
        fontSize:15,
        color:'#FFA733',
        fontFamily:'google-sans-medium'
    },
    moneySavedWrapper:{
        marginTop:20,
        alignSelf:'center',
        alignItems:'center'
    },
    moneySavedText:{
        fontSize:15,
        color:'#ffffff',
        fontFamily:'google-sans-medium'
    },
    numberText:{
        fontSize:25,
        color:'#FFA733',
        fontFamily:'google-sans-medium'
    },
    starsWrapper:{
       flexDirection:'row'
    },
    rankWrapper:{
        alignSelf:'center',
        alignItems:'center',
    },
    levelText:{
        fontSize:20,
        color:'#8A8A8A',
        fontFamily:'google-sans-medium'
    },
    stats:{
        marginTop:15,
        height:height*0.366,
        width:width/3*2,
        backgroundColor:'#ffffff',
        borderRadius:8,
    }
})