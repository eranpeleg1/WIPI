import React from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity,Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default class SubView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bounceValue: new Animated.Value(this.props.showValue),  //This is the initial position of the subview
            buttonText: "Show Subview",
            hidden:true,
        };
    }

    _toggleSubview() {
        let toValue = this.props.showValue;
        if(this.state.hidden) {
            toValue = this.props.hideValue;
        }

        //This will animate the transalteY of the subview between 0 & 100 depending on its current state
        //100 comes from the style below, which is the height of the subview.
        Animated.spring(
            this.state.bounceValue,
            {
                toValue: toValue,
                velocity: 3,
                tension: 2,
                friction: 8,
            }
        ).start();
        this.setState({
            buttonText: !this.state.hidden ? "Show Subview" : "Hide Subview"
            ,hidden:!this.state.hidden});
    }

    componentDidUpdate(){
        if (this.props.show===this.state.hidden){
            this._toggleSubview();
        }
    }

    render() {
        console.log("sub ",this.props.address)
        let mainText='';
        let secondaryText='';
        let address=this.props.address;
        if (address!==null ){
            mainText=address.structured_formatting.main_text;
            secondaryText=address.structured_formatting.secondary_text;
        }
        let opacity
        return (
                <Animated.View
                    style={[styles.subView,{height:this.props.height},
                        {transform: [{translateY: this.state.bounceValue}]}]}
                >
                    <View style={{backgroundColor:'#323232',height:50}}>
                    </View>
                    <View style={{height:this.props.height-50,backgroundColor:this.props.backgroundColor}}>

                        {this.children}
                    </View>
                    {!this.state.hidden &&
                    <View style={styles.buttonContainer}>

                        <TouchableOpacity
                            style={[styles.button]}
                            onPress={() => this.props.endPark()}
                            activeOpacity={0.8}
                        >
                            <Icon name="close" size={20} color="white"/>
                        </TouchableOpacity>
                    </View>
                    }
                    <View style={styles.address}>
                        <Text style={{fontWeight: 'bold', color:'white', fontSize:20,opacity:1.0}}>
                            {mainText}
                        </Text>

                        <Text style={{color: 'white', fontSize:12,opacity:1.0}}>
                            {secondaryText}
                        </Text>
                    </View>
                </Animated.View>
        );
    }

}



const styles = StyleSheet.create({
    buttonContainer:{
        position:'absolute',
        top:14,
        right:13,
        height:58,
        width:58,
        elevation:4,
        backgroundColor: 'transparent',
        borderRadius:29,
        justifyContent:'center',
        alignItems: 'center',
        paddingTop:1,
        margin:7,
    },
    button: {
        backgroundColor:'#FF6E69',
        borderWidth: 0,
        height: 56,
        width: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowOffset: {
            height: 2.3,
            width: 0
        },
        bottom:1,
        elevation:2,
        zIndex:3


    },



    subView: {
        position: "absolute",
        bottom:50,
        left: 0,
        right: 0,
        zIndex:10,
        backgroundColor:'transparent',
        elevation:10
    },
    address:{
        position: "absolute",
        top:4,
        left:15,

    }
});


const stylesShadowWithView = StyleSheet.create({
    buttonContainer:{
        position:'absolute',
        top:14,
        right:13,
        height:58,
        width:58,
        elevation:4,
        shadowOpacity:1.0,
        shadowColor:'#000',
        shadowRadius:29,
        backgroundColor: 'transparent',
        shadowOpacity:1.0,
        borderRadius:29,
        justifyContent:'center',
        alignItems: 'center',
        paddingTop:1,
        margin:7,
    },
    button: {
        backgroundColor:'#FF6E69',
        borderWidth: 0,
        height: 56,
        width: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0
        },
        bottom:1,
        elevation:2,

    },



    subView: {
        position: "absolute",
        bottom:50,
        left: 0,
        right: 0,
        zIndex:10,
        backgroundColor:'transparent',
        elevation:10
    },
    address:{
        position: "absolute",
        top:4,
        left:15,

    }
});




/*
*       <SubView showValue={300}
                             hideValue={0}
                             show={this.state.parkingMode}
                             endPark={this.endPark}
                             height={300}
                             backgroundColor={'#3B9BFF'}
                    />
* */