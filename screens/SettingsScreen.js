import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import {Text, View, StyleSheet, Dimensions, TouchableOpacity, Image,Platform} from 'react-native';
import {Constants} from "expo";
import _ from 'lodash'
import {goldStar , blueStar} from "../components/smallComps";
let {height, width} = Dimensions.get('window');
const radius = parseInt(width/8)
const delimiter = radius*2
import * as firebase from "firebase";
import googleSans from '../assets/fonts/GoogleSans-Bold.ttf'
import Icon from 'react-native-vector-icons/FontAwesome';
export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: '#Profile',
        headerStyle:{

            backgroundColor: '#FFA733',
            height:134
        },
        headerTitleStyle: {
            justifyContent: 'flex-end',
            fontWeight: 'bold',
            color:'#ffffff',
        }
    }

    state={
        user: {...this.props.navigation.state.params.user,rank:3}
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
        console.log('user in settingsssss       ',this.state.user)

        if (_.includes(photoURL, 'facebook')){
            photoURL = `${photoURL}/?type=large`
        }
        console.log(photoURL)
        return (
            <View style={styles.container}>
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
                <View style={styles.stats}>
                    <View style={styles.totalReportsWrapper}>
                        <Text style={styles.numberText}>
                            {36}
                        </Text>
                        <Text style={styles.totalReportsText}>
                            {'Total Reports'}
                        </Text>
                    </View>
                    <View style={styles.peopleSavedWrapper}>
                        <Text style={styles.numberText}>
                            {24}
                        </Text>
                        <Text style={styles.peopleSavedText}>
                            {'People Saved'}
                        </Text>
                    </View>
                    <View style={styles.moneySavedWrapper}>
                        <Text style={styles.numberText}>
                            {'5600₪'}
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
                    <Icon.Button
                        name="sign-out"
                        onPress={()=>firebase.auth().signOut()}
                        style={styles.logoutButton}
                        fontFamily={googleSans}
                        flexDirection={flex}
                        iconRight={false}>{space+'Logout'}
                    </Icon.Button>
                </View>
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
    logoutButton: {
        width: '100%',
        height: 40,
        bottom: 0,
        backgroundColor: "#DD4B39",
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
        color:'#ffffff'
    },
    totalReportsText:{
        fontSize:15,
        color:'#000000'
    },
    totalReportsWrapper:{
        position:'absolute',
        right:15,
        top:15,
        alignItems:'center'
    },
    peopleSavedWrapper:{
        position:'absolute',
        left:15,
        top:15,
        alignItems:'center'
    },
    peopleSavedText:{
        fontSize:15,
        color:'#000000'
    },
    moneySavedWrapper:{
        marginTop:100,
        alignSelf:'center',
        alignItems:'center'
    },
    moneySavedText:{
        fontSize:15,
        color:'#000000'
    },
    numberText:{
        fontSize:25,
        color:'#000000'
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
        color:'#000000'
    },
    stats:{
        marginTop:10,
        height:height/2 - 70,
        width:width/3*2,
        backgroundColor:'#ffffff',
        borderRadius:8
    }
})