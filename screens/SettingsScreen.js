import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TextInput,
    PixelRatio,
    Button,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as firebase from "firebase";
import googleSans from '../assets/fonts/GoogleSans-Bold.ttf'
import { ExpoConfigView } from '@expo/samples';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'settings',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
      let space="";
      let flex="row";
      if (Platform.OS!=='ios'){
          space='        ';
          flex='row-reverse'
      }

      return (
        <View style={styles.container}>
        <Icon.Button
            name="sign-out"
            onPress={()=>firebase.auth().signOut()}
            style={styles.buttonGoogle}
            backgroundColor='transparent'
            fontFamily={googleSans}
            borderRadius={150}
            flexDirection={flex}
            iconRight={false}>{space+'Logout'}
        </Icon.Button>
        </View>
  )}
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#3B9BFF',
    },
    buttonGoogle: {
        borderWidth: 0,
        borderColor: 'transparent',
        borderRadius: 100,
        width: 150,
        height: 40,
        bottom:8,
        backgroundColor: "#DD4B39",
    }
});
