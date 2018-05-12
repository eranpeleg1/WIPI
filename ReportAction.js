import React from 'react';


import { StyleSheet, Text, View,TouchableOpacity,Animated ,} from 'react-native';

export default class ReportAction extends React.Component {


    render() {
        return (
            <View style={styles.container}>
                <Text>
                    {'this is a Report Action page!!!!!!!'}
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
        backgroundColor:'red',
    },
    text:{
        fontWeight: 'bold',
        color: 'white',
        fontSize:30
    }
});