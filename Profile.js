import React from 'react';
import { StyleSheet, Text, View} from 'react-native';

export default class Profile extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    {'this is a profile page!!!!!!!'}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'blue',
    },
    text:{
        fontWeight: 'bold',
        color: 'white',
        fontSize:30
    }
});