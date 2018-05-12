import React from 'react';
import { StyleSheet, Text, View ,ImageBackground} from 'react-native';
const background = require('./assets/wipiSplashBackground.png');

export default class Splash extends React.Component {

    componentDidMount(){
        console.log("handler "+ this);
        this.props.handler();
    }

    render() {
        return(
            <ImageBackground source={background} style={styles.container}/>
        )}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'transparent'
    }
});