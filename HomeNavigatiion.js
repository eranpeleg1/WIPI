import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation'; // 1.0.0-beta.23
import { NavigationComponent } from 'react-native-material-bottom-navigation'; // 0.7.0
import { MaterialIcons } from '@expo/vector-icons'; // 6.2.2
import { Constants } from 'expo';

const Movie = () => (
    <View style={styles.container}>
        <Text>Movie Tab</Text>
    </View>
);

const TV = () => (
    <View style={styles.container}>
        <Text>TV Tab</Text>
    </View>
);

const Actors = ({navigation}) => (
    <View style={styles.container}>
        <Text>Actors Page</Text>
        <Button onPress={() => navigation.navigate('Actor', {name: 'Matt Damon'})} title="Go to actor page" />
    </View>
);

const Actor = ({navigation}) => (
    <View style={styles.container}>
        <Text>Individual Actor Page, the passed actor is {navigation.state.params.name}</Text>
    </View>
);

const Pref = () => (
    <View style={styles.container}>
        <Text>Pref Tab</Text>
    </View>
);

const Extractor = () => (
    <View style={styles.container}>
        <Text>Extractor Tab</Text>
    </View>
);

const ActorsStackNavigator = StackNavigator({
    Actors: {
        screen: Actors,
    },
    Actor: {
        screen: Actor,
    },
}, {
    navigationOptions: {
        header: null,
    },
});

const MainTabNavigator = TabNavigator(
    {
        Movie: {
            screen: Movie,
            navigationOptions: {
                tabBarLabel: 'Movies',
                tabBarIcon: () => (
                    <MaterialIcons size={24} name="theaters" color="white" />
                ),
            },
        },
        TV: {
            screen: TV,
            navigationOptions: {
                tabBarLabel: 'TV',
                tabBarIcon: () => <MaterialIcons size={24} name="tv" color="white" />,
            },
        },
        Actors: {
            screen: ActorsStackNavigator,
            navigationOptions: {
                tabBarLabel: 'Actors',
                tabBarIcon: () => <MaterialIcons size={24} name="face" color="white" />,
            },
        },
        Pref: {
            screen: Pref,
            navigationOptions: {
                tabBarLabel: 'Star',
                tabBarIcon: () => <MaterialIcons size={24} name="star" color="white" />,
            },
        },
        Extractor: {
            screen: Extractor,
            navigationOptions: {
                tabBarLabel: 'Extractor',
                tabBarIcon: () => (
                    <MaterialIcons size={24} name="settings" color="white" />
                ),
            },
        },
    },
    {
        tabBarComponent: NavigationComponent,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            bottomNavigationOptions: {
                labelColor: 'white',
                rippleColor: 'white',
                shifting: true,
                tabs: {
                    Movie: {
                        barBackgroundColor: '#4589f2',
                    },
                    TV: {
                        barBackgroundColor: '#4589f2',
                    },
                    Actors: {
                        barBackgroundColor: '#4589f2',
                    },
                    Pref: {
                        barBackgroundColor: '#4589f2',
                    },
                    Extractor: {
                        barBackgroundColor: '#4589f2',
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
