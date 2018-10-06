import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo';
import Icon from "react-native-vector-icons/MaterialIcons";

export default class CameraScreen extends React.Component {
    static navigationOptions = {
        header: null,
        headerVisible: false,
        headerMode: 'none',
    };

    pressed=false

    takePhoto = async () => {
        if (!this.pressed) {
            this.pressed = true
            let photo = await this.camera.takePictureAsync();
            console.log("photo " + JSON.stringify(photo));
            const {params} = this.props.navigation.state;
            params.updateReport(photo)
            this.props.navigation.navigate('Reports')
        }
    }

    render() {
            return (
                <View style={{ flex: 1 }}>
                    <Camera style={{ flex: 1 }} ref={ref => { this.camera = ref; }}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                alignItems: 'center'
                            }}>
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        bottom: 15
                                    }}
                                    onPress={this.takePhoto}
                                    activeOpacity={0.8}
                                >
                                    <Icon
                                        name="photo-camera"
                                        backgroundColor='white'
                                        size={50}
                                        color='white'
                                    />
                                </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            )
        }
}