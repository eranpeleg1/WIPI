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
        user: this.props.navigation.state.params.userObject.wipi,
        rank:2,
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
          <View style={styles.content}>
            <NavigationEvents
                onWillFocus={this.pollUserCounters}
            />
                <View style={styles.pictureWrapper}>
                    <Image
                        style = {styles.picture}
                        source ={{uri: photoURL}}
                    />
                </View>
                <View style={styles.displayNameWrapper}>
                    <Text style={styles.displayNameText}>
                        {this.state.user.displayName}
                    </Text>
                </View>
                <View style={styles.rankWrapper}>
                        <View style={styles.starsWrapper}>
                            { this.state.rank>0 ? goldStar : blueStar}
                            {this.state.rank>1? goldStar : blueStar}
                            {this.state.rank>2 ? goldStar : blueStar}
                            {this.state.rank>3 ? goldStar : blueStar}
                            {this.state.rank>4 ? goldStar : blueStar}
                                </View>
                        <Text style={styles.levelText}>
                            {'Level:  Cool Kid'}
                        </Text>
                    </View>
                <View style={styles.countersWrapper}>
                        <View style={styles.countersItem}>
                            <Text style={styles.numberText}>
                                {this.state.user.counters.totalReports}
                            </Text>
                            <Text style={styles.countersText}>
                                {'Total Reports'}
                            </Text>
                        </View>
        
                        <View style={styles.countersItem}>
                                 <Text style={styles.numberText}>
                                {
                                    this.state.user.counters.totalPeopleSaved    
                                }
                                </Text>
                                <Text style={styles.countersText}>
                                {'People Saved'}
                                 </Text>
                        </View>    
                        <View style={styles.countersItem}>
                            

                            <Text style={styles.numberText}>
                                {`${this.state.user.counters.totalPeopleSaved * this.state.fineFactor}`}
                            </Text>
                            <Text style={styles.countersText}>
                                {'Shekels Saved'}
                            </Text>
                        </View>
                    </View>
                <View style={styles.logoutWrapper}>
                        <Icon.Button
                            name="sign-out"
                            onPress={()=>firebase.auth().signOut()}
                            style={styles.logoutButton}
                            fontFamily={'google-sans-medium'}
                            flexDirection={flex}
                            iconRight={false}>{space+'Logout'}
                        </Icon.Button>
                    </View>
          </View>
        </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'column',
        justifyContent:'space-around',
        alignItems: 'center',
        backgroundColor: '#3c9bff', 
    },
    content:{
        flexDirection:'column',
        height:'70%',
        alignItems:'center'
    },
    picture: {
        resizeMode:'stretch',
        width: delimiter,
        height: delimiter,
        borderRadius:radius,
    },
    logoutButtonWrapper:{
        flex:2,
    },
    logoutButton: {
        width: 200,
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
        borderWidth: 3,
    },
    displayNameWrapper:{
        flex:2
    },
    displayNameText:{
        fontWeight:'bold',
        fontSize:25,
        color:'#ffffff',
        fontFamily:'google-sans-medium',
    },
 
    starsWrapper:{
       flexDirection:'row'
    },
    rankWrapper:{
        flex:4,
        // alignSelf:'center',
        alignItems:'center',
    },
    levelText:{
        fontSize:18,
        color:'#ffff',
        fontFamily:'google-sans-medium'
    },

    countersWrapper:{
        flex:7,
        flexDirection:'row',
        
    },
    countersText:{
        fontSize:18,
        color:'#ffffff',
        fontFamily:'google-sans-medium'
    }, 
    numberText:{
        fontSize:20,
        color:'#ffffff',
        fontFamily:'google-sans-regular'
    },
    countersItem:{
        flex:1,
    // marginRight:15,
    flexDirection:'column',
    // justifyContent:'space-around',
    alignItems:'center'
    }
})