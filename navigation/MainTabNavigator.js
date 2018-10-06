import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import LinksScreen from '../screens/LinksScreen'
import SettingsScreen from '../screens/SettingsScreen'
import ReportsScreen from '../screens/ReportsScreen'
import CameraScreen from '../screens/CameraScreen'
import GalleryScreen from '../screens/GalleryScreen'


const HomeStack = createStackNavigator({
        Home: HomeScreen,
        Reports: ReportsScreen,
        Camera: CameraScreen,
        Gallery:GalleryScreen
    },
    {
        initialRouteName: 'Home',
    })

HomeStack.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={
                Platform.OS === 'ios'
                    ? `ios-information-circle${focused ? '' : '-outline'}`
                    : 'md-information-circle'
            }
        />
    ),
}

const LinksStack = createStackNavigator({
    Links: LinksScreen,
})

LinksStack.navigationOptions = {
    tabBarLabel: 'Links',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link'}
        />
    ),
}

const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
})

SettingsStack.navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
        />
    ),
}

export default createBottomTabNavigator({
    HomeStack,
    LinksStack,
    SettingsStack,
})
