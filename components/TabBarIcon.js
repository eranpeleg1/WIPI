import React from 'react';
import { Icon } from 'expo';

import Colors from '../constants/Colors';

export default class TabBarIcon extends React.Component {
  
  render() {
    
    switch (this.props.name){
      case "map":
       return (
        <Icon.MaterialCommunityIcons

          name={"map-marker-radius"}
          size={26}
          style={{ marginBottom: -3 }}
          color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
         />
        )
      case "settings":
         return (
        <Icon.Ionicons
        name={"md-person"}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        )
      case "notifications":
       return (
          <Icon.Ionicons
          name={"md-time"}
          size={26}
          style={{ marginBottom: -3 }}
          color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
           />
          )
      }
  }
}