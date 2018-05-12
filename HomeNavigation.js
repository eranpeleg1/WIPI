import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabNavigator, TabBarBottom } from 'react-navigation'; // Version can be specified in package.json
import Home from 'Home.js'
import Profile from 'Profile.js'
import ReportAction from 'ReportAction.js'


const MainTabNavigator = TabNavigator(
    {
        Home: { screen: Home },
        Profile: { screen: Profile },
        ReportAction: {screen: ReportAction}
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Home') {
                    iconName = `map-marker`;
                } else if (routeName === 'Profile') {
                    iconName = `account`;
                }
                else//ReportAction
                {
                    iconName = `whistle`;
                }


                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Icon name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
        animationEnabled: false,
        swipeEnabled: false,
    }
);

export default class HomeNavigation extends Component {
    render() {
        return <MainTabNavigator />;
    }
}
