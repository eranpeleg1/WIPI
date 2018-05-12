import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation'; // 1.0.0-beta.23
import { NavigationComponent } from 'react-native-material-bottom-navigation'; // 0.7.0
import { MaterialCommunityIcons } from '@expo/vector-icons'; // 6.2.2
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Constants } from 'expo';
import Home from './Home.js'
import ReportAction from './ReportAction.js'
import Profile from './Profile.js'


const MainTabNavigator = TabNavigator(
    {
        ReportAction: {
            screen: ReportAction,
            navigationOptions: {
                tabBarLabel: 'Report',
                tabBarIcon: () => <MaterialCommunityIcons size={24} name="alert-circle" color="grey" />,
            },
        },
        Home: {
            screen: Home,
            navigationOptions: {
                tabBarLabel: 'Home',
                tabBarIcon: () => (
                    <MaterialCommunityIcons size={24} name="map-marker" color="grey" />
                ),

            },
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                tabBarLabel: 'Profile',
                tabBarIcon: () => <MaterialCommunityIcons size={24} name="account" color="grey" />,
            },
        },
    },
    {
        initialRouteName: 'Home',
        swipeEnabled: false,
        tabBarComponent: NavigationComponent,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            bottomNavigationOptions: {
                activeLabelColor:'#3c9bff',
                labelColor: 'grey',
                rippleColor: 'white',
                shifting: false,
                tabs: {
                    ReportAction: {
                        activeIcon:<MaterialCommunityIcons size={24} name="alert-circle" color="#3c9bff" />,
                        barBackgroundColor: '#ffffff',
                    },
                    Profile: {
                        activeIcon:<MaterialCommunityIcons size={24} name="account" color="#3c9bff" />,
                        barBackgroundColor: '#ffffff',
                    },
                    Home: {
                        activeIcon:<MaterialCommunityIcons size={24} name="map-marker" color="#3c9bff" />,
                        barBackgroundColor: '#ffffff',
                    },
                },
            },
        },
    }
);

export default class App extends Component {
    render() {

        return <MainTabNavigator />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
    },
});
