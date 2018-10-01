import React from 'react';
import { StyleSheet, Text, View} from 'react-native';

export default class ReportAction extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    {'this is a Report action page!!!!!!!'}
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
        backgroundColor:'pink',
    },
    text:{
        fontWeight: 'bold',
        color: 'white',
        fontSize:30
    }
});


