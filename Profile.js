import React from 'react';


import { StyleSheet, Text, View,TouchableOpacity,Animated ,} from 'react-native';

export default class Profile extends React.Component {


    render() {
        return (
            <View style={styles.container}>
                <Text>
                    {'this is a profile page!!!!!!!'}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'pink',
    },
    text:{
        fontWeight: 'bold',
        color: 'white',
        fontSize:30
    }
});