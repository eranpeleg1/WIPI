import React, { Component } from 'react';
import {CameraRoll, Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { Constants } from 'expo';

export default class GalleryScreen extends Component {
    static navigationOptions = {
        header: null,
        headerVisible: false,
        headerMode: 'none',
    };

    state = { photos: null };
    switchToReports = () => this.props.navigation.navigate('Reports')
    selectPicture = (photo) =>{
        const {params} = this.props.navigation.state;
        params.updateReport(photo)
        this.switchToReports()
    }

    render() {
        let { photos } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Select a photo</Text>
                {photos
                    ? <View style={styles.gallery}>{this._renderPhotos(photos)}</View>
                    : <Text style={styles.paragraph}>Fetching photos...</Text>}
                    <TouchableOpacity
                style={[styles.mapButton, styles.backButton]}
                onPress={this.switchToReports}
                activeOpacity={0.8}
            >
                <Text style={{fontWeight: 'bold', color: 'white', fontSize: 12}}>
                    Back
                </Text>
            </TouchableOpacity>
            </View>
        );
    }

    _renderRow(photo1,photo2,key){
        return (
            <View style={styles.row} key={key} >
                <TouchableOpacity style={{ height: '100%', width: '48%',margin:5 }}
                    onPress={() => this.selectPicture(photo1.image)}
                >
                <Image
                    source={photo1.image}
                    resizeMode="stretch"
                    style={{ height: '100%', width: '100%', resizeMode: 'contain' , borderColor:'white',borderWidth:5}}

                />
                </TouchableOpacity>
                <TouchableOpacity style={{ height: '100%', width: '48%',margin:5 }}
                    onPress={() => this.selectPicture(photo2.image)}
                >
                <Image
                    source={photo2.image}
                    resizeMode="stretch"
                    style={{ height: '100%', width: '100%', resizeMode: 'contain' , borderColor:'white',borderWidth:5}}

                />
                </TouchableOpacity>
            </View>)

    }

    _renderPhotos = (photos) => {
        let images = [];
        if (photos.edges[0].node!==null && photos.edges[1].node!==null)
        images.push(this._renderRow(photos.edges[0].node,photos.edges[1].node,0))
        if (photos.edges[2].node!==null && photos.edges[3].node!==null)
        images.push(this._renderRow(photos.edges[2].node,photos.edges[3].node,1))
        return images;
    }

    componentDidMount() {
        this._getPhotosAsync().catch(error => {
            console.error(error);
        });
    }

    async _getPhotosAsync() {
        let photos = await CameraRoll.getPhotos({ first: 4 });
        console.log("gallery:"+JSON.stringify(photos))
        this.setState({ photos });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#3B9BFF',
        alignItems:'center',
        justifyContent: 'center',
    },
    gallery:{
        margin:5
    }
    ,
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
    header: {
        margin:5,
        fontWeight: 'bold',
        color:'white',
        fontSize: 30,
        opacity:1.0,
    },
    row: {
        alignItems:'center',
        height:'35%',
        width:'90%',
        margin:5,
        flexDirection: 'row'
    },
    mapButton: {
        margin:5,
        borderWidth: 0,
        height: 56,
        width: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000000",
        shadowOpacity: 0.7,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        },
        bottom: 10,
        elevation: 2,
        zIndex: 3
    },
    backButton: {
        backgroundColor: '#FF6E69',
    },
});
