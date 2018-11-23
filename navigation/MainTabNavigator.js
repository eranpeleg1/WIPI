import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import LinksScreen from '../screens/LinksScreen'
import SettingsScreen from '../screens/SettingsScreen'
import ReportsScreen from '../screens/ReportsScreen'

const MapStack = createStackNavigator({
        Map: HomeScreen,
        Reports: ReportsScreen,
    },
    {initialRouteKey: 'Map', initialRouteName: 'Map'}
)

MapStack.navigationOptions = {
    tabBarLabel: 'Map',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'map'}
        />
    ),
}

const SettingsStack = createStackNavigator
(
    {
        Settings: SettingsScreen,
    },
    {initialRouteKey: 'Settings', initialRouteName: 'Settings'}

)

SettingsStack.navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
          name={'settings'}
          focused={focused}

      />
    ),
}

const NotificationsStack = createStackNavigator
    (
        { Notifications: LinksScreen },
        {initialRouteKey: 'Notifications', initialRouteName: 'Notifications'}
    )

NotificationsStack.navigationOptions = {
    tabBarLabel: 'Notifications',
    tabBarIcon: ({ focused }) => (
        <TabBarIcon
            focused={focused}
            name={'notifications'}
        />
    )
}

export default createBottomTabNavigator({
    MapStack,
    SettingsStack,
    NotificationsStack,
})
