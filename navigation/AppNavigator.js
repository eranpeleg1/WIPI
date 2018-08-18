import React from 'react';
import { createSwitchNavigator,createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import LoginScreen from '../screens/LoginScreen'
const LoginStack = createStackNavigator({ Login: LoginScreen },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    });
export default createSwitchNavigator({
        // You could add another route here for authentication.
        // Read more at https://reactnavigation.org/docs/en/auth-flow.html
        Main: MainTabNavigator,
        Login: LoginStack,
        AuthLoading: AuthLoadingScreen,
    },
    {
        initialRouteName: 'AuthLoading',
    });